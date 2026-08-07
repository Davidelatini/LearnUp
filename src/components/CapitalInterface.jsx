import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../capital.css';
import useCapital from '../hooks/useCapital';
import CapitalEntity from './CapitalEntity';
import CapitalPanel from './CapitalPanel';
import { fetchBotData, fetchCapitalBilancio } from '../utils/dataApi';

const STORAGE_KEY = 'capital_chat_sessions_v1';

const WELCOME_MESSAGE = {
  id: 'welcome-assistant',
  role: 'assistant',
  content: 'Ciao! Sono CAPITAL. Posso aiutarti a ragionare in modo generale su soldi, decisioni e obiettivi finanziari. Nella sezione Risparmi puoi vedere quanto metti da parte partendo da stipendio e uscite mensili.',
  timestamp: Date.now(),
};

const CAPITAL_TOOL_NAMES = new Set([
  'aggiungi_task', 'completa_task', 'salva_nota',
  'imposta_stipendio', 'imposta_uscite', 'aggiungi_spesa_fissa', 'rimuovi_spesa_fissa',
  'aggiungi_spesa_variabile', 'segna_pagata', 'get_bilancio',
]);

function createSession() {
  const now = Date.now();
  return {
    id: `session-${now}`,
    title: 'Nuova conversazione',
    createdAt: now,
    updatedAt: now,
    messages: [WELCOME_MESSAGE],
  };
}

function loadSessions() {
  if (typeof window === 'undefined') return [createSession()];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createSession()];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [createSession()];
    return parsed;
  } catch {
    return [createSession()];
  }
}

function persistSessions(sessions) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch { /* ignore */ }
}

function formatTimestamp(value) {
  return new Date(value).toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

function buildTitle(messages) {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'Nuova conversazione';
  return first.content.length > 42
    ? `${first.content.slice(0, 42)}...`
    : first.content;
}

function CapitalMessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`capital-msg-row ${isUser ? 'is-user' : 'is-assistant'}`}>
      <div className={`capital-bubble ${isUser ? 'is-user' : 'is-assistant'}`}>
        <div className="capital-msg-role">{isUser ? 'Tu' : 'CAPITAL'}</div>
        <p>{message.content}</p>
        <div className="capital-msg-time">{formatTimestamp(message.timestamp)}</div>
      </div>
    </div>
  );
}

function SidebarPanoramica({ data, onOpenPanel }) {
  const config = data?.config || { stipendio: null, uscite: null };
  const stipendio = config.stipendio || 0;
  const uscite = config.uscite || 0;
  const hasData = config.stipendio != null && config.uscite != null;
  const risparmio = hasData ? stipendio - uscite : null;
  const isNeg = risparmio != null && risparmio < 0;

  const risparmioDisplay = hasData
    ? (isNeg ? '−' : '+') + '€' + Math.abs(risparmio).toFixed(0)
    : '—';

  return (
    <button className="capital-panoramica" onClick={onOpenPanel} title="Apri pannello Capital">
      <div className="capital-pan-stat">
        <span
          className="capital-pan-num"
          style={{ color: isNeg ? '#ff6070' : undefined, fontSize: Math.abs(risparmio || 0) >= 1000 ? '1.15rem' : undefined }}
        >
          {risparmioDisplay}
        </span>
        <span className="capital-pan-lbl">Risparmio</span>
      </div>
      <div className="capital-pan-divider" />
      <div className="capital-pan-stat">
        <span className="capital-pan-num" style={{ fontSize: '1.05rem', color: '#ff9944' }}>
          {config.uscite != null ? `€${uscite}` : '—'}
        </span>
        <span className="capital-pan-lbl">Uscite</span>
      </div>
      <div className="capital-pan-divider" />
      <div className="capital-pan-stat">
        <span className="capital-pan-num" style={{ fontSize: '1.05rem' }}>
          {stipendio > 0 ? `€${stipendio}` : '—'}
        </span>
        <span className="capital-pan-lbl">Stipendio</span>
      </div>
    </button>
  );
}

