import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../alfred.css';
import '../vyctor.css';
import VyctorEntity from './VyctorEntity';
import VyctorMissionsPanel from './VyctorMissionsPanel';
import useVyctor from '../hooks/useVyctor';
import useSystemStats from '../hooks/useSystemStats';
import { fetchBotData } from '../utils/dataApi';

const STORAGE_KEY = 'vyctor_chat_sessions_v2';

const WELCOME_MESSAGE = {
  id: 'welcome-assistant',
  role: 'assistant',
  content: 'VYCTOR in linea. Come posso assisterti?',
  timestamp: Date.now(),
};

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
  } catch {
    // Ignore storage errors.
  }
}

function formatTimestamp(value) {
  return new Date(value).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildTitle(messages) {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'Nuova conversazione';
  return first.content.length > 42
    ? `${first.content.slice(0, 42)}...`
    : first.content;
}

function SystemMetrics({ stats }) {
  return (
    <div className="vyctor-system-metrics" aria-label="Metriche sistema">
      <div className="vyctor-metric">
        <span>CPU</span>
        <strong>{stats?.cpu ?? '--'}%</strong>
      </div>
      <div className="vyctor-metric">
        <span>RAM</span>
        <strong>{stats ? `${stats.ramUsed}/${stats.ramTotal} GB` : '--'}</strong>
      </div>
    </div>
  );
}

function SidebarPanoramica({ data, onOpenMissions }) {
  const tasks = data?.tasks || [];
  const openTasks = tasks.filter((task) => !task.completed).length;
  const completed = tasks.filter((task) => task.completed).length;
  const notes = data?.notes?.length || 0;

  return (
    <button className="vyctor-panoramica" onClick={onOpenMissions} title="Apri pannello Missioni">
      <div className="vyctor-pan-stat">
        <span className="vyctor-pan-num">{openTasks}</span>
        <span className="vyctor-pan-lbl">Aperte</span>
      </div>
      <div className="vyctor-pan-divider" />
      <div className="vyctor-pan-stat">
        <span className="vyctor-pan-num">{completed}</span>
        <span className="vyctor-pan-lbl">Chiuse</span>
      </div>
      <div className="vyctor-pan-divider" />
      <div className="vyctor-pan-stat">
        <span className="vyctor-pan-num">{notes}</span>
        <span className="vyctor-pan-lbl">Note</span>
      </div>
    </button>
  );
}

function VyctorMessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`vyctor-msg-row ${isUser ? 'is-user' : 'is-assistant'}`}>
      <div className={`vyctor-bubble ${isUser ? 'is-user' : 'is-assistant'}`}>
        <div className="vyctor-msg-role">{isUser ? 'Tu' : 'VYCTOR'}</div>
        <p>{message.content}</p>
        {message.tools?.length > 0 && (
          <div className="vyctor-tool-list">
            {message.tools.map((tool, index) => (
              <span key={`${tool.name}-${index}`} className="vyctor-tool-chip">
                {tool.name}
              </span>
            ))}
          </div>
        )}
        <div className="vyctor-msg-time">{formatTimestamp(message.timestamp)}</div>
      </div>
    </div>
  );
}

