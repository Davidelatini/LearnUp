const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

const DATA_DIR = path.join(os.homedir(), '.alma');
const PROJECT_DATA_DIR = path.join(__dirname, 'data');
const VYCTOR_WORK_PROFILE_PATH = path.join(PROJECT_DATA_DIR, 'vyctor-work-profile.json');
const SETTINGS_PATH = path.join(DATA_DIR, 'settings.json');
const LOG_PATH = path.join(DATA_DIR, 'action-log.json');
const MAX_LOG_ENTRIES = 200;
const MAX_FILE_CHARS = 12000;

const DEFAULT_SETTINGS = {
  allowedFolders: [
    path.join(os.homedir(), 'Desktop'),
    path.join(os.homedir(), 'Documents'),
    DATA_DIR,
  ],
  confirmations: {
    apriApp: true,
    leggiFile: true,
    eseguiComandoSicuro: false,
  },
  commonApps: ['calculator', 'calc', 'notepad', 'spotify', 'code', 'vscode'],
};

const APP_ALIASES = {
  calculator: 'calc',
  calcolatrice: 'calc',
  vscode: 'code',
  'vs code': 'code',
  'visual studio code': 'code',
};

const DEFAULT_WORK_PROFILE = {
  apps: ['code'],
  urls: [],
};

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

function readProjectJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeProjectJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

function normalizeSettings(value = {}) {
  return {
    allowedFolders: Array.isArray(value.allowedFolders) && value.allowedFolders.length
      ? value.allowedFolders
      : DEFAULT_SETTINGS.allowedFolders,
    confirmations: {
      ...DEFAULT_SETTINGS.confirmations,
      ...(value.confirmations || {}),
    },
    commonApps: Array.isArray(value.commonApps) && value.commonApps.length
      ? value.commonApps
      : DEFAULT_SETTINGS.commonApps,
  };
}

function getSettings() {
  const settings = normalizeSettings(readJson(SETTINGS_PATH, DEFAULT_SETTINGS));
  if (!fs.existsSync(SETTINGS_PATH)) writeJson(SETTINGS_PATH, settings);
  return settings;
}

function appendActionLog(entry) {
  const previous = readJson(LOG_PATH, []);
  const next = [
    {
      id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    },
    ...(Array.isArray(previous) ? previous : []),
  ].slice(0, MAX_LOG_ENTRIES);
  writeJson(LOG_PATH, next);
  return next[0];
}

function getActionLog() {
  return readJson(LOG_PATH, []);
}

function runDetached(command, args) {
  return new Promise((resolve, reject) => {
    const child = execFile(command, args, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error((stderr || error.message || '').trim()));
        return;
      }
      resolve((stdout || '').trim());
    });
    child.unref?.();
  });
}

function validateNonEmptyString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} deve essere una stringa non vuota.`);
  }
  return value.trim();
}

function validateUrl(value) {
  const url = validateNonEmptyString(value, 'url');
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('URL non valido o mal formato.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Sono consentiti solo URL http o https.');
  }
  return parsed.toString();
}

function normalizeAppName(value) {
  const appName = validateNonEmptyString(value, 'nomeApp');
  return APP_ALIASES[appName.toLowerCase()] || appName;
}

function validateAllowedApp(value) {
  const appName = normalizeAppName(value);
  const settings = getSettings();
  const allowed = settings.commonApps.map((item) => normalizeAppName(item).toLowerCase());
  if (!allowed.includes(appName.toLowerCase())) {
    throw new Error(`App non consentita: ${appName}. Aggiungila alla whitelist commonApps in ${SETTINGS_PATH} prima di usarla.`);
  }
  return appName;
}

function getVyctorWorkProfile() {
  const profile = readProjectJson(VYCTOR_WORK_PROFILE_PATH, DEFAULT_WORK_PROFILE);
  const normalized = {
    apps: Array.isArray(profile.apps) ? profile.apps : [],
    urls: Array.isArray(profile.urls) ? profile.urls : [],
  };
  if (!fs.existsSync(VYCTOR_WORK_PROFILE_PATH)) writeProjectJson(VYCTOR_WORK_PROFILE_PATH, normalized);
  return normalized;
}

function resolveAllowedFile(filePath) {
  const requested = path.resolve(validateNonEmptyString(filePath, 'percorso'));
  const settings = getSettings();
  const allowed = settings.allowedFolders.map((folder) => path.resolve(folder));
  const isAllowed = allowed.some((folder) => {
    const relative = path.relative(folder, requested);
    return relative === '' || (!!relative && !relative.startsWith('..') && !path.isAbsolute(relative));
  });

  if (!isAllowed) {
    throw new Error(`Accesso negato. Il file deve trovarsi in una cartella consentita: ${allowed.join(', ')}`);
  }
  return requested;
}

async function openByPlatform(target, mode = 'url') {
  const platform = process.platform;
  if (platform === 'win32') {
    const args = mode === 'app'
      ? ['/c', 'start', '', target]
      : ['/c', 'start', '', target];
    await runDetached('cmd.exe', args);
    return;
  }
  if (platform === 'darwin') {
    await runDetached('open', mode === 'app' ? ['-a', target] : [target]);
    return;
  }
  await runDetached(mode === 'app' ? target : 'xdg-open', mode === 'app' ? [] : [target]);
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${response.status}`);
  }
  return data;
}

