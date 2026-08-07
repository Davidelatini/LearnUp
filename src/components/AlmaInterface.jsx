import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../alfred.css';
import '../alma.css';
import AlmaEntity from './AlmaEntity';
import AlmaWellnessPanel from './AlmaWellnessPanel';
import AlmaBreathingSession from './AlmaBreathingSession';
import useOpenAI from '../hooks/useOpenAI';
import { fetchBotData, createAlmaNote } from '../utils/dataApi';

const STORAGE_KEY = 'alma_chat_sessions_v2';
const EMOTIONS = ['neutro', 'sereno', 'stressato', 'triste', 'positivo'];

const WELCOME_MESSAGE = {
  id: 'welcome-assistant',
  role: 'assistant',
  content: 'Benvenuto. Possiamo iniziare da quello che hai in mente adesso.',
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
    return parsed.map((session) => ({
      ...session,
      title: buildTitle(session.messages || []),
    }));
  } catch {
    return [createSession()];
  }
}

function persistSessions(sessions) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {}
}

function formatTimestamp(value) {
  return new Date(value).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })} ${d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return '';
  }
}

function buildTitle(messages) {
  const firstUserMessage = messages.find((message) => message.role === 'user');
  if (!firstUserMessage) return 'Nuova conversazione';
  const cleaned = String(firstUserMessage.content || '')
    .replace(/\s+/g, ' ')
    .trim();
  const normalizedTokens = cleaned
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .match(/[a-z0-9]+/g) || [];
  const meaningfulTokens = normalizedTokens.filter((token) =>
    token.length > 2 &&
    !token.startsWith('alma') &&
    !['ciao', 'test', 'prova', 'hey', 'ehi'].includes(token)
  );
  if (meaningfulTokens.length < 2) return 'Nuova conversazione';
  return cleaned.length > 42 ? `${cleaned.slice(0, 42)}...` : cleaned;
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`message-row ${isUser ? 'is-user' : 'is-assistant'}`}>
      <div className={`message-bubble ${isUser ? 'is-user' : 'is-assistant'}`}>
        <div className="message-role">{isUser ? 'Tu' : 'ALMA'}</div>
        <p>{message.content}</p>
        {message.tools?.length > 0 && (
          <div className="alma-tool-list">
            {message.tools.map((tool, index) => (
              <span key={`${tool.name}-${index}`} className="alma-tool-chip">
                {tool.name}
              </span>
            ))}
          </div>
        )}
        <div className="message-time">{formatTimestamp(message.timestamp)}</div>
      </div>
    </div>
  );
}

