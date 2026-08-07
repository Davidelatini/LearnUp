/**
 * JARVIS — OS Bridge  (porta 3001)
 * Accesso completo a Windows: filesystem, processi, registry, servizi,
 * rete, audio, display, notifiche, power management, visione dello schermo.
 */

const express = require('express');
const cors    = require('cors');
const { exec } = require('child_process');
const path    = require('path');
const fs      = require('fs');
const os      = require('os');
const https   = require('https');
const http    = require('http');
const {
  almaToolSchemas,
  executeAlmaTool,
  getActionLog,
  getSettings,
  logAlmaToolError,
  requiresConfirmation,
} = require('./alma-tools');
const {
  addEvent,
  addNote,
  capitalToolSchemas,
  dataToolSchemas,
  executeDataTool,
  getBilancio,
  isDataTool,
  readAllData,
  readScope,
  SCOPES,
} = require('./data-tools');
const { BACKUP_FILE, readBackup, writeBackup } = require('./backup');

function loadLocalEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] == null) process.env[key] = value;
  }
}

loadLocalEnv();

function writeLocalEnvValue(key, value) {
  const envPath = path.resolve(process.cwd(), '.env');
  const current = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const lines = current ? current.split(/\r?\n/) : [];
  const escapedValue = String(value).replace(/\r?\n/g, '').trim();
  let found = false;

  const nextLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return line;
    const eq = line.indexOf('=');
    if (eq === -1) return line;
    const currentKey = line.slice(0, eq).trim();
    if (currentKey !== key) return line;
    found = true;
    return `${key}=${escapedValue}`;
  });

  if (!found) {
    if (nextLines.length && nextLines[nextLines.length - 1] !== '') nextLines.push('');
    nextLines.push(`${key}=${escapedValue}`);
  }

  fs.writeFileSync(envPath, `${nextLines.join(os.EOL).replace(/\s+$/g, '')}${os.EOL}`, 'utf8');
  process.env[key] = escapedValue;
}

function getOpenAIKeyStatus() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || '';
  return {
    configured: Boolean(apiKey),
    last4: apiKey ? apiKey.slice(-4) : '',
  };
}

