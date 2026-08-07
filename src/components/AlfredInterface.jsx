import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../alfred.css';
import useAlfred from '../hooks/useAlfred';
import AlfredEntity from './AlfredEntity';
import AlfredGoalsPanel from './AlfredGoalsPanel';
import { fetchBotData, runDataTool } from '../utils/dataApi';

/* ── Constants ───────────────────────────────────────────── */

const CAL_KEY = 'alfred_calendar_v1';
function loadCalMarks() {
  try { return new Set(JSON.parse(localStorage.getItem(CAL_KEY) ?? '[]')); }
  catch { return new Set(); }
}
function saveCalMarks(set) {
  try { localStorage.setItem(CAL_KEY, JSON.stringify([...set])); } catch {}
}

const MONTHS_IT = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
  'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const DAYS_IT = ['L','M','M','G','V','S','D'];
function toDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const STORAGE_KEY = 'alfred_chat_sessions_v1';

const OBJ_CATEGORIES = ['Vita', 'Salute', 'Lavoro', 'Crescita', 'Altro'];
const OBJ_COLORS = {
  Vita: '#5fb7ff', Salute: '#00ff88', Lavoro: '#00d4ff',
  Crescita: '#aa88ff', Altro: 'rgba(200,230,245,0.5)',
};
const TRASH_KEY   = 'alfred_task_trash_v1';
const DELETED_KEY = 'alfred_task_deleted_v1';
function loadTrashSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) ?? '[]')); }
  catch { return new Set(); }
}
function saveSet(key, set) {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch {}
}

const WELCOME_MESSAGE = {
  id: 'welcome-assistant',
  role: 'assistant',
  content: 'Ciao! Sono ALFRED, il tuo coach personale. Cosa hai in mente oggi — un obiettivo, una scadenza lavorativa, o vuoi fare il punto sui tuoi progressi?',
  timestamp: Date.now(),
};

/* ── Helpers ─────────────────────────────────────────────── */

function createSession() {
  const now = Date.now();
  return { id: `session-${now}`, title: 'Nuova conversazione', createdAt: now, updatedAt: now, messages: [WELCOME_MESSAGE] };
}

function loadSessions() {
  if (typeof window === 'undefined') return [createSession()];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createSession()];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [createSession()];
    return parsed;
  } catch { return [createSession()]; }
}

function persistSessions(sessions) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); } catch {}
}

function formatTimestamp(value) {
  return new Date(value).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })} ${d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
  } catch { return ''; }
}

function buildTitle(messages) {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'Nuova conversazione';
  return first.content.length > 42 ? `${first.content.slice(0, 42)}...` : first.content;
}

/* ── Chat bubble ─────────────────────────────────────────── */

function AlfredMessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`alfred-msg-row ${isUser ? 'is-user' : 'is-assistant'}`}>
      <div className={`alfred-bubble ${isUser ? 'is-user' : 'is-assistant'}`}>
        <div className="alfred-msg-role">{isUser ? 'Tu' : 'ALFRED'}</div>
        <p>{message.content}</p>
        <div className="alfred-msg-time">{formatTimestamp(message.timestamp)}</div>
      </div>
    </div>
  );
}

/* ── Sidebar panoramica ──────────────────────────────────── */

