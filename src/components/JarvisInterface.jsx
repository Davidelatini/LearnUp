import { useState, useRef, useEffect, useCallback } from 'react';
import EntitySphere from './EntitySphere';
import useJarvis from '../hooks/useJarvis';
import useSystemStats from '../hooks/useSystemStats';
import { JARVIS_SYSTEM_PROMPT } from '../config/jarvis';
import { fetchBotData } from '../utils/dataApi';
import {
  createBackupPayload,
  downloadBackupFile,
  restoreBackupPayload,
} from '../utils/manualBackup';
import '../mind.css';

const SERVER = 'http://localhost:3001';
const STORAGE_KEY = 'jarvis_v2';

const INITIAL_MESSAGE = {
  id: 0,
  role: 'jarvis',
  text: 'MIND online. Ho visione su Alfred, Alma, Vyctor e Capital. Come posso assisterti?',
};

function dateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function defaultReportRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 6);
  return {
    from: dateForInput(from),
    to: dateForInput(to),
  };
}

function loadStorage() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      messages: d.messages?.length ? d.messages : [INITIAL_MESSAGE],
      history:  d.history  || [],
    };
  } catch { return { messages: [INITIAL_MESSAGE], history: [] }; }
}

function saveStorage(messages, history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      messages: messages.slice(-120),
      history:  history.slice(-120),
    }));
  } catch {}
}

const QUICK_ACTIONS = [
  { icon: '◈', label: 'Riepilogo', cmd: 'Fammi un riepilogo completo: task aperte, note recenti e obiettivi di tutti i bot.' },
  { icon: '⚡', label: 'Priorità',  cmd: 'Quali sono le mie priorità più urgenti in questo momento tra tutti i bot?' },
  { icon: '📊', label: 'Status',    cmd: 'Qual è lo stato attuale di Alfred, Alma, Vyctor e Capital?' },
  { icon: '🔗', label: 'Pattern',   cmd: 'Vedi connessioni o pattern tra le diverse aree della mia vita?' },
  { icon: '🗑', label: 'Pulisci',   cmd: null },
];

function BotStatusBlock({ label, color, data }) {
  const tasks = data?.tasks || [];
  const openTasks = tasks.filter(t => !t.completed).length;
  const notes = data?.notes?.length ?? 0;

  return (
    <div className="mind-bot-block" style={{ borderColor: `${color}1e` }}>
      <span className="mind-bot-label" style={{ color }}>{label}</span>
      <div className="mind-bot-stats">
        <div className="mind-bot-stat">
          <strong style={{ color }}>{data ? openTasks : '--'}</strong>
          <span>task</span>
        </div>
        <div className="mind-bot-stat">
          <strong style={{ color }}>{data ? notes : '--'}</strong>
          <span>note</span>
        </div>
      </div>
    </div>
  );
}