async function fetchNews(query) {
  const q = validateNonEmptyString(query, 'query');
  const newsApiKey = process.env.NEWSAPI_KEY;
  const gnewsKey = process.env.GNEWS_API_KEY;

  if (newsApiKey) {
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('q', q);
    url.searchParams.set('language', 'it');
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', '5');
    url.searchParams.set('apiKey', newsApiKey);
    const data = await fetchJson(url);
    return (data.articles || []).slice(0, 5).map((article) => ({
      titolo: article.title,
      fonte: article.source?.name || 'NewsAPI',
      data: article.publishedAt,
      link: article.url,
      estratto: article.description || article.content || '',
    }));
  }

  if (gnewsKey) {
    const url = new URL('https://gnews.io/api/v4/search');
    url.searchParams.set('q', q);
    url.searchParams.set('lang', 'it');
    url.searchParams.set('max', '5');
    url.searchParams.set('apikey', gnewsKey);
    const data = await fetchJson(url);
    return (data.articles || []).slice(0, 5).map((article) => ({
      titolo: article.title,
      fonte: article.source?.name || 'GNews',
      data: article.publishedAt,
      link: article.url,
      estratto: article.description || '',
    }));
  }

  throw new Error('Nessuna API notizie configurata. Imposta NEWSAPI_KEY o GNEWS_API_KEY nel file .env.');
}

const SAFE_ACTIONS = {
  mostra_data: {
    description: 'Mostra data e ora correnti.',
    run: async () => ({
      messaggio: new Date().toLocaleString('it-IT', {
        dateStyle: 'full',
        timeStyle: 'medium',
      }),
    }),
  },
  apri_calcolatrice: {
    description: 'Apre la calcolatrice.',
    run: async () => {
      await openByPlatform(process.platform === 'darwin' ? 'Calculator' : process.platform === 'win32' ? 'calc' : 'gnome-calculator', 'app');
      return { messaggio: 'Calcolatrice aperta.' };
    },
  },
  apri_terminale: {
    description: 'Apre il terminale predefinito del sistema.',
    run: async () => {
      const target = process.platform === 'darwin' ? 'Terminal' : process.platform === 'win32' ? 'wt' : 'x-terminal-emulator';
      await openByPlatform(target, 'app');
      return { messaggio: 'Terminale aperto.' };
    },
  },
};