function SidebarPanoramica({ data, onOpenGoals, trashedTasks, onRestore, onDeleteForever }) {
  const todos = data?.tasks || [];
  const diary = data?.notes || [];
  const openTodos = todos.filter((t) => !t.completed).length;
  const done = todos.filter((t) => t.completed).length;
  const [cestOpen, setCestOpen] = useState(false);

  return (
    <div className="alfred-pan-wrapper">
      <button className="alfred-panoramica" onClick={onOpenGoals} title="Apri pannello Obiettivi">
        <div className="alfred-pan-stat">
          <span className="alfred-pan-num">{openTodos}</span>
          <span className="alfred-pan-lbl">Aperti</span>
        </div>
        <div className="alfred-pan-divider" />
        <div className="alfred-pan-stat">
          <span className="alfred-pan-num">{done}</span>
          <span className="alfred-pan-lbl">Completati</span>
        </div>
        <div className="alfred-pan-divider" />
        <div className="alfred-pan-stat">
          <span className="alfred-pan-num">{diary.length}</span>
          <span className="alfred-pan-lbl">Note</span>
        </div>
      </button>

      {/* Cestino */}
      <div className="alfred-pan-cestino">
        <button
          type="button"
          className="alfred-pan-cest-toggle"
          onClick={() => setCestOpen((v) => !v)}
        >
          <span>Cestino{trashedTasks.length > 0 ? ` (${trashedTasks.length})` : ''}</span>
          <span className="alfred-pan-cest-chevron">{cestOpen ? '▲' : '▼'}</span>
        </button>

        {cestOpen && (
          <div className="alfred-pan-cest-list">
            {trashedTasks.length === 0 && (
              <div className="alfred-pan-cest-empty">Cestino vuoto</div>
            )}
            {trashedTasks.map((task) => (
              <div key={task.id} className="alfred-pan-cest-item">
                <span className="alfred-pan-cest-text">{task.text}</span>
                <div className="alfred-pan-cest-actions">
                  <button
                    type="button"
                    className="alfred-pan-cest-restore"
                    onClick={() => onRestore(task.id)}
                    title="Ripristina obiettivo"
                  >↩</button>
                  <button
                    type="button"
                    className="alfred-pan-cest-delete"
                    onClick={() => onDeleteForever(task.id)}
                    title="Elimina definitivamente"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Calendario sidebar ──────────────────────────────────── */

function AlfredCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [marks, setMarks] = useState(() => loadCalMarks());
  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate());
  const prevMonth = () => setMonth((m) => { if (m === 0) { setYear((y) => y - 1); return 11; } return m - 1; });
  const nextMonth = () => setMonth((m) => { if (m === 11) { setYear((y) => y + 1); return 0; } return m + 1; });
  const toggleDay = (ds) => setMarks((prev) => { const next = new Set(prev); if (next.has(ds)) next.delete(ds); else next.add(ds); saveCalMarks(next); return next; });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rawFirst = new Date(year, month, 1).getDay();
  const startOffset = rawFirst === 0 ? 6 : rawFirst - 1;
  const cells = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  return (
    <div className="acal-root">
      <div className="acal-nav-row">
        <button type="button" className="acal-nav-btn" onClick={prevMonth}>‹</button>
        <span className="acal-month-label">{MONTHS_IT[month]} {year}</span>
        <button type="button" className="acal-nav-btn" onClick={nextMonth}>›</button>
      </div>
      <div className="acal-grid">
        {DAYS_IT.map((d, i) => <div key={i} className="acal-dow">{d}</div>)}
        {cells.map((day, i) => {
          if (!day) return <div key={`x${i}`} />;
          const ds = toDateStr(year, month, day);
          return (
            <button key={ds} type="button"
              className={`acal-day${ds === todayStr ? ' acal-today' : ''}${marks.has(ds) ? ' acal-marked' : ''}`}
              onClick={() => toggleDay(ds)}
            >
              <span className="acal-day-num">{day}</span>
              {marks.has(ds) && <span className="acal-dot" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Pannello destro: Obiettivi ──────────────────────────── */

function AlfredRightPanel({ data, onDataChange, trashed, deleted, onMoveToTrash }) {
  const tasks = data?.tasks || [];
  const [taskInput, setTaskInput] = useState('');
  const [taskCategory, setTaskCategory] = useState('Vita');
  const [savingTask, setSavingTask] = useState(false);

  const activeTasks = tasks.filter((t) => !t.completed && !trashed.has(t.id) && !deleted.has(t.id));

  const addTask = async () => {
    const text = taskInput.trim();
    if (!text || savingTask) return;
    setSavingTask(true);
    try {
      await runDataTool('aggiungi_task', { ambito: 'alfred', testo: text, categoria: taskCategory });
      setTaskInput('');
      await onDataChange?.();
    } catch {}
    finally { setSavingTask(false); }
  };

  const completeTask = async (task) => {
    if (task.completed) return;
    try {
      await runDataTool('completa_task', { ambito: 'alfred', id: task.id });
      await onDataChange?.();
    } catch {}
  };

  return (
    <aside className="alfred-right-panel">

      <div className="arp-header">
        <span className="arp-section-title">Obiettivi</span>
        <span className="arp-section-count">{activeTasks.length} aperti</span>
      </div>

      <div className="arp-add-row">
        <input
          className="arp-task-input"
          placeholder="Nuovo obiettivo..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <select
          className="arp-cat-select"
          value={taskCategory}
          onChange={(e) => setTaskCategory(e.target.value)}
        >
          {OBJ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="button" className="arp-add-btn" onClick={addTask} disabled={savingTask || !taskInput.trim()}>
          +
        </button>
      </div>

      <div className="arp-task-list">
        {activeTasks.length === 0 && (
          <div className="arp-empty">Nessun obiettivo aperto.</div>
        )}
        {activeTasks.map((task) => (
          <div key={task.id} className="arp-task-item">
            <input
              type="checkbox"
              className="arp-task-check"
              checked={false}
              onChange={() => completeTask(task)}
              title="Segna come completato"
            />
            <span className="arp-task-text">{task.text}</span>
            <span
              className="arp-cat-badge"
              style={{
                color: OBJ_COLORS[task.category] || OBJ_COLORS.Altro,
                borderColor: OBJ_COLORS[task.category] || OBJ_COLORS.Altro,
              }}
            >
              {task.category || 'Altro'}
            </span>
            <button
              type="button"
              className="arp-trash-btn"
              onClick={() => onMoveToTrash(task.id)}
              title="Sposta nel cestino"
            >
              ⌦
            </button>
          </div>
        ))}
      </div>

    </aside>
  );
}

/* ── Main component ──────────────────────────────────────── */

export default function AlfredInterface() {
  const { chat, modelName } = useAlfred();
  const [sessions, setSessions] = useState(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => loadSessions()[0]?.id ?? null);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [lastMeta, setLastMeta] = useState(null);
  const [showGoals, setShowGoals] = useState(false);
  const [alfredData, setAlfredData] = useState({ tasks: [], notes: [], events: [] });
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const messagesEndRef = useRef(null);

  // Trash state (shared between right panel and panoramica)
  const [trashed, setTrashed] = useState(() => loadTrashSet(TRASH_KEY));
  const [deleted, setDeleted] = useState(() => loadTrashSet(DELETED_KEY));

  const moveToTrash = useCallback((id) => {
    setTrashed((prev) => { const next = new Set(prev); next.add(id); saveSet(TRASH_KEY, next); return next; });
  }, []);

  const restoreFromTrash = useCallback((id) => {
    setTrashed((prev) => { const next = new Set(prev); next.delete(id); saveSet(TRASH_KEY, next); return next; });
  }, []);

  const deleteForever = useCallback((id) => {
    setTrashed((prev) => { const next = new Set(prev); next.delete(id); saveSet(TRASH_KEY, next); return next; });
    setDeleted((prev) => { const next = new Set(prev); next.add(id); saveSet(DELETED_KEY, next); return next; });
  }, []);

  useEffect(() => { persistSessions(sessions); }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, status]);

  const refreshAlfredData = useCallback(async () => {
    try {
      const data = await fetchBotData('alfred');
      setAlfredData(data.alfred || { tasks: [], notes: [], events: [] });
      setDataRefreshKey((v) => v + 1);
    } catch { setAlfredData({ tasks: [], notes: [], events: [] }); }
  }, []);

  useEffect(() => {
    fetchBotData('alfred')
      .then((data) => { setAlfredData(data.alfred || { tasks: [], notes: [], events: [] }); setDataRefreshKey((v) => v + 1); })
      .catch(() => setAlfredData({ tasks: [], notes: [], events: [] }));
  }, []);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? sessions[0] ?? null,
    [sessions, activeSessionId],
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
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? updater(s) : s)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !activeSession) return;

    const userMessage = { id: `user-${Date.now()}`, role: 'user', content: trimmed, timestamp: Date.now() };
    const updatedMessages = [...conversationMessages, userMessage];
    updateActiveSession((s) => ({ ...s, title: buildTitle(updatedMessages), updatedAt: Date.now(), messages: updatedMessages }));
    setDraft('');
    setError('');
    setStatus('thinking');

    try {
      const historyForModel = conversationMessages.map(({ role, content }) => ({ role, content }));
      const { text, meta, executedTools = [] } = await chat(trimmed, historyForModel);
      const assistantMessage = { id: `assistant-${Date.now()}`, role: 'assistant', content: text, timestamp: Date.now() };
      updateActiveSession((s) => {
        const next = [...s.messages, assistantMessage];
        return { ...s, title: buildTitle(next), updatedAt: Date.now(), messages: next };
      });
      setLastMeta(meta);
      if (executedTools.some((t) => ['aggiungi_task', 'completa_task', 'salva_nota'].includes(t.name))) {
        await refreshAlfredData();
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
    <div className="alfred-shell">

      {/* ── Sinistra: cronologia chat ─────────────────── */}
      <aside className="alfred-history-panel">
        <div className="alfred-panel-header">
          <div>
            <div className="eyebrow">Coach & obiettivi</div>
            <h1>ALFRED</h1>
          </div>
          <div className="alfred-header-actions">
            <button type="button" className="ghost-button alfred-goals-btn" onClick={() => setShowGoals(true)}>
              OBIETTIVI
            </button>
            <button type="button" className="ghost-button" onClick={createNewChat}>
              + Nuova
            </button>
          </div>
        </div>

        <div className="alfred-history-section">
          <div className="alfred-section-label">Cronologia</div>
          <div className="alfred-history-list" role="list">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                className={`alfred-history-item ${session.id === activeSession?.id ? 'is-active' : ''}`}
                onClick={() => { setActiveSessionId(session.id); setError(''); }}
              >
                <span className="alfred-history-title">{session.title}</span>
                <span className="alfred-history-date">{formatTimestamp(session.updatedAt)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="alfred-sidebar-bottom">
          <div className="alfred-context-panel">
            <div className="alfred-context-title">Panoramica</div>
            <SidebarPanoramica
              data={alfredData}
              onOpenGoals={() => setShowGoals(true)}
              trashedTasks={alfredData.tasks.filter((t) => trashed.has(t.id) && !deleted.has(t.id))}
              onRestore={restoreFromTrash}
              onDeleteForever={deleteForever}
            />
          </div>
          <div className="alfred-context-panel">
            <div className="alfred-context-title">Calendario</div>
            <AlfredCalendar />
          </div>
        </div>
      </aside>

      {/* ── Centro: entity + chat ─────────────────────── */}
      <div className="alfred-center">

        {/* Entity animata */}
        <div className="alfred-entity-zone">
          <AlfredEntity state={backgroundState} />
        </div>

        {/* Chat */}
        <main className="alfred-chat-panel">
          <div className="alfred-chat-status">
            <span className={`status-dot ${status === 'thinking' ? 'is-busy' : 'online'}`} />
            <div>
              <div className="status-label">{statusLabel}</div>
              <div className="status-subtitle">OpenAI · {modelName}</div>
            </div>
          </div>

          <div className="alfred-thread">
            {conversationMessages.map((message) => (
              <AlfredMessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {lastMeta?.themes?.length > 0 && (
            <div className="alfred-meta-row">
              {lastMeta.themes.slice(0, 4).map((theme) => (
                <span key={theme} className="alfred-meta-chip">{theme}</span>
              ))}
            </div>
          )}

          {error && <div className="error-banner">{error}</div>}

          <form className="alfred-composer" onSubmit={handleSubmit}>
            <label className="alfred-composer-field">
              <span className="visually-hidden">Messaggio</span>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                placeholder="Parla con ALFRED..."
                rows={1}
                disabled={status === 'thinking'}
              />
            </label>
            <button type="submit" className="primary-button" disabled={status === 'thinking' || !draft.trim()}>
              Invia
            </button>
          </form>
        </main>
      </div>

      {/* ── Destra: obiettivi ────────────────────────── */}
      <AlfredRightPanel
        data={alfredData}
        onDataChange={refreshAlfredData}
        trashed={trashed}
        deleted={deleted}
        onMoveToTrash={moveToTrash}
      />

      {/* ── Overlay ───────────────────────────────────── */}
      {showGoals && (
        <AlfredGoalsPanel
          data={alfredData}
          refreshKey={dataRefreshKey}
          onDataChange={refreshAlfredData}
          onClose={() => setShowGoals(false)}
          trashed={trashed}
          deleted={deleted}
          onMoveToTrash={moveToTrash}
          onRestore={restoreFromTrash}
          onDeleteForever={deleteForever}
        />
      )}
    </div>
  );
}