function AlmaDiaryPanel({ data, onDataChange }) {
  const notes = data?.notes || [];
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('neutro');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = async () => {
    const text = content.trim();
    if (!text || saving) return;
    setSaving(true);
    setSavedMsg('');
    try {
      await createAlmaNote({
        titolo: '',
        contenuto: text,
        categoria: 'Diario',
        emozione: emotion,
      });
      setContent('');
      setEmotion('neutro');
      setSavedMsg('Salvato ✓');
      setTimeout(() => setSavedMsg(''), 2000);
      await onDataChange?.();
    } catch (err) {
      setSavedMsg(err.message || 'Errore');
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="alma-diary-panel">
      <div className="alma-diary-panel-header">
        <span className="alma-diary-panel-title">Diario</span>
        <span className="alma-diary-panel-count">{notes.length} voci</span>
      </div>

      <div className="alma-diary-quick-compose">
        <div className="alma-diary-emotions">
          {EMOTIONS.map((e) => (
            <button
              key={e}
              type="button"
              className={`alma-diary-emo-btn${emotion === e ? ' active' : ''}`}
              onClick={() => setEmotion(e)}
            >
              {e}
            </button>
          ))}
        </div>

        <textarea
          className="alma-diary-quick-textarea"
          placeholder="Scrivi un pensiero... (Ctrl+Enter per salvare)"
          value={content}
          onChange={(ev) => setContent(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter' && ev.ctrlKey) {
              ev.preventDefault();
              handleSave();
            }
          }}
          rows={4}
        />

        <div className="alma-diary-quick-footer">
          {savedMsg
            ? <span className="alma-diary-saved-msg">{savedMsg}</span>
            : <span className="alma-diary-ctrl-hint">Ctrl+Enter per salvare</span>
          }
          <button
            type="button"
            className="primary-button"
            onClick={handleSave}
            disabled={saving || !content.trim()}
          >
            {saving ? '...' : 'Salva'}
          </button>
        </div>
      </div>

      <div className="alma-diary-panel-list">
        {notes.length === 0 && (
          <div className="alma-diary-panel-empty">Nessuna voce ancora.</div>
        )}
        {notes.slice().reverse().slice(0, 30).map((note) => (
          <div key={note.id} className="alma-diary-panel-entry">
            <div className="alma-diary-panel-meta">
              <span>{formatDate(note.createdAt)}</span>
              {note.emotion && <span className="alma-diary-panel-tag">{note.emotion}</span>}
            </div>
            {note.title && <div className="alma-diary-panel-entry-title">{note.title}</div>}
            {note.content && <div className="alma-diary-panel-entry-text">{note.content}</div>}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function AlmaInterface() {
  const { chat, confirmAction, getActionLog, modelName } = useOpenAI();
  const [sessions, setSessions] = useState(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => loadSessions()[0]?.id ?? null);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [lastMeta, setLastMeta] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLog, setActionLog] = useState([]);
  const [almaData, setAlmaData] = useState({ tasks: [], notes: [], events: [] });
  const [showWellness, setShowWellness] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [breathingInfo, setBreathingInfo] = useState({ breathingPhase: '', isActive: false });
  const messagesEndRef = useRef(null);

  const refreshAlmaData = useCallback(async () => {
    try {
      const data = await fetchBotData('alma');
      setAlmaData(data.alma || { tasks: [], notes: [], events: [] });
    } catch {
      setAlmaData({ tasks: [], notes: [], events: [] });
    }
  }, []);

  const refreshActionLog = useCallback(async () => {
    const log = await getActionLog();
    setActionLog(log);
  }, [getActionLog]);

  useEffect(() => {
    persistSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, status]);

  useEffect(() => {
    getActionLog()
      .then(setActionLog)
      .catch(() => setActionLog([]));
    fetchBotData('alma')
      .then((data) => setAlmaData(data.alma || { tasks: [], notes: [], events: [] }))
      .catch(() => setAlmaData({ tasks: [], notes: [], events: [] }));
  }, [getActionLog]);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? sessions[0] ?? null,
    [sessions, activeSessionId],
  );

  const conversationMessages = activeSession?.messages ?? [];

  const createNewChat = () => {
    const nextSession = createSession();
    setSessions((previous) => [nextSession, ...previous]);
    setActiveSessionId(nextSession.id);
    setDraft('');
    setError('');
    setLastMeta(null);
  };

  const updateActiveSession = (updater) => {
    setSessions((previous) =>
      previous.map((session) =>
        session.id === activeSessionId ? updater(session) : session,
      ),
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
    updateActiveSession((session) => ({
      ...session,
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
      } = await chat(trimmed, 'CORE', historyForModel);

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: text,
        tools: executedTools,
        timestamp: Date.now(),
      };

      updateActiveSession((session) => {
        const nextMessages = [...session.messages, assistantMessage];
        return { ...session, title: buildTitle(nextMessages), updatedAt: Date.now(), messages: nextMessages };
      });

      setLastMeta(meta);
      if (requestedAction) {
        setPendingAction(requestedAction);
      } else {
        await refreshActionLog();
        if (executedTools.some((tool) => tool.name === 'salva_nota')) await refreshAlmaData();
      }
      setStatus('idle');
    } catch (err) {
      setError(err.message || 'Errore durante la risposta di OpenAI.');
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

      updateActiveSession((session) => {
        const nextMessages = [...session.messages, assistantMessage];
        return { ...session, title: buildTitle(nextMessages), updatedAt: Date.now(), messages: nextMessages };
      });

      setPendingAction(null);
      setLastMeta(meta);
      await refreshActionLog();
      if (executedTools.some((tool) => tool.name === 'salva_nota')) await refreshAlmaData();
      setStatus('idle');
    } catch (err) {
      setError(err.message || 'Errore durante la conferma azione.');
      setStatus('idle');
    }
  };

  const statusLabel = status === 'thinking' ? 'Sta scrivendo...' : pendingAction ? 'In attesa conferma' : 'Online';
  const sphereState = breathingInfo.isActive ? 'breathing' : status === 'thinking' ? 'speaking' : 'idle';

  return (
    <div className="alma-app-shell">

      {/* ── Sinistra: cronologia chat ─────────────────── */}
      <aside className="history-panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">Crescita personale</div>
            <h1>ALMA</h1>
          </div>
          <div className="alfred-header-actions">
            <button
              type="button"
              className="ghost-button alfred-goals-btn alma-wellness-btn"
              onClick={() => setShowWellness(true)}
            >
              PANORAMICA
            </button>
            <button type="button" className="ghost-button" onClick={createNewChat}>
              + Nuova
            </button>
          </div>
        </div>

        <div className="history-list" role="list">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className={`history-item ${session.id === activeSession?.id ? 'is-active' : ''}`}
              onClick={() => { setActiveSessionId(session.id); setError(''); }}
            >
              <span className="history-title">{session.title}</span>
              <span className="history-date">{formatTimestamp(session.updatedAt)}</span>
            </button>
          ))}
        </div>

        <div className="diagnostics-panel">
          <div className="diagnostics-title">Panoramica</div>
          <div className="diagnostics-list">
            <button
              type="button"
              className="alma-panoramica diagnostics-item is-ok"
              onClick={() => setShowWellness(true)}
              title="Apri pannello Diario e Respirazione"
            >
              <strong>{almaData.notes.length}</strong>
              <span>voci salvate</span>
            </button>
            {actionLog.slice(0, 4).map((entry) => (
              <div key={entry.id} className={`diagnostics-item ${entry.ok ? 'is-ok' : 'is-error'}`}>
                <span>{new Date(entry.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                <strong>{entry.tool}</strong>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Centro: entity + chat ─────────────────────── */}
      <div className="alma-center">

        {/* Entity animata */}
        <div className="alma-entity-zone">
          <AlmaEntity
            state={sphereState}
            breathingPhase={breathingInfo.isActive ? breathingInfo.breathingPhase : ''}
          />
        </div>

        {/* Chat */}
        <main className="chat-panel">
          <div className="alma-chat-status">
            <span className={`status-dot ${status === 'thinking' ? 'is-busy' : ''}`} />
            <div>
              <div className="status-label">{statusLabel}</div>
              <div className="status-subtitle">OpenAI · {modelName}</div>
            </div>
          </div>

          <div className="chat-thread">
            {conversationMessages.map((message) => <MessageBubble key={message.id} message={message} />)}
            <div ref={messagesEndRef} />
          </div>

          {lastMeta?.themes?.length > 0 && (
            <div className="meta-row">
              {lastMeta.themes.slice(0, 4).map((theme) => <span key={theme} className="meta-chip">{theme}</span>)}
            </div>
          )}

          {error && <div className="error-banner">{error}</div>}

          {pendingAction && (
            <div className="action-confirmation" role="dialog" aria-live="polite">
              <div>
                <div className="action-confirmation-title">Conferma richiesta</div>
                <p>{pendingAction.message}</p>
              </div>
              <div className="action-confirmation-controls">
                <button type="button" className="ghost-button" onClick={() => handlePendingAction(false)}>Annulla</button>
                <button type="button" className="primary-button" onClick={() => handlePendingAction(true)}>Esegui</button>
              </div>
            </div>
          )}

          <form className="composer" onSubmit={handleSubmit}>
            <label className="composer-field">
              <span className="visually-hidden">Messaggio</span>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit(event);
                  }
                }}
                placeholder="Scrivi qui il tuo messaggio..."
                rows={1}
                disabled={status === 'thinking'}
              />
            </label>
            <button type="submit" className="primary-button" disabled={status === 'thinking' || !draft.trim()}>Invia</button>
          </form>
        </main>
      </div>

      {/* ── Destra: diario rapido ─────────────────────── */}
      <AlmaDiaryPanel data={almaData} onDataChange={refreshAlmaData} />

      {/* ── Overlays ──────────────────────────────────── */}
      {showMeditation && (
        <AlmaBreathingSession
          onBreathingChange={setBreathingInfo}
          onClose={() => {
            setShowMeditation(false);
            setBreathingInfo({ breathingPhase: '', isActive: false });
          }}
        />
      )}

      {showWellness && (
        <AlmaWellnessPanel
          data={almaData}
          onStartMeditation={() => setShowMeditation(true)}
          onDataChange={refreshAlmaData}
          onClose={() => setShowWellness(false)}
        />
      )}
    </div>
  );
}