export default function VyctorInterface() {
  const { chat, confirmAction, getActionLog, modelName } = useVyctor();
  const [sessions, setSessions] = useState(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => loadSessions()[0]?.id ?? null);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [lastMeta, setLastMeta] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLog, setActionLog] = useState([]);
  const [vyctorData, setVyctorData] = useState({ tasks: [], notes: [], events: [] });
  const [showMissions, setShowMissions] = useState(false);
  const stats = useSystemStats();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    persistSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, status]);

  const refreshActionLog = useCallback(async () => {
    const log = await getActionLog();
    setActionLog(log);
  }, [getActionLog]);

  const refreshVyctorData = useCallback(async () => {
    try {
      const data = await fetchBotData('vyctor');
      setVyctorData(data.vyctor || { tasks: [], notes: [], events: [] });
    } catch {
      setVyctorData({ tasks: [], notes: [], events: [] });
    }
  }, []);

  useEffect(() => {
    getActionLog()
      .then(setActionLog)
      .catch(() => setActionLog([]));
    fetchBotData('vyctor')
      .then((data) => setVyctorData(data.vyctor || { tasks: [], notes: [], events: [] }))
      .catch(() => setVyctorData({ tasks: [], notes: [], events: [] }));
  }, [getActionLog]);

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

    try {
      const historyForModel = conversationMessages.map(({ role, content }) => ({ role, content }));
      const {
        text,
        meta,
        pendingAction: requestedAction,
        executedTools = [],
      } = await chat(trimmed, 'VYCTOR', historyForModel);

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: text,
        tools: executedTools,
        timestamp: Date.now(),
      };

      updateActiveSession((s) => {
        const next = [...s.messages, assistantMessage];
        return { ...s, title: buildTitle(next), updatedAt: Date.now(), messages: next };
      });

      setLastMeta(meta);
      if (requestedAction) {
        setPendingAction(requestedAction);
      } else {
        await refreshActionLog();
        if (executedTools.some((tool) => ['aggiungi_task', 'completa_task', 'salva_nota'].includes(tool.name))) {
          await refreshVyctorData();
        }
      }
      setStatus('idle');
    } catch (err) {
      setError(err.message || 'Errore durante la risposta.');
      setStatus('idle');
    }
  };

  const handlePendingAction = async (approved) => {
    if (!pendingAction) return;
    setStatus('thinking');
    setError('');

    try {
      const { text, meta, executedTools } = await confirmAction(pendingAction.id, approved);
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: text || (approved ? 'Azione completata.' : 'Azione annullata.'),
        tools: executedTools,
        timestamp: Date.now(),
      };

      updateActiveSession((s) => {
        const next = [...s.messages, assistantMessage];
        return { ...s, title: buildTitle(next), updatedAt: Date.now(), messages: next };
      });

      setPendingAction(null);
      setLastMeta(meta);
      await refreshActionLog();
      if (executedTools.some((tool) => ['aggiungi_task', 'completa_task', 'salva_nota'].includes(tool.name))) {
        await refreshVyctorData();
      }
      setStatus('idle');
    } catch (err) {
      setError(err.message || 'Errore durante la conferma azione.');
      setStatus('idle');
    }
  };

  const statusLabel =
    status === 'thinking' ? 'Elaborazione...' : pendingAction ? 'In attesa conferma' : 'Online';
  const backgroundState = status === 'thinking' ? 'speaking' : 'idle';

  return (
    <div className="vyctor-shell">

      {/* ── Entity — background assoluto ──────────────────── */}
      <div className="vyctor-bg-layer" aria-hidden="true">
        <VyctorEntity state={backgroundState} />
      </div>

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className="vyctor-history-panel">

        <div className="vyctor-panel-header">
          <div>
            <div className="eyebrow">Strategia personale</div>
            <h1>VYCTOR</h1>
          </div>
          <div className="alfred-header-actions">
            <button
              type="button"
              className="ghost-button alfred-goals-btn vyctor-missions-btn"
              onClick={() => setShowMissions(true)}
            >
              MISSIONI
            </button>
            <button type="button" className="ghost-button" onClick={createNewChat}>
              + Nuova
            </button>
          </div>
        </div>

        <div className="vyctor-history-list" role="list">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className={`vyctor-history-item ${session.id === activeSession?.id ? 'is-active' : ''}`}
              onClick={() => { setActiveSessionId(session.id); setError(''); }}
            >
              <span className="vyctor-history-title">{session.title}</span>
              <span className="vyctor-history-date">{formatTimestamp(session.updatedAt)}</span>
            </button>
          ))}
        </div>

        <div className="vyctor-diag-panel">
          <div className="vyctor-diag-title">Panoramica</div>
          <SidebarPanoramica data={vyctorData} onOpenMissions={() => setShowMissions(true)} />
        </div>

        <div className="vyctor-diag-panel">
          <div className="vyctor-diag-title">Sistema</div>
          <SystemMetrics stats={stats} />
        </div>

        <div className="vyctor-diag-panel">
          <div className="vyctor-diag-title">Azioni</div>
          <div className="vyctor-diag-list">
            {actionLog.length === 0 ? (
              <div className="vyctor-diag-empty">Nessuna azione eseguita.</div>
            ) : (
              actionLog.slice(0, 6).map((entry) => (
                <div
                  key={entry.id}
                  className={`vyctor-diag-item ${entry.ok ? 'is-ok' : 'is-error'}`}
                >
                  <span>
                    {new Date(entry.timestamp).toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <strong>{entry.tool}</strong>
                </div>
              ))
            )}
          </div>
        </div>

      </aside>

      {/* ── Chat — minimale, trasparente ──────────────────── */}
      <main className="vyctor-chat-panel">

        <div className="vyctor-chat-status">
          <span className={`status-dot ${status === 'thinking' ? 'is-busy' : ''}`} />
          <div>
            <div className="status-label">{statusLabel}</div>
            <div className="status-subtitle">OpenAI · {modelName}</div>
          </div>
        </div>

        <div className="vyctor-thread">
          {conversationMessages.map((message) => (
            <VyctorMessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {lastMeta?.themes?.length > 0 && (
          <div className="vyctor-meta-row">
            {lastMeta.themes.slice(0, 4).map((theme) => (
              <span key={theme} className="vyctor-meta-chip">{theme}</span>
            ))}
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        {pendingAction && (
          <div className="vyctor-action-confirm" role="dialog" aria-live="polite">
            <div>
              <div className="vyctor-confirm-title">Conferma richiesta</div>
              <p>{pendingAction.message}</p>
            </div>
            <div className="vyctor-confirm-controls">
              <button
                type="button"
                className="ghost-button"
                onClick={() => handlePendingAction(false)}
              >
                Annulla
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => handlePendingAction(true)}
              >
                Esegui
              </button>
            </div>
          </div>
        )}

        <form className="vyctor-composer" onSubmit={handleSubmit}>
          <label className="vyctor-composer-field">
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
              placeholder="Scrivi qui il tuo messaggio..."
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

      {showMissions && (
        <VyctorMissionsPanel
          data={vyctorData}
          actionLog={actionLog}
          onDataChange={refreshVyctorData}
          onClose={() => setShowMissions(false)}
        />
      )}
    </div>
  );
}