export default function CapitalInterface() {
  const { chat, modelName } = useCapital();
  const [sessions, setSessions] = useState(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => loadSessions()[0]?.id ?? null);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [lastMeta, setLastMeta] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [capitalData, setCapitalData] = useState({
    tasks: [], notes: [], events: [],
    config: { stipendio: null, uscite: null, spese_fisse: [] },
    spese_variabili: [],
  });
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    persistSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, status]);

  const refreshCapitalData = useCallback(async () => {
    try {
      const data = await fetchBotData('capital');
      setCapitalData({
        tasks: [],
        notes: [],
        events: [],
        config: { stipendio: null, uscite: null, spese_fisse: [] },
        spese_variabili: [],
        ...(data.capital || {}),
      });
      setDataRefreshKey((v) => v + 1);
    } catch {
      /* ignore — server might be down */
    }
  }, []);

  useEffect(() => {
    refreshCapitalData();
  }, [refreshCapitalData]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? sessions[0] ?? null,
    [sessions, activeSessionId]
  );

  const conversationMessages = activeSession?.messages ?? [];

  const createNewChat = () => {
    const next = createSession();
    setSessions((prev) => [next, ...prev]);
    setActiveSessionId(next.id);
    setDraft('');
    setError('');
    setLastMeta(null);
  };

  const updateActiveSession = (updater) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? updater(s) : s))
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !activeSession) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    const updatedMessages = [...conversationMessages, userMessage];
    updateActiveSession((s) => ({
      ...s,
      title: buildTitle(updatedMessages),
      updatedAt: Date.now(),
      messages: updatedMessages,
    }));

    setDraft('');
    setError('');
    setStatus('thinking');

    const historyForModel = conversationMessages.map(({ role, content }) => ({ role, content }));
    const isFirstMessage = historyForModel.length <= 1;

    let bilancioContext = null;
    if (isFirstMessage) {
      try {
        bilancioContext = await fetchCapitalBilancio();
      } catch { /* ignore if server down */ }
    }

    try {
      const { text, meta, executedTools = [] } = await chat(trimmed, historyForModel, bilancioContext);

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: text,
        timestamp: Date.now(),
      };

      updateActiveSession((s) => {
        const next = [...s.messages, assistantMessage];
        return { ...s, title: buildTitle(next), updatedAt: Date.now(), messages: next };
      });

      setLastMeta(meta);

      if (executedTools.some((t) => CAPITAL_TOOL_NAMES.has(t.name))) {
        await refreshCapitalData();
      }
      setStatus('idle');
    } catch (err) {
      setError(err.message || 'Errore durante la risposta.');
      setStatus('idle');
    }
  };

  const statusLabel = status === 'thinking' ? 'Elaborazione...' : 'Online';
  const backgroundState = status === 'thinking' ? 'speaking' : 'idle';

  return (
    <div className="capital-shell">

      {/* ── Entity — background assoluto ────────────────────── */}
      <div className="capital-entity-bg" aria-hidden="true">
        <CapitalEntity state={backgroundState} />
      </div>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="capital-history-panel">

        <div className="capital-panel-header">
          <div>
            <div className="eyebrow">Finanze e decisioni</div>
            <h1>CAPITAL</h1>
          </div>
          <div className="capital-header-actions">
            <button
              type="button"
              className="ghost-button capital-panel-btn"
              onClick={() => setShowPanel(true)}
            >
              RISPARMI
            </button>
            <button type="button" className="ghost-button" onClick={createNewChat}>
              + Nuova
            </button>
          </div>
        </div>

        <div className="capital-history-section">
          <div className="capital-section-label">Cronologia</div>
          <div className="capital-history-list" role="list">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                className={`capital-history-item ${session.id === activeSession?.id ? 'is-active' : ''}`}
                onClick={() => { setActiveSessionId(session.id); setError(''); }}
              >
                <span className="capital-history-title">{session.title}</span>
                <span className="capital-history-date">{formatTimestamp(session.updatedAt)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="capital-sidebar-bottom">
          <div className="capital-context-panel">
            <div className="capital-context-title">Panoramica</div>
            <SidebarPanoramica data={capitalData} onOpenPanel={() => setShowPanel(true)} />
          </div>
        </div>

      </aside>

      {/* ── Chat ────────────────────────────────────────────── */}
      <main className="capital-chat-panel">

        <div className="capital-chat-status">
          <span className={`status-dot ${status === 'thinking' ? 'is-busy' : 'online'}`} />
          <div>
            <div className="status-label">{statusLabel}</div>
            <div className="status-subtitle">OpenAI · {modelName}</div>
          </div>
        </div>

        <div className="capital-thread">
          {conversationMessages.map((message) => (
            <CapitalMessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {lastMeta?.themes?.length > 0 && (
          <div className="capital-meta-row">
            {lastMeta.themes.slice(0, 4).map((theme) => (
              <span key={theme} className="capital-meta-chip">{theme}</span>
            ))}
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        <form className="capital-composer" onSubmit={handleSubmit}>
          <label className="capital-composer-field">
            <span className="visually-hidden">Messaggio</span>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Parla con CAPITAL..."
              rows={1}
              disabled={status === 'thinking'}
            />
          </label>
          <button
            type="submit"
            className="primary-button"
            disabled={status === 'thinking' || !draft.trim()}
          >
            Invia
          </button>
        </form>

      </main>

      {showPanel && (
        <CapitalPanel
          data={capitalData}
          refreshKey={dataRefreshKey}
          onDataChange={refreshCapitalData}
          onClose={() => setShowPanel(false)}
        />
      )}
    </div>
  );
}