function normalizeOpenAIKey(input) {
  let value = String(input || '').trim();
  value = value.replace(/^["']|["']$/g, '').trim();

  const envMatch = value.match(/(?:OPENAI_API_KEY|VITE_OPENAI_API_KEY)\s*=\s*["']?([^"'\s]+)/i);
  if (envMatch) value = envMatch[1].trim();

  const keyMatch = value.match(/sk-[A-Za-z0-9_-]+/);
  return keyMatch ? keyMatch[0] : value;
}

const app  = express();
const PORT = 3001;
const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const pendingAlmaActions    = new Map();
const pendingVyctorActions  = new Map();
const pendingAlfredActions  = new Map();
const pendingCapitalActions = new Map();
const pendingMindActions    = new Map();
const botToolSchemas         = [...almaToolSchemas, ...dataToolSchemas];
const capitalBotToolSchemas  = [...dataToolSchemas, ...capitalToolSchemas];
const mindToolSchemas        = dataToolSchemas.filter(t => t.function.name === 'leggi_dati');
const LEGACY_TOOL_ALLOWLIST = new Set([
  'get_system_info',
  'get_processes',
  'get_datetime',
  'get_disk_info',
  'list_windows',
  'list_installed_apps',
]);

app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));
app.use(express.json({ limit: '50mb' }));

app.get('/openai/key-status', (_, res) => {
  res.json(getOpenAIKeyStatus());
});

app.post('/openai/api-key', (req, res) => {
  const apiKey = normalizeOpenAIKey(req.body?.apiKey);
  if (!apiKey) {
    return res.status(400).json({ error: 'Inserisci una API key OpenAI.' });
  }
  if (!apiKey.startsWith('sk-')) {
    return res.status(400).json({ error: 'Chiave non valida. Incolla una chiave OpenAI che inizi con sk-, oppure una riga OPENAI_API_KEY=sk-...' });
  }

  try {
    writeLocalEnvValue('OPENAI_API_KEY', apiKey);
    return res.json(getOpenAIKeyStatus());
  } catch (err) {
    return res.status(500).json({ error: `Impossibile salvare .env: ${err.message}` });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PowerShell executor — usa -EncodedCommand (UTF-16LE base64)
// NESSUNA restrizione su cosa viene eseguito.
// ─────────────────────────────────────────────────────────────────────────────
function ps(script, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const encoded = Buffer.from(script, 'utf16le').toString('base64');
    exec(
      `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand ${encoded}`,
      { timeout: timeoutMs, encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err && !stdout) return reject(new Error(stderr || err.message));
        resolve((stdout || '').trim());
      }
    );
  });
}

// cmd.exe per comandi non-PowerShell
function cmd(command, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: timeoutMs, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err && !stdout) return reject(new Error(stderr || err.message));
        resolve((stdout || '').trim());
      }
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS
// ─────────────────────────────────────────────────────────────────────────────
const tools = {

  // ── ESECUZIONE ────────────────────────────────────────────────────────────

  run_command: async ({ command }) => {
    const out = await ps(command, 30000);
    return out || '(nessun output)';
  },

  run_cmd: async ({ command }) => {
    const out = await cmd(command, 20000);
    return out || '(nessun output)';
  },

  // ── APPLICAZIONI ──────────────────────────────────────────────────────────

  open_app: async ({ name }) => {
    await ps(`Start-Process "${name}"`);
    return `Avviato: ${name}`;
  },

  open_url: async ({ url }) => {
    await ps(`Start-Process "${url}"`);
    return `Aperto: ${url}`;
  },

  open_file: async ({ path: p }) => {
    await ps(`Start-Process "${p}"`);
    return `Aperto: ${p}`;
  },

  close_app: async ({ name }) => {
    await ps(`Stop-Process -Name "${name}" -Force -ErrorAction SilentlyContinue`);
    return `Terminato: ${name}`;
  },

  list_windows: async () => {
    return await ps(`
      Add-Type @"
        using System; using System.Runtime.InteropServices;
        public class Win32 {
          [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
          [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, System.Text.StringBuilder s, int n);
        }
"@
      Get-Process | Where-Object {$_.MainWindowHandle -ne 0} |
        Select-Object Name,Id,@{N='Title';E={$_.MainWindowTitle}} |
        Where-Object {$_.Title -ne ''} | ConvertTo-Json
    `);
  },

  focus_window: async ({ title }) => {
    return await ps(`
      Add-Type @"
        using System; using System.Runtime.InteropServices;
        public class WinApi {
          [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
          [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
        }
"@
      $proc = Get-Process | Where-Object { $_.MainWindowTitle -like "*${title}*" } | Select-Object -First 1
      if ($proc) { [WinApi]::ShowWindow($proc.MainWindowHandle, 9); [WinApi]::SetForegroundWindow($proc.MainWindowHandle); "Finestra portata in primo piano: $($proc.MainWindowTitle)" }
      else { "Finestra non trovata: ${title}" }
    `);
  },

  list_installed_apps: async () => {
    return await ps(`Get-StartApps | Sort-Object Name | ConvertTo-Json`, 10000);
  },

  // ── FILESYSTEM ────────────────────────────────────────────────────────────

  list_files: async ({ path: p = os.homedir(), recursive = false }) => {
    const flag = recursive ? '-Recurse' : '';
    return await ps(
      `Get-ChildItem -Path "${p}" ${flag} -ErrorAction SilentlyContinue |
       Select-Object Name,FullName,Length,LastWriteTime,PSIsContainer |
       ConvertTo-Json -Depth 1`,
      15000
    );
  },

  read_file: async ({ path: p }) => {
    const r = path.resolve(p);
    if (!fs.existsSync(r)) return `File non trovato: ${r}`;
    const c = fs.readFileSync(r, 'utf8');
    return c.length > 6000 ? c.slice(0, 6000) + '\n...[troncato]' : c;
  },

  write_file: async ({ path: p, content }) => {
    const r = path.resolve(p);
    fs.mkdirSync(path.dirname(r), { recursive: true });
    fs.writeFileSync(r, content, 'utf8');
    return `Scritto: ${r}`;
  },

  delete_file: async ({ path: p }) => {
    await ps(`Remove-Item -Path "${p}" -Force -Recurse -ErrorAction SilentlyContinue`);
    return `Eliminato: ${p}`;
  },

  copy_file: async ({ source, destination }) => {
    await ps(`Copy-Item -Path "${source}" -Destination "${destination}" -Recurse -Force`);
    return `Copiato: ${source} → ${destination}`;
  },

  move_file: async ({ source, destination }) => {
    await ps(`Move-Item -Path "${source}" -Destination "${destination}" -Force`);
    return `Spostato: ${source} → ${destination}`;
  },

  create_folder: async ({ path: p }) => {
    fs.mkdirSync(path.resolve(p), { recursive: true });
    return `Cartella creata: ${path.resolve(p)}`;
  },

  search_files: async ({ query, search_path = 'C:\\Users', extension = '' }) => {
    const ext = extension ? `*.${extension}` : `*${query}*`;
    return await ps(
      `Get-ChildItem -Path "${search_path}" -Recurse -ErrorAction SilentlyContinue -Filter "${ext}" |
       Select-Object -First 50 FullName | ConvertTo-Json`,
      25000
    );
  },

  get_disk_info: async () => {
    return await ps(
      `Get-PSDrive -PSProvider FileSystem |
       Select-Object Name,@{N='FreeGB';E={[math]::Round($_.Free/1GB,1)}},@{N='UsedGB';E={[math]::Round($_.Used/1GB,1)}},@{N='TotalGB';E={[math]::Round(($_.Free+$_.Used)/1GB,1)}} |
       ConvertTo-Json`
    );
  },

  empty_recycle_bin: async () => {
    await ps(`Clear-RecycleBin -Force -ErrorAction SilentlyContinue`);
    return 'Cestino svuotato.';
  },

  download_file: async ({ url, destination }) => {
    const dest = destination || path.join(os.homedir(), 'Downloads', path.basename(new URL(url).pathname) || 'download');
    await ps(`Invoke-WebRequest -Uri "${url}" -OutFile "${dest}" -UseBasicParsing`, 60000);
    return `Scaricato: ${dest}`;
  },

  // ── SISTEMA ───────────────────────────────────────────────────────────────

  get_system_info: async () => {
    const [battery, gpu, drives] = await Promise.all([
      ps(`(Get-WmiObject Win32_Battery | Select-Object -First 1 EstimatedChargeRemaining).EstimatedChargeRemaining`).catch(() => 'N/D'),
      ps(`(Get-WmiObject Win32_VideoController | Select-Object -First 1 Name).Name`).catch(() => 'N/D'),
      ps(`Get-PSDrive -PSProvider FileSystem | Select-Object Name,@{N='FreeGB';E={[math]::Round($_.Free/1GB,1)}},@{N='TotalGB';E={[math]::Round(($_.Free+$_.Used)/1GB,1)}} | ConvertTo-Json`).catch(() => '[]'),
    ]);
    return JSON.stringify({
      hostname: os.hostname(), user: os.userInfo().username,
      os: `Windows ${os.release()}`, arch: os.arch(),
      cpu: `${os.cpus().length} core — ${os.cpus()[0]?.model}`,
      ramTotal: (os.totalmem()  / 1073741824).toFixed(1) + ' GB',
      ramFree:  (os.freemem()   / 1073741824).toFixed(1) + ' GB',
      uptime:   Math.floor(os.uptime() / 3600) + 'h',
      battery: battery ? battery + '%' : 'N/D',
      gpu, drives: JSON.parse(drives || '[]'),
    }, null, 2);
  },

  get_processes: async ({ filter = '', top = 20 }) => {
    const where = filter ? `Where-Object {$_.Name -like "*${filter}*"} |` : '';
    return await ps(
      `Get-Process | ${where} Sort-Object WorkingSet -Descending | Select-Object -First ${top} Name,Id,@{N='CPU';E={[math]::Round($_.CPU,1)}},@{N='RAM_MB';E={[math]::Round($_.WorkingSet/1MB,1)}} | ConvertTo-Json`
    );
  },

  get_datetime: async () => {
    const n = new Date();
    return n.toLocaleDateString('it-IT', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) +
           `, ore ${n.toLocaleTimeString('it-IT')}`;
  },

  // ── SCHERMO / VISIONE ─────────────────────────────────────────────────────

  // Scatta uno screenshot e restituisce base64 (per GPT-4o Vision)
  get_screen: async () => {
    const tmp = path.join(os.tmpdir(), `jarvis_${Date.now()}.png`);
    await ps(`
      Add-Type -AssemblyName System.Windows.Forms,System.Drawing
      $b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
      $bmp = New-Object System.Drawing.Bitmap($b.Width, $b.Height)
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.CopyFromScreen($b.Location, [System.Drawing.Point]::Empty, $b.Size)
      $bmp.Save('${tmp.replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)
      $g.Dispose(); $bmp.Dispose()
    `, 12000);
    const base64 = fs.readFileSync(tmp).toString('base64');
    fs.unlinkSync(tmp);
    return JSON.stringify({ __type: 'screenshot', base64, mime: 'image/png' });
  },

  set_wallpaper: async ({ path: imgPath }) => {
    const abs = path.resolve(imgPath);
    await ps(`
      Add-Type @"
        using System; using System.Runtime.InteropServices;
        public class Wallpaper {
          [DllImport("user32.dll")] public static extern int SystemParametersInfo(int a,int b,string c,int d);
        }
"@
      [Wallpaper]::SystemParametersInfo(20, 0, "${abs.replace(/\\/g, '\\\\')}", 3)
    `);
    return `Sfondo impostato: ${abs}`;
  },

  // ── AUDIO ─────────────────────────────────────────────────────────────────

  set_volume: async ({ level }) => {
    const pct = Math.max(0, Math.min(100, parseInt(level)));
    await ps(`
      Add-Type -TypeDefinition @"
        using System.Runtime.InteropServices;
        [Guid("5CDF2C82-841E-4546-9722-0CF74078229A"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
        interface IAudioEndpointVolume { int r();int s();int t();int u(); int SetMasterVolumeLevelScalar(float f, System.Guid g); }
        [Guid("D666063F-1587-4E43-81F1-B948E807363F"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
        interface IMMDevice { int Activate(ref System.Guid id,int ctx,int p,out IAudioEndpointVolume v); }
        [Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"),InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
        interface IMMDeviceEnumerator { int x(); int GetDefaultAudioEndpoint(int f,int r,out IMMDevice d); }
        [ComImport,Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMEnum {}
"@
      $e = [Activator]::CreateInstance([MMEnum])
      $d = $null; ($e -as [IMMDeviceEnumerator]).GetDefaultAudioEndpoint(0,1,[ref]$d)
      $v = $null; $g = [System.Guid]"5CDF2C82-841E-4546-9722-0CF74078229A"
      $d.Activate([ref]$g,23,$null,[ref]$v); $v.SetMasterVolumeLevelScalar(${pct}/100,[System.Guid]::Empty)
    `).catch(() => {});
    return `Volume: ${pct}%`;
  },

  mute_toggle: async () => {
    await ps(`
      Add-Type -AssemblyName System.Windows.Forms
      [System.Windows.Forms.SendKeys]::SendWait([char]173)
    `);
    return 'Audio mute/unmute toggle.';
  },

  // ── NOTIFICHE ─────────────────────────────────────────────────────────────

  send_notification: async ({ title, message }) => {
    await ps(`
      Add-Type -AssemblyName System.Windows.Forms
      $n = New-Object System.Windows.Forms.NotifyIcon
      $n.Icon = [System.Drawing.SystemIcons]::Information
      $n.BalloonTipTitle = "${title}"
      $n.BalloonTipText  = "${message}"
      $n.Visible = $true
      $n.ShowBalloonTip(4000)
      Start-Sleep -Seconds 5
      $n.Dispose()
    `, 8000);
    return `Notifica inviata: ${title}`;
  },

  // ── RETE ──────────────────────────────────────────────────────────────────

  get_network_info: async () => {
    return await ps(`
      $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike '*Loopback*'} | Select-Object -First 1)
      $wifi = (netsh wlan show interfaces 2>$null) -join '\n'
      @{
        LocalIP = $ip.IPAddress
        Interface = $ip.InterfaceAlias
        PublicIP = (Invoke-RestMethod -Uri 'https://api.ipify.org' -ErrorAction SilentlyContinue)
        DNS = (Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object -First 1 ServerAddresses).ServerAddresses -join ', '
        WiFiInfo = $wifi
      } | ConvertTo-Json
    `, 15000);
  },

  ping: async ({ host }) => {
    return await ps(`Test-Connection -ComputerName "${host}" -Count 3 | ConvertTo-Json`);
  },

  // ── REGISTRY ──────────────────────────────────────────────────────────────

  read_registry: async ({ path: regPath, name }) => {
    return await ps(`Get-ItemPropertyValue -Path "${regPath}" -Name "${name}" -ErrorAction SilentlyContinue`);
  },

  write_registry: async ({ path: regPath, name, value, type = 'String' }) => {
    await ps(`Set-ItemProperty -Path "${regPath}" -Name "${name}" -Value "${value}" -Type ${type} -Force`);
    return `Registry scritto: ${regPath}\\${name} = ${value}`;
  },

  // ── SERVIZI ───────────────────────────────────────────────────────────────

  list_services: async ({ filter = '' }) => {
    const where = filter ? `| Where-Object {$_.Name -like "*${filter}*" -or $_.DisplayName -like "*${filter}*"}` : '';
    return await ps(`Get-Service ${where} | Select-Object Name,DisplayName,Status | ConvertTo-Json`);
  },

  control_service: async ({ name, action }) => {
    const actions = { start: 'Start-Service', stop: 'Stop-Service', restart: 'Restart-Service' };
    if (!actions[action]) return `Azione non valida: ${action}`;
    await ps(`${actions[action]} -Name "${name}" -ErrorAction SilentlyContinue`);
    return `Servizio ${name}: ${action}`;
  },

  // ── POWER ─────────────────────────────────────────────────────────────────

  lock_screen: async () => {
    await ps(`rundll32.exe user32.dll,LockWorkStation`);
    return 'Schermo bloccato.';
  },

  sleep_pc: async () => {
    await ps(`Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Application]::SetSuspendState('Suspend',$false,$false)`);
    return 'PC in sospensione.';
  },

  shutdown: async ({ delay_seconds = 30 }) => {
    await ps(`shutdown /s /t ${delay_seconds}`);
    return `Spegnimento tra ${delay_seconds} secondi.`;
  },

  restart: async ({ delay_seconds = 30 }) => {
    await ps(`shutdown /r /t ${delay_seconds}`);
    return `Riavvio tra ${delay_seconds} secondi.`;
  },

  abort_shutdown: async () => {
    await ps(`shutdown /a`);
    return 'Spegnimento/riavvio annullato.';
  },

  // ── CLIPBOARD ─────────────────────────────────────────────────────────────

  get_clipboard: async () => {
    return await ps(`Get-Clipboard`) || '(vuoto)';
  },

  set_clipboard: async ({ text }) => {
    await ps(`Set-Clipboard -Value @"\n${text}\n"@`);
    return 'Clipboard impostato.';
  },

  // ── TASTIERA / INPUT ──────────────────────────────────────────────────────

  type_text: async ({ text }) => {
    const escaped = text.replace(/[+^%~(){}[\]]/g, '{$&}').replace(/"/g, '"');
    await ps(`Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait("${escaped}")`);
    return `Digitato: ${text}`;
  },

  press_key: async ({ key }) => {
    await ps(`Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait("${key}")`);
    return `Tasto premuto: ${key}`;
  },

  // ── VARIABILI D'AMBIENTE ──────────────────────────────────────────────────

  get_env_vars: async () => {
    return await ps(`Get-ChildItem Env: | Select-Object Name,Value | ConvertTo-Json`);
  },

  set_env_var: async ({ name, value, scope = 'User' }) => {
    await ps(`[System.Environment]::SetEnvironmentVariable("${name}", "${value}", "${scope}")`);
    return `Variabile impostata: ${name}=${value}`;
  },

  // ── AVVIO AUTOMATICO ──────────────────────────────────────────────────────

  list_startup: async () => {
    return await ps(`
      $reg = Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -ErrorAction SilentlyContinue
      $sys = Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -ErrorAction SilentlyContinue
      @{ User = $reg; System = $sys } | ConvertTo-Json -Depth 3
    `);
  },

  // ── EVENT LOG ─────────────────────────────────────────────────────────────

  get_event_log: async ({ log = 'System', level = 'Error', count = 20 }) => {
    return await ps(
      `Get-EventLog -LogName "${log}" -EntryType ${level} -Newest ${count} |
       Select-Object TimeGenerated,Source,Message |
       ConvertTo-Json`,
      15000
    );
  },

  // ── ATTIVITÀ PIANIFICATE ──────────────────────────────────────────────────

  list_tasks: async ({ filter = '' }) => {
    const where = filter ? `| Where-Object {$_.TaskName -like "*${filter}*"}` : '';
    return await ps(`Get-ScheduledTask ${where} | Select-Object TaskName,State | ConvertTo-Json`);
  },

  create_task: async ({ name, command, trigger_time }) => {
    await ps(`
      $action  = New-ScheduledTaskAction -Execute 'powershell' -Argument '-Command "${command}"'
      $trigger = New-ScheduledTaskTrigger -Once -At "${trigger_time}"
      Register-ScheduledTask -TaskName "${name}" -Action $action -Trigger $trigger -Force
    `);
    return `Attività pianificata: ${name} alle ${trigger_time}`;
  },

  // ── SCREENSHOT VISIBILE (salva su Desktop) ────────────────────────────────
  take_screenshot: async () => {
    const dest = path.join(os.homedir(), 'Desktop', `jarvis_${Date.now()}.png`);
    await ps(`
      Add-Type -AssemblyName System.Windows.Forms,System.Drawing
      $b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
      $bmp = New-Object System.Drawing.Bitmap($b.Width,$b.Height)
      $g   = [System.Drawing.Graphics]::FromImage($bmp)
      $g.CopyFromScreen($b.Location,[System.Drawing.Point]::Empty,$b.Size)
      $bmp.Save('${dest.replace(/\\/g, '\\\\')}')
      $g.Dispose();$bmp.Dispose()
    `, 10000);
    return `Screenshot salvato: ${dest}`;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────
function normalizeAlmaMessages(messages = []) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((message) => message && ['system', 'user', 'assistant', 'tool'].includes(message.role))
    .map((message) => {
      const normalized = { role: message.role, content: String(message.content || '') };
      if (message.tool_call_id) normalized.tool_call_id = message.tool_call_id;
      if (message.tool_calls) normalized.tool_calls = message.tool_calls;
      return normalized;
    });
}

async function callOpenAI(messages, withTools = true, toolSchemas = botToolSchemas) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY mancante nel backend. Aggiungila al file .env prima di usare ALMA.');
  }

  const body = {
    model: OPENAI_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 700,
  };
  if (withTools) {
    body.tools = toolSchemas;
    body.tool_choice = 'auto';
  }

  const response = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenAI ${response.status}`);
  }
  return data.choices?.[0]?.message || { role: 'assistant', content: '' };
}

function parseToolArgs(rawArgs) {
  if (!rawArgs) return {};
  try {
    return JSON.parse(rawArgs);
  } catch {
    throw new Error('Argomenti tool non validi: JSON malformato.');
  }
}

function describePendingTool(toolName, args) {
  if (toolName === 'apriApp') return `ALMA vuole aprire l'app "${args.nomeApp}".`;
  if (toolName === 'leggiFile') return `ALMA vuole leggere il file "${args.percorso}".`;
  if (toolName === 'eseguiComandoSicuro') return `ALMA vuole eseguire l'azione sicura "${args.azione}".`;
  return `ALMA vuole eseguire "${toolName}".`;
}

async function resolveAlmaToolCalls(messages, assistantMsg, pendingMap = pendingAlmaActions, defaultScope = 'alma') {
  const toolCalls = assistantMsg.tool_calls || [];
  const toolResultMessages = [];
  const executedTools = [];

  for (const toolCall of toolCalls) {
    const toolName = toolCall.function?.name;
    const args = parseToolArgs(toolCall.function?.arguments);

    if (requiresConfirmation(toolName, args)) {
      const pendingActionId = `pending-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      pendingMap.set(pendingActionId, {
        messages,
        assistantMsg,
        toolCall,
        toolName,
        args,
        createdAt: Date.now(),
      });
      return {
        pendingAction: {
          id: pendingActionId,
          tool: toolName,
          params: args,
          message: describePendingTool(toolName, args),
        },
        executedTools,
      };
    }

    try {
      const result = isDataTool(toolName)
        ? await executeDataTool(toolName, args, defaultScope)
        : await executeAlmaTool(toolName, args);
      executedTools.push({ name: toolName, args, result });
      toolResultMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    } catch (error) {
      logAlmaToolError(toolName, args, error);
      executedTools.push({ name: toolName, args, error: error.message });
      toolResultMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify({ error: error.message }),
      });
    }
  }

  const finalMessage = await callOpenAI([...messages, assistantMsg, ...toolResultMessages], false);
  return {
    message: finalMessage,
    executedTools,
  };
}

app.post('/tool', async (req, res) => {
  const { tool, args = {} } = req.body;
  if (!LEGACY_TOOL_ALLOWLIST.has(tool)) {
    return res.status(403).json({
      error: `Tool legacy non consentito: ${tool}. Usa gli endpoint ALMA sicuri.`,
    });
  }
  const fn = tools[tool];
  if (!fn) return res.status(400).json({ error: `Tool sconosciuto: ${tool}` });
  try {
    const result = await fn(args);
    res.json({ result });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post('/alma/chat', async (req, res) => {
  try {
    const messages = normalizeAlmaMessages(req.body.messages);
    if (!messages.length) return res.status(400).json({ error: 'Nessun messaggio valido ricevuto.' });

    const assistantMsg = await callOpenAI(messages, true);
    if (!assistantMsg.tool_calls?.length) {
      return res.json({
        message: assistantMsg,
        executedTools: [],
        model: OPENAI_MODEL,
      });
    }

    const result = await resolveAlmaToolCalls(messages, assistantMsg, pendingAlmaActions, 'alma');
    res.json({ ...result, model: OPENAI_MODEL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/alma/confirm', async (req, res) => {
  const { pendingActionId, approved } = req.body;
  const pending = pendingAlmaActions.get(pendingActionId);
  if (!pending) return res.status(404).json({ error: 'Azione in attesa non trovata o scaduta.' });
  pendingAlmaActions.delete(pendingActionId);

  try {
    const result = approved
      ? isDataTool(pending.toolName)
        ? await executeDataTool(pending.toolName, pending.args, 'alma')
        : await executeAlmaTool(pending.toolName, pending.args)
      : { annullata: true, messaggio: 'Azione annullata dall utente.' };

    const finalMessage = await callOpenAI([
      ...pending.messages,
      pending.assistantMsg,
      {
        role: 'tool',
        tool_call_id: pending.toolCall.id,
        content: JSON.stringify(result),
      },
    ], false);

    res.json({
      message: finalMessage,
      executedTools: approved ? [{ name: pending.toolName, args: pending.args, result }] : [],
      model: OPENAI_MODEL,
    });
  } catch (err) {
    logAlmaToolError(pending.toolName, pending.args, err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/alma/direct-tool', async (req, res) => {
  const { tool, args = {}, confirmed = false } = req.body;
  try {
    if (!confirmed && requiresConfirmation(tool, args)) {
      return res.status(409).json({ error: 'Conferma utente richiesta prima di eseguire questa azione.' });
    }
    const result = isDataTool(tool)
      ? await executeDataTool(tool, args, args.ambito || 'alma')
      : await executeAlmaTool(tool, args);
    res.json({ result });
  } catch (err) {
    logAlmaToolError(tool, args, err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/alma/action-log', (_, res) => res.json({ log: getActionLog() }));
app.get('/alma/settings',   (_, res) => res.json({ settings: getSettings() }));

// ─────────────────────────────────────────────────────────────────────────────
// VYCTOR — endpoint dedicati (stessi tool di Alma, pending map separata)
// ─────────────────────────────────────────────────────────────────────────────

app.post('/vyctor/chat', async (req, res) => {
  try {
    const messages = normalizeAlmaMessages(req.body.messages);
    if (!messages.length) return res.status(400).json({ error: 'Nessun messaggio valido ricevuto.' });

    const assistantMsg = await callOpenAI(messages, true);
    if (!assistantMsg.tool_calls?.length) {
      return res.json({
        message: assistantMsg,
        executedTools: [],
        model: OPENAI_MODEL,
      });
    }

    const result = await resolveAlmaToolCalls(messages, assistantMsg, pendingVyctorActions, 'vyctor');
    res.json({ ...result, model: OPENAI_MODEL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/vyctor/confirm', async (req, res) => {
  const { pendingActionId, approved } = req.body;
  const pending = pendingVyctorActions.get(pendingActionId);
  if (!pending) return res.status(404).json({ error: 'Azione in attesa non trovata o scaduta.' });
  pendingVyctorActions.delete(pendingActionId);

  try {
    const result = approved
      ? isDataTool(pending.toolName)
        ? await executeDataTool(pending.toolName, pending.args, 'vyctor')
        : await executeAlmaTool(pending.toolName, pending.args)
      : { annullata: true, messaggio: 'Azione annullata dall utente.' };

    const finalMessage = await callOpenAI([
      ...pending.messages,
      pending.assistantMsg,
      {
        role: 'tool',
        tool_call_id: pending.toolCall.id,
        content: JSON.stringify(result),
      },
    ], false);

    res.json({
      message: finalMessage,
      executedTools: approved ? [{ name: pending.toolName, args: pending.args, result }] : [],
      model: OPENAI_MODEL,
    });
  } catch (err) {
    logAlmaToolError(pending.toolName, pending.args, err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/vyctor/action-log', (_, res) => res.json({ log: getActionLog() }));
app.get('/vyctor/settings',   (_, res) => res.json({ settings: getSettings() }));

// ─────────────────────────────────────────────────────────────────────────────
// ALFRED — assistente finanziario (nessun tool, solo chat)
// ─────────────────────────────────────────────────────────────────────────────

app.post('/alfred/chat', async (req, res) => {
  try {
    const messages = normalizeAlmaMessages(req.body.messages);
    if (!messages.length) return res.status(400).json({ error: 'Nessun messaggio valido.' });

    const assistantMsg = await callOpenAI(messages, true);
    if (!assistantMsg.tool_calls?.length) {
      return res.json({ message: assistantMsg, executedTools: [], model: OPENAI_MODEL });
    }

    const result = await resolveAlmaToolCalls(messages, assistantMsg, pendingAlfredActions, 'alfred');
    return res.json({ ...result, model: OPENAI_MODEL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/alfred/action-log', (_, res) => res.json({ log: [] }));

// ─────────────────────────────────────────────────────────────────────────────
// CAPITAL — assistente finanza personale (spese, risparmi, budget)
// ─────────────────────────────────────────────────────────────────────────────

app.post('/capital/chat', async (req, res) => {
  try {
    const messages = normalizeAlmaMessages(req.body.messages);
    if (!messages.length) return res.status(400).json({ error: 'Nessun messaggio valido.' });

    const assistantMsg = await callOpenAI(messages, true, capitalBotToolSchemas);
    if (!assistantMsg.tool_calls?.length) {
      return res.json({ message: assistantMsg, executedTools: [], model: OPENAI_MODEL });
    }

    const result = await resolveAlmaToolCalls(messages, assistantMsg, pendingCapitalActions, 'capital');
    return res.json({ ...result, model: OPENAI_MODEL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/capital/confirm', async (req, res) => {
  const { pendingActionId, approved } = req.body;
  const pending = pendingCapitalActions.get(pendingActionId);
  if (!pending) return res.status(404).json({ error: 'Azione in attesa non trovata o scaduta.' });
  pendingCapitalActions.delete(pendingActionId);

  try {
    const result = approved
      ? isDataTool(pending.toolName)
        ? await executeDataTool(pending.toolName, pending.args, 'capital')
        : await executeAlmaTool(pending.toolName, pending.args)
      : { annullata: true, messaggio: 'Azione annullata dall utente.' };

    const finalMessage = await callOpenAI([
      ...pending.messages,
      pending.assistantMsg,
      {
        role: 'tool',
        tool_call_id: pending.toolCall.id,
        content: JSON.stringify(result),
      },
    ], false);

    res.json({
      message: finalMessage,
      executedTools: approved ? [{ name: pending.toolName, args: pending.args, result }] : [],
      model: OPENAI_MODEL,
    });
  } catch (err) {
    logAlmaToolError(pending.toolName, pending.args, err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/data/capital/nota', (req, res) => {
  try {
    const note = addNote('capital', req.body || {}, 'ui');
    return res.json({ note, data: { capital: readScope('capital') } });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.get('/capital/bilancio', (_, res) => {
  try {
    res.json({ bilancio: getBilancio() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/capital/action-log', (_, res) => res.json({ log: [] }));

// ─────────────────────────────────────────────────────────────────────────────
// MIND — orchestratore read-only (solo leggi_dati, nessuna scrittura)
// ─────────────────────────────────────────────────────────────────────────────

app.post('/mind/chat', async (req, res) => {
  try {
    const messages = normalizeAlmaMessages(req.body.messages);
    if (!messages.length) return res.status(400).json({ error: 'Nessun messaggio valido.' });

    const assistantMsg = await callOpenAI(messages, true, mindToolSchemas);
    if (!assistantMsg.tool_calls?.length) {
      return res.json({ message: assistantMsg, executedTools: [], model: OPENAI_MODEL });
    }

    const result = await resolveAlmaToolCalls(messages, assistantMsg, pendingMindActions, null);
    return res.json({ ...result, model: OPENAI_MODEL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/mind/confirm', async (req, res) => {
  const { pendingActionId, approved } = req.body;
  const pending = pendingMindActions.get(pendingActionId);
  if (!pending) return res.status(404).json({ error: 'Azione in attesa non trovata o scaduta.' });
  pendingMindActions.delete(pendingActionId);

  try {
    const result = approved
      ? await executeDataTool(pending.toolName, pending.args, null)
      : { annullata: true, messaggio: 'Azione annullata dall utente.' };

    const finalMessage = await callOpenAI([
      ...pending.messages,
      pending.assistantMsg,
      { role: 'tool', tool_call_id: pending.toolCall.id, content: JSON.stringify(result) },
    ], false);

    res.json({
      message: finalMessage,
      executedTools: approved ? [{ name: pending.toolName, args: pending.args, result }] : [],
      model: OPENAI_MODEL,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// MIND — insight proattivo (lettura diretta, nessun tool-calling)
// ─────────────────────────────────────────────────────────────────────────────

const MIND_REPORT_SCOPES = [
  { key: 'alma', label: 'Alma' },
  { key: 'vyctor', label: 'Vyctor' },
  { key: 'alfred', label: 'Alfred' },
  { key: 'capital', label: 'Capital' },
];

function toDateOnly(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseReportDate(value, endOfDay = false) {
  const text = String(value || '').trim();
  if (!text) return null;

  const dateOnly = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    const date = new Date(
      Number(dateOnly[1]),
      Number(dateOnly[2]) - 1,
      Number(dateOnly[3]),
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 999 : 0,
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeReportRange(body = {}) {
  const today = new Date();
  const defaultTo = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  const defaultFrom = new Date(defaultTo);
  defaultFrom.setDate(defaultFrom.getDate() - 6);
  defaultFrom.setHours(0, 0, 0, 0);

  const from = body.from ? parseReportDate(body.from, false) : defaultFrom;
  const to = body.to ? parseReportDate(body.to, true) : defaultTo;

  if (!from) throw new Error('Data "from" non valida. Usa il formato YYYY-MM-DD.');
  if (!to) throw new Error('Data "to" non valida. Usa il formato YYYY-MM-DD.');
  if (from > to) throw new Error('Intervallo non valido: "from" deve essere precedente o uguale a "to".');

  return { from, to, fromLabel: toDateOnly(from), toLabel: toDateOnly(to) };
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function truncateText(value, max = 180) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

function itemDates(item, type) {
  if (type === 'task') {
    return [
      { label: 'creata', value: item.createdAt },
      { label: 'completata', value: item.completedAt },
      { label: 'scadenza', value: item.dueDate },
    ].filter(entry => entry.value);
  }

  if (type === 'event') {
    return [
      { label: 'data', value: item.date },
      { label: 'creato', value: item.createdAt },
    ].filter(entry => entry.value);
  }

  return [
    { label: 'creata', value: item.createdAt },
  ].filter(entry => entry.value);
}

function selectItemsInRange(items, type, from, to) {
  const selected = [];
  const unavailable = [];

  for (const item of asArray(items)) {
    const dates = itemDates(item, type)
      .map(entry => ({ ...entry, date: parseReportDate(entry.value, true) }))
      .filter(entry => entry.date);

    if (!dates.length) {
      unavailable.push(item);
      continue;
    }

    const matchingDates = dates.filter(entry => entry.date >= from && entry.date <= to);
    if (matchingDates.length) {
      selected.push({ ...item, _reportDates: matchingDates, _allReportDates: dates });
    }
  }

  return { selected, unavailable };
}

function dateLabel(value) {
  const date = parseReportDate(value, true);
  return date ? toDateOnly(date) : String(value || '').trim();
}

function taskLine(task) {
  const state = task.completed ? 'completata' : 'aperta';
  const parts = [`stato: ${state}`];
  if (task.category) parts.push(`categoria: ${task.category}`);
  if (task.createdAt) parts.push(`creata: ${dateLabel(task.createdAt)}`);
  if (task.completedAt) parts.push(`completata: ${dateLabel(task.completedAt)}`);
  if (task.dueDate) parts.push(`scadenza: ${dateLabel(task.dueDate)}`);
  return `- ${truncateText(task.text || task.title || '(task senza testo)')} (${parts.join('; ')})`;
}

function noteLine(note) {
  const title = note.title ? `${note.title}: ` : '';
  const parts = [];
  if (note.category) parts.push(`categoria: ${note.category}`);
  if (note.emotion) parts.push(`emozione: ${note.emotion}`);
  if (note.createdAt) parts.push(`data: ${dateLabel(note.createdAt)}`);
  return `- ${truncateText(`${title}${note.content || '(nota senza contenuto)'}`)}${parts.length ? ` (${parts.join('; ')})` : ''}`;
}

function eventLine(event) {
  const parts = [];
  if (event.date) parts.push(`data: ${dateLabel(event.date)}`);
  if (event.createdAt) parts.push(`creato: ${dateLabel(event.createdAt)}`);
  const description = event.description ? ` - ${truncateText(event.description, 120)}` : '';
  return `- ${truncateText(event.title || '(evento senza titolo)')}${description}${parts.length ? ` (${parts.join('; ')})` : ''}`;
}

function collectReportKeywords(item) {
  return String([
    item.text,
    item.title,
    item.content,
    item.description,
    item.category,
  ].filter(Boolean).join(' '))
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(token => token.length >= 5);
}

function buildCrossScopeObservations(scopeReports) {
  const byDate = new Map();
  const byKeyword = new Map();

  for (const scopeReport of scopeReports) {
    for (const entry of scopeReport.entries) {
      const day = toDateOnly(entry.date);
      if (!byDate.has(day)) byDate.set(day, new Set());
      byDate.get(day).add(scopeReport.label);

      for (const keyword of collectReportKeywords(entry.item)) {
        if (!byKeyword.has(keyword)) byKeyword.set(keyword, new Set());
        byKeyword.get(keyword).add(scopeReport.label);
      }
    }
  }

  const observations = [];
  for (const [day, scopes] of byDate.entries()) {
    if (scopes.size > 1) observations.push(`- ${day}: dati presenti in ${[...scopes].join(', ')}.`);
  }

  for (const [keyword, scopes] of byKeyword.entries()) {
    if (scopes.size > 1) observations.push(`- Termine condiviso "${keyword}" presente in ${[...scopes].join(', ')}.`);
  }

  return observations.slice(0, 8);
}

function buildMindReport(rawData, range) {
  const scopeReports = MIND_REPORT_SCOPES.map(({ key, label }) => {
    const data = rawData[key] || { tasks: [], notes: [], events: [] };
    const taskResult = selectItemsInRange(data.tasks, 'task', range.from, range.to);
    const noteResult = selectItemsInRange(data.notes, 'note', range.from, range.to);
    const eventResult = selectItemsInRange(data.events, 'event', range.from, range.to);
    const entries = [];

    for (const item of taskResult.selected) {
      for (const match of item._reportDates) entries.push({ type: 'task', date: match.date, item });
    }
    for (const item of noteResult.selected) {
      for (const match of item._reportDates) entries.push({ type: 'note', date: match.date, item });
    }
    for (const item of eventResult.selected) {
      for (const match of item._reportDates) entries.push({ type: 'event', date: match.date, item });
    }

    return {
      key,
      label,
      tasks: taskResult.selected,
      notes: noteResult.selected,
      events: eventResult.selected,
      unavailable: {
        tasks: taskResult.unavailable.length,
        notes: noteResult.unavailable.length,
        events: eventResult.unavailable.length,
      },
      entries,
    };
  });

  const totalItems = scopeReports.reduce((sum, scope) => sum + scope.tasks.length + scope.notes.length + scope.events.length, 0);
  const lines = [
    '# Report MIND',
    '',
    `Periodo: ${range.fromLabel} - ${range.toLabel}`,
    `Generato: ${new Date().toISOString()}`,
    '',
  ];

  if (!totalItems) {
    lines.push('Nessun dato datato trovato nel periodo richiesto. Il report non inventa contenuti: gli elementi senza data parsabile sono esclusi dal filtro temporale.');
    lines.push('');
  }

  for (const scope of scopeReports) {
    const openTasks = scope.tasks.filter(task => !task.completed).length;
    const completedTasks = scope.tasks.filter(task => task.completed).length;

    lines.push(`## ${scope.label}`);
    lines.push('');
    lines.push(`Task nel periodo: ${scope.tasks.length} (${completedTasks} completate, ${openTasks} aperte).`);
    lines.push(`Note nel periodo: ${scope.notes.length}.`);
    lines.push(`Eventi nel periodo: ${scope.events.length}.`);

    const unavailableTotal = scope.unavailable.tasks + scope.unavailable.notes + scope.unavailable.events;
    if (unavailableTotal) {
      lines.push(`Elementi esclusi per data non disponibile/non parsabile: ${unavailableTotal} (${scope.unavailable.tasks} task, ${scope.unavailable.notes} note, ${scope.unavailable.events} eventi).`);
    }

    if (!scope.tasks.length && !scope.notes.length && !scope.events.length) {
      lines.push('Nessun elemento datato in questo periodo.');
      lines.push('');
      continue;
    }

    if (scope.tasks.length) {
      lines.push('');
      lines.push('### Task');
      for (const task of scope.tasks) lines.push(taskLine(task));
    }

    if (scope.notes.length) {
      lines.push('');
      lines.push('### Note');
      for (const note of scope.notes) lines.push(noteLine(note));
    }

    if (scope.events.length) {
      lines.push('');
      lines.push('### Eventi');
      for (const event of scope.events) lines.push(eventLine(event));
    }

    lines.push('');
  }

  lines.push('## Osservazioni cross-ambito');
  lines.push('');
  const crossScope = buildCrossScopeObservations(scopeReports);
  if (crossScope.length) {
    lines.push(...crossScope);
  } else {
    lines.push('Nessun collegamento cross-ambito rilevabile dai dati filtrati.');
  }

  return {
    report: lines.join('\n').trim(),
    scopeReports,
    totalItems,
  };
}

app.post('/mind/report', async (req, res) => {
  try {
    const range = normalizeReportRange(req.body || {});
    const allData = await executeDataTool('leggi_dati', {}, null);
    const result = buildMindReport(allData, range);

    return res.json({
      report: result.report,
      generatedAt: new Date().toISOString(),
      from: range.fromLabel,
      to: range.toLabel,
      totalItems: result.totalItems,
      summary: result.scopeReports.map(scope => ({
        ambito: scope.key,
        tasks: scope.tasks.length,
        notes: scope.notes.length,
        events: scope.events.length,
        unavailable: scope.unavailable,
      })),
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

const MIND_INSIGHT_SYSTEM = `Sei MIND, l'osservatore trasversale dell'ecosistema JARVIS.
Hai ricevuto i dati reali di tutti i bot nella sessione attuale. Il tuo compito è generare 1-3 osservazioni concrete basate ESCLUSIVAMENTE sui dati che ti vengono passati.

REGOLE INDEROGABILI — non negoziabili:
- Non inventare dati non presenti nel JSON. Se un campo è null, assente o vuoto, non menzionarlo come se esistesse.
- Non fare supposizioni su umore, sonno, abitudini, stile di vita o qualsiasi cosa non esplicitamente registrata nei dati.
- Se trovi un collegamento reale tra ambiti diversi (es. una nota su Capital nello stesso giorno di una scadenza su Alfred), citalo con nomi, date e importi concreti tratti dai dati.
- Se un ambito ha zero task e zero note e zero eventi, dì esplicitamente che non ha dati — non fare osservazioni su quell'ambito.
- Se tutti gli ambiti hanno dati insufficienti per osservazioni utili, rispondi esattamente: "Non ho ancora abbastanza dati per fare osservazioni utili."
- Formato: testo continuo, 2-5 frasi. Nessun elenco puntato. Nessun titolo. Nessuna introduzione del tipo "Ecco le mie osservazioni:".
- Rispondi in italiano.`;

app.get('/mind/insight', async (req, res) => {
  try {
    const allData = readAllData();
    const dataContext = JSON.stringify(allData, null, 2);

    const messages = [
      { role: 'system', content: MIND_INSIGHT_SYSTEM },
      { role: 'user', content: `Dati attuali dei bot (${new Date().toLocaleDateString('it-IT')}):\n\n${dataContext}\n\nGenera le osservazioni.` },
    ];

    const assistantMsg = await callOpenAI(messages, false);

    return res.json({
      insight: assistantMsg.content?.trim() || 'Nessuna osservazione disponibile.',
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/data',(req, res) => {
  try {
    const scope = String(req.query.ambito || req.query.scope || '').trim().toLowerCase();
    if (!scope) return res.json({ data: readAllData() });
    if (!SCOPES.includes(scope)) return res.status(400).json({ error: `Ambito non valido: ${scope}` });
    return res.json({ data: { [scope]: readScope(scope) } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/data/alfred/evento', (req, res) => {
  try {
    const event = addEvent('alfred', req.body || {}, 'ui');
    return res.json({ event, data: { alfred: readScope('alfred') } });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.post('/data/alfred/nota', (req, res) => {
  try {
    const note = addNote('alfred', req.body || {}, 'ui');
    return res.json({ note, data: { alfred: readScope('alfred') } });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.post('/data/alma/nota', (req, res) => {
  try {
    const note = addNote('alma', req.body || {}, 'ui');
    return res.json({ note, data: { alma: readScope('alma') } });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.post('/api/backup', (req, res) => {
  try {
    const result = writeBackup(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
      path: BACKUP_FILE,
    });
  }
});

app.get('/api/backup', (_, res) => {
  try {
    res.json(readBackup());
  } catch (err) {
    res.status(500).json({
      exists: false,
      error: `Backup non leggibile: ${err.message}`,
      path: BACKUP_FILE,
    });
  }
});

app.get('/health', (_, res) => res.json({
  ok: true,
  tools: [...LEGACY_TOOL_ALLOWLIST],
  almaTools: botToolSchemas.map((tool) => tool.function.name),
}));

app.get('/stats', async (_, res) => {
  const ramTotal = os.totalmem();
  const ramFree  = os.freemem();
  const [battery, cpu] = await Promise.all([
    ps(`(Get-WmiObject Win32_Battery | Select-Object -First 1 EstimatedChargeRemaining).EstimatedChargeRemaining`, 4000).catch(() => null),
    ps(`(Get-WmiObject -Class Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average`, 4000).catch(() => null),
  ]);
  res.json({
    ramTotal:  (ramTotal / 1073741824).toFixed(1),
    ramUsed:   ((ramTotal - ramFree) / 1073741824).toFixed(1),
    ramPct:    Math.round((1 - ramFree / ramTotal) * 100),
    battery:   battery ? parseInt(battery.trim()) || null : null,
    cpu:       cpu     ? Math.round(parseFloat(cpu.trim()))  || null : null,
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  ◈  JARVIS OS Bridge  →  http://localhost:${PORT}`);
  console.log(`     ${Object.keys(tools).length} tool disponibili\n`);
});