export default function JarvisInterface() {
  const stored = useRef(loadStorage());

  const [messages, setMessages]           = useState(stored.current.messages);
  const [input, setInput]                 = useState('');
  const [appState, setAppState]           = useState('idle');
  const [isListening, setIsListening]     = useState(false);
  const [serverOnline, setServerOnline]   = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [apiPanelOpen, setApiPanelOpen]   = useState(false);
  const [apiKeyDraft, setApiKeyDraft]     = useState('');
  const [apiKeyStatus, setApiKeyStatus]   = useState({ configured: false, last4: '' });
  const [apiKeyMessage, setApiKeyMessage] = useState('');
  const [apiKeySaving, setApiKeySaving]   = useState(false);
  const [backupMessage, setBackupMessage] = useState('');
  const [allBotData, setAllBotData]       = useState({ alfred: null, alma: null, vyctor: null, capital: null });
  const [insight, setInsight]             = useState(null);
  const [insightStatus, setInsightStatus] = useState('idle'); // 'idle' | 'loading' | 'error'
  const [reportRange, setReportRange]     = useState(defaultReportRange);
  const [report, setReport]               = useState(null);
  const [reportStatus, setReportStatus]   = useState('idle'); // 'idle' | 'loading' | 'error'

  const stats = useSystemStats();

  const messagesEndRef = useRef(null);
  const backupFileRef  = useRef(null);
  const recognitionRef = useRef(null);
  const historyRef     = useRef(stored.current.history);
  const msgIdRef       = useRef(Date.now());
  const abortRef       = useRef(null);

  const { sendMessage, confirmAction } = useJarvis();
  const nextId = () => ++msgIdRef.current;

  const refreshBotData = useCallback(() => {
    fetchBotData('')
      .then(data => setAllBotData({
        alfred:  data.alfred  || { tasks: [], notes: [], events: [] },
        alma:    data.alma    || { tasks: [], notes: [], events: [] },
        vyctor:  data.vyctor  || { tasks: [], notes: [], events: [] },
        capital: data.capital || { tasks: [], notes: [], events: [] },
      }))
      .catch(() => {});
  }, []);

  const fetchInsight = useCallback(async () => {
    setInsightStatus('loading');
    try {
      const response = await fetch(`${SERVER}/mind/insight`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || `Backend ${response.status}`);
      setInsight({ text: data.insight, generatedAt: data.generatedAt });
      setInsightStatus('idle');
    } catch (err) {
      setInsight({ text: err.message || 'Errore nel recupero delle osservazioni.', error: true });
      setInsightStatus('error');
    }
  }, []);

  useEffect(() => {
    fetch(`${SERVER}/health`).then(r => r.ok && setServerOnline(true)).catch(() => {});
    fetch(`${SERVER}/openai/key-status`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setApiKeyStatus(d))
      .catch(() => {});
    refreshBotData();
    fetchInsight();
  }, [refreshBotData, fetchInsight]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Core send ──────────────────────────────────────────────────────────────

  const sendToJarvis = useCallback(async (userText) => {
    if (!userText.trim() || appState === 'thinking') return;

    const userId     = nextId();
    const responseId = nextId();

    setMessages(prev => [
      ...prev,
      { id: userId,     role: 'user',   text: userText },
      { id: responseId, role: 'jarvis', text: '' },
    ]);

    historyRef.current = [...historyRef.current, { role: 'user', content: userText }];
    setAppState('thinking');

    const controller = new AbortController();
    abortRef.current = controller;
    let fullResponse = '';

    try {
      const executedTools = await sendMessage(
        historyRef.current,
        JARVIS_SYSTEM_PROMPT,
        (chunk) => {
          fullResponse += chunk;
          setMessages(prev => prev.map(m => m.id === responseId ? { ...m, text: fullResponse } : m));
        },
        controller.signal,
      );

      const requestedAction = executedTools.find(t => t.pending);
      if (requestedAction) setPendingAction(requestedAction);

      historyRef.current = [...historyRef.current, { role: 'assistant', content: fullResponse }];

      setMessages(prev => prev.map(m =>
        m.id === responseId
          ? { ...m, text: fullResponse || '(nessuna risposta)', tools: executedTools }
          : m
      ));

      setAppState('idle');
      saveStorage(
        [...messages,
          { id: userId, role: 'user', text: userText },
          { id: responseId, role: 'jarvis', text: fullResponse, tools: executedTools }],
        historyRef.current,
      );

      refreshBotData();
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === responseId ? { ...m, text: fullResponse || '(interrotto)' } : m
        ));
      } else {
        setMessages(prev => prev.map(m =>
          m.id === responseId ? { ...m, text: `Errore: ${err.message}` } : m
        ));
      }
      setAppState('idle');
    }
  }, [appState, sendMessage, messages, refreshBotData]);

  const handlePendingAction = useCallback(async (approved) => {
    if (!pendingAction || appState === 'thinking') return;

    const responseId = nextId();
    setMessages(prev => [...prev, { id: responseId, role: 'jarvis', text: '' }]);
    setAppState('thinking');

    const controller = new AbortController();
    abortRef.current = controller;
    let fullResponse = '';

    try {
      const executedTools = await confirmAction(
        pendingAction.id,
        approved,
        (chunk) => {
          fullResponse += chunk;
          setMessages(prev => prev.map(m => m.id === responseId ? { ...m, text: fullResponse } : m));
        },
        controller.signal,
      );

      historyRef.current = [...historyRef.current, { role: 'assistant', content: fullResponse }];
      setMessages(prev => prev.map(m =>
        m.id === responseId
          ? { ...m, text: fullResponse || (approved ? 'Azione completata.' : 'Azione annullata.'), tools: executedTools }
          : m
      ));
      setPendingAction(null);
      setAppState('idle');
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.id === responseId ? { ...m, text: `Errore: ${err.message}` } : m
      ));
      setAppState('idle');
    }
  }, [appState, confirmAction, pendingAction]);

  const cancelRequest = useCallback(() => {
    abortRef.current?.abort();
    setAppState('idle');
  }, []);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendToJarvis(text);
  }, [input, sendToJarvis]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  // ── Voice ──────────────────────────────────────────────────────────────────

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setAppState('idle');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Browser non supporta riconoscimento vocale.'); return; }

    const rec = new SR();
    rec.lang = 'it-IT';
    rec.interimResults = false;
    recognitionRef.current = rec;
    rec.onstart  = () => { setIsListening(true); setAppState('listening'); };
    rec.onresult = (e) => { setIsListening(false); setAppState('idle'); sendToJarvis(e.results[0][0].transcript); };
    rec.onerror  = () => { setIsListening(false); setAppState('idle'); };
    rec.onend    = () => setIsListening(false);
    rec.start();
  }, [isListening, sendToJarvis]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    historyRef.current = [];
    setMessages([INITIAL_MESSAGE]);
  }, []);

  const saveApiKey = useCallback(async (event) => {
    event.preventDefault();
    const apiKey = apiKeyDraft.trim();
    if (!apiKey) { setApiKeyMessage('Inserisci una API key.'); return; }

    setApiKeySaving(true);
    setApiKeyMessage('');
    try {
      const response = await fetch(`${SERVER}/openai/api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || `Backend ${response.status}`);
      setApiKeyStatus(data);
      setApiKeyDraft('');
      setApiKeyMessage('Chiave salvata.');
    } catch (err) {
      setApiKeyMessage(err.message || 'Errore durante il salvataggio.');
    } finally {
      setApiKeySaving(false);
    }
  }, [apiKeyDraft]);

  const exportBackup = useCallback(() => {
    try {
      downloadBackupFile(createBackupPayload());
      setBackupMessage('Backup esportato.');
      setTimeout(() => setBackupMessage(''), 3000);
    } catch (err) {
      setBackupMessage(err.message || 'Errore esportazione backup.');
    }
  }, []);

  const openBackupPicker = useCallback(() => { backupFileRef.current?.click(); }, []);

  const importBackup = useCallback(async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const confirmed = window.confirm(
      'Questo sovrascrivera tutti i dati locali attuali con quelli del backup. Continuare?',
    );
    if (!confirmed) { setBackupMessage('Import annullato.'); return; }

    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const restoredKeys = restoreBackupPayload(payload);
      setBackupMessage(`Backup importato: ${restoredKeys.length} chiavi ripristinate.`);
      window.setTimeout(() => window.location.reload(), 350);
    } catch (err) {
      setBackupMessage(err.message || 'Errore durante import backup.');
    }
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────

  const generateReport = useCallback(async () => {
    setReportStatus('loading');
    try {
      const response = await fetch(`${SERVER}/mind/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportRange),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || `Backend ${response.status}`);
      setReport(data);
      setReportStatus('idle');
    } catch (err) {
      setReport({
        report: err.message || 'Errore durante la generazione del report.',
        error: true,
      });
      setReportStatus('error');
    }
  }, [reportRange]);

  const downloadReport = useCallback(() => {
    if (!report?.report || report.error) return;

    const blob = new Blob([report.report], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const from = report.from || reportRange.from || 'inizio';
    const to = report.to || reportRange.to || 'fine';

    link.href = url;
    link.download = `jarvis-report-${from}_${to}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [report, reportRange]);

  const stateLabel      = { idle: 'In attesa', thinking: 'Elaborazione', listening: 'Ascolto' }[appState] || 'Idle';
  const backgroundState = appState === 'thinking' ? 'speaking' : 'idle';

  return (
    <div className="mind-shell">

      {/* ── Entity — background assoluto ──────────────────── */}
      <div className={`mind-entity-bg${appState === 'thinking' ? ' is-thinking' : ''}`} aria-hidden="true">
        <EntitySphere label="MIND" accent="#c8deff" state={backgroundState} tempo="soft" />
      </div>

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className="mind-sidebar">

        <div className="mind-panel-header">
          <div>
            <div className="eyebrow">Orchestratore</div>
            <h1>MIND</h1>
          </div>
          <button
            className="mind-ctrl-btn"
            onClick={clearHistory}
            title="Cancella chat"
            style={{ width: 'auto', padding: '5px 9px', marginTop: '3px' }}
          >
            ✕
          </button>
        </div>

        {/* Bot status */}
        <div className="mind-section-label">Bot status</div>
        <BotStatusBlock label="ALFRED"  color="#5fb7ff" data={allBotData.alfred} />
        <BotStatusBlock label="ALMA"    color="#39ff14" data={allBotData.alma} />
        <BotStatusBlock label="VYCTOR"  color="#ff5c69" data={allBotData.vyctor} />
        <BotStatusBlock label="CAPITAL" color="#f0b429" data={allBotData.capital} />

        {/* System metrics */}
        <div className="mind-section-label">Sistema</div>
        <div className="mind-sys-block">
          {stats ? (
            <>
              {stats.cpu != null && (
                <div className="mind-sys-row"><span>CPU</span><strong>{stats.cpu}%</strong></div>
              )}
              <div className="mind-sys-row">
                <span>RAM</span>
                <strong>{stats.ramUsed}/{stats.ramTotal} GB</strong>
              </div>
              {stats.battery != null && (
                <div className="mind-sys-row">
                  <span>Batteria</span>
                  <strong>{stats.battery}%</strong>
                </div>
              )}
            </>
          ) : (
            <div className="mind-sys-row"><span>Caricamento...</span></div>
          )}
          <div className="mind-sys-row">
            <span>Server</span>
            <strong style={{ color: serverOnline ? '#39ff14' : '#ff5c69' }}>
              {serverOnline ? 'online' : 'offline'}
            </strong>
          </div>
        </div>

        {/* Controls */}
        <div className="mind-ctrl-row">
          <button className="mind-ctrl-btn" onClick={() => setApiPanelOpen(p => !p)}>
            API {apiKeyStatus.configured ? `...${apiKeyStatus.last4}` : '— non configurata'}
          </button>
          {apiPanelOpen && (
            <form onSubmit={saveApiKey}>
              <div className="mind-api-status">
                {apiKeyStatus.configured
                  ? `Configurata, termina con ${apiKeyStatus.last4}`
                  : 'Non configurata'}
              </div>
              <div className="mind-api-form">
                <input
                  className="mind-api-input"
                  type="password"
                  value={apiKeyDraft}
                  onChange={e => setApiKeyDraft(e.target.value)}
                  placeholder="sk-..."
                  autoComplete="off"
                />
                <button
                  className="mind-ctrl-btn"
                  type="submit"
                  disabled={apiKeySaving || !apiKeyDraft.trim()}
                  style={{ width: 'auto', padding: '5px 10px', whiteSpace: 'nowrap' }}
                >
                  {apiKeySaving ? '...' : 'Salva'}
                </button>
              </div>
              {apiKeyMessage && <div className="mind-api-msg">{apiKeyMessage}</div>}
            </form>
          )}
          <button className="mind-ctrl-btn" onClick={exportBackup}>Esporta backup</button>
          <button className="mind-ctrl-btn" onClick={openBackupPicker}>Importa backup</button>
          <input
            ref={backupFileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={importBackup}
          />
        </div>

      </aside>

      {/* ── Chat — minimale, trasparente ──────────────────── */}
      <main className="mind-chat-panel">

        <div className="mind-chat-status">
          <span className={`mind-status-dot${appState === 'thinking' ? ' is-busy' : ''}`} />
          <div>
            <div className="mind-status-label">{stateLabel}</div>
            <div className="mind-status-sub">Sola lettura · leggi_dati</div>
          </div>
        </div>

        {backupMessage && <div className="mind-notify-bar">{backupMessage}</div>}

        {/* ── Insight proattivo ──────────────────────────────── */}
        <div className="mind-insight-card">
          <div className="mind-insight-header">
            <span className="mind-insight-label">◈ Osservazioni</span>
            {insight?.generatedAt && !insight?.error && (
              <span className="mind-insight-ts">
                {new Date(insight.generatedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              className="mind-insight-refresh"
              onClick={fetchInsight}
              disabled={insightStatus === 'loading'}
              title="Rigenera osservazioni"
            >
              {insightStatus === 'loading' ? '...' : 'Aggiorna'}
            </button>
          </div>
          {insightStatus === 'loading' && !insight && (
            <div className="mind-insight-loading">
              <span className="mind-typing"><span /><span /><span /></span>
              Analisi in corso
            </div>
          )}
          {insight && (
            <div className={insight.error ? 'mind-insight-error' : 'mind-insight-text'}>
              {insight.text}
            </div>
          )}
        </div>

        <div className="mind-report-card">
          <div className="mind-insight-header">
            <span className="mind-insight-label">Report periodo</span>
            {report?.generatedAt && !report?.error && (
              <span className="mind-insight-ts">
                {new Date(report.generatedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <div className="mind-report-controls">
            <label className="mind-report-field">
              <span>Da</span>
              <input
                type="date"
                value={reportRange.from}
                onChange={e => setReportRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </label>
            <label className="mind-report-field">
              <span>A</span>
              <input
                type="date"
                value={reportRange.to}
                onChange={e => setReportRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </label>
            <button
              className="mind-insight-refresh"
              type="button"
              onClick={generateReport}
              disabled={reportStatus === 'loading'}
            >
              {reportStatus === 'loading' ? '...' : 'Genera report'}
            </button>
            <button
              className="mind-insight-refresh"
              type="button"
              onClick={downloadReport}
              disabled={!report?.report || report.error || reportStatus === 'loading'}
            >
              Scarica report
            </button>
          </div>
          {reportStatus === 'loading' && !report && (
            <div className="mind-insight-loading">
              <span className="mind-typing"><span /><span /><span /></span>
              Generazione report
            </div>
          )}
          {report?.report && (
            <pre className={report.error ? 'mind-report-error' : 'mind-report-output'}>
              {report.report}
            </pre>
          )}
        </div>

        <div className="mind-thread">
          {messages.map(msg => (
            <div key={msg.id} className={`mind-msg-row ${msg.role === 'jarvis' ? 'is-mind' : 'is-user'}`}>
              <div className="mind-msg-role">
                {msg.role === 'jarvis' ? '◈ MIND' : '● DAVID'}
              </div>
              <div className="mind-bubble">
                {msg.text
                  ? msg.text
                  : <span className="mind-typing"><span /><span /><span /></span>
                }
              </div>
              {msg.tools?.length > 0 && (
                <div className="mind-tool-row">
                  {msg.tools.map((t, i) => (
                    <span key={i} className="mind-tool-chip">{t.name}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {pendingAction && (
          <div className="mind-pending-row">
            <span>{pendingAction.name?.replace(/_/g, ' ')}</span>
            <button className="mind-quick-btn" disabled={appState === 'thinking'}
              onClick={() => handlePendingAction(false)}>Annulla</button>
            <button className="mind-quick-btn" disabled={appState === 'thinking'}
              onClick={() => handlePendingAction(true)}>Esegui</button>
          </div>
        )}

        <div className="mind-quick-row">
          {QUICK_ACTIONS.map(qa => (
            <button
              key={qa.label}
              className="mind-quick-btn"
              disabled={appState === 'thinking'}
              onClick={() => qa.cmd ? sendToJarvis(qa.cmd) : clearHistory()}
            >
              {qa.icon} {qa.label}
            </button>
          ))}
        </div>

        <form className="mind-composer" onSubmit={handleSubmit}>
          <input
            className="mind-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chiedi a MIND..."
            disabled={appState === 'thinking'}
            autoFocus
            autoComplete="off"
          />
          <button
            type="button"
            className={`mind-btn${isListening ? ' is-listening' : ''}`}
            onClick={toggleListening}
            disabled={appState === 'thinking'}
            title={isListening ? 'Stop ascolto' : 'Comando vocale'}
          >
            {isListening ? '■' : '🎙'}
          </button>
          {appState === 'thinking' ? (
            <button type="button" className="mind-btn is-stop" onClick={cancelRequest} title="Interrompi">■</button>
          ) : (
            <button type="submit" className="mind-btn" disabled={!input.trim()} title="Invia">▶</button>
          )}
        </form>

      </main>

    </div>
  );
}