const almaToolSchemas = [
  {
    type: 'function',
    function: {
      name: 'apriApp',
      description: 'Apre una applicazione installata sul sistema locale dell utente.',
      parameters: {
        type: 'object',
        properties: {
          nomeApp: { type: 'string', description: 'Nome dell applicazione, per esempio Spotify, Calculator, VSCode.' },
        },
        required: ['nomeApp'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'apriUrl',
      description: 'Apre un URL http o https nel browser predefinito dell utente dopo validazione.',
      parameters: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'URL completo da aprire.' },
        },
        required: ['url'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'leggiFile',
      description: 'Legge un file testuale locale solo se si trova in una cartella consentita dalle impostazioni ALMA.',
      parameters: {
        type: 'object',
        properties: {
          percorso: { type: 'string', description: 'Percorso completo del file da leggere.' },
        },
        required: ['percorso'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'cercaNotizie',
      description: 'Cerca notizie reali e aggiornate tramite NewsAPI o GNews configurati con variabili ambiente.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Argomento o parole chiave da cercare.' },
        },
        required: ['query'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'eseguiComandoSicuro',
      description: 'Esegue solo azioni locali predefinite e sicure da whitelist. Non accetta comandi shell liberi.',
      parameters: {
        type: 'object',
        properties: {
          azione: { type: 'string', enum: Object.keys(SAFE_ACTIONS), description: 'Azione consentita.' },
          parametri: { type: 'object', description: 'Parametri opzionali dell azione whitelistata.' },
        },
        required: ['azione'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'avvia_sessione_lavoro',
      description: 'Avvia il profilo di lavoro di VYCTOR aprendo in sequenza app whitelistate e URL validi configurati in server/data/vyctor-work-profile.json.',
      parameters: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
    },
  },
];

const almaToolHandlers = {
  apriApp: async ({ nomeApp }) => {
    const appName = validateAllowedApp(nomeApp);
    try {
      await openByPlatform(appName, 'app');
    } catch (error) {
      throw new Error(`App non trovata o non avviabile: ${appName}. Dettaglio: ${error.message}`);
    }
    return { messaggio: `Ho aperto ${appName}.` };
  },
  apriUrl: async ({ url }) => {
    const validUrl = validateUrl(url);
    await openByPlatform(validUrl, 'url');
    return { messaggio: `Ho aperto ${validUrl}.` };
  },
  leggiFile: async ({ percorso }) => {
    const filePath = resolveAllowedFile(percorso);
    if (!fs.existsSync(filePath)) throw new Error(`File non trovato: ${filePath}`);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) throw new Error(`Il percorso non e un file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    return {
      percorso: filePath,
      contenuto: content.length > MAX_FILE_CHARS ? `${content.slice(0, MAX_FILE_CHARS)}\n...[troncato]` : content,
      troncato: content.length > MAX_FILE_CHARS,
    };
  },
  cercaNotizie: async ({ query }) => {
    const articoli = await fetchNews(query);
    return { articoli };
  },
  eseguiComandoSicuro: async ({ azione, parametri = {} }) => {
    const name = validateNonEmptyString(azione, 'azione');
    const action = SAFE_ACTIONS[name];
    if (!action) throw new Error(`Azione non consentita: ${name}`);
    return action.run(parametri || {});
  },
  avvia_sessione_lavoro: async () => {
    const profile = getVyctorWorkProfile();
    const openedApps = [];
    const openedUrls = [];
    const errors = [];

    for (const appName of profile.apps) {
      try {
        const result = await almaToolHandlers.apriApp({ nomeApp: appName });
        openedApps.push({ nomeApp: normalizeAppName(appName), result });
      } catch (error) {
        errors.push({ tipo: 'app', valore: appName, errore: error.message });
      }
    }

    for (const url of profile.urls) {
      try {
        const result = await almaToolHandlers.apriUrl({ url });
        openedUrls.push({ url: validateUrl(url), result });
      } catch (error) {
        errors.push({ tipo: 'url', valore: url, errore: error.message });
      }
    }

    return {
      profilo: VYCTOR_WORK_PROFILE_PATH,
      appAperte: openedApps,
      urlAperti: openedUrls,
      errori: errors,
      messaggio: `Sessione di lavoro avviata: ${openedApps.length} app, ${openedUrls.length} URL.`,
    };
  },
};

function requiresConfirmation(toolName, args) {
  const settings = getSettings();
  if (toolName === 'apriApp') {
    const appName = String(args?.nomeApp || '').toLowerCase();
    const isCommon = settings.commonApps.some((item) => item.toLowerCase() === appName);
    return settings.confirmations.apriApp && !isCommon;
  }
  if (toolName === 'leggiFile') return settings.confirmations.leggiFile;
  if (toolName === 'eseguiComandoSicuro') return settings.confirmations.eseguiComandoSicuro;
  return false;
}

async function executeAlmaTool(toolName, args) {
  const fn = almaToolHandlers[toolName];
  if (!fn) throw new Error(`Tool ALMA sconosciuto: ${toolName}`);
  const result = await fn(args || {});
  appendActionLog({ tool: toolName, params: args || {}, result, ok: true });
  return result;
}

function logAlmaToolError(toolName, args, error) {
  appendActionLog({ tool: toolName, params: args || {}, result: { error: error.message }, ok: false });
}

module.exports = {
  almaToolSchemas,
  executeAlmaTool,
  getActionLog,
  getSettings,
  getVyctorWorkProfile,
  logAlmaToolError,
  requiresConfirmation,
  VYCTOR_WORK_PROFILE_PATH,
};
