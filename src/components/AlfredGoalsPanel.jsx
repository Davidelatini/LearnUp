import { useState } from 'react';
import { createAlfredEvent, createAlfredNote, runDataTool } from '../utils/dataApi';

const TABS = ['Obiettivi', 'Calendario', 'Note'];
const DAYS_IT = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

const OBJ_CATEGORIES = ['Vita', 'Salute', 'Lavoro', 'Crescita', 'Altro'];
const OBJ_COLORS = {
  Vita: '#5fb7ff',
  Salute: '#00ff88',
  Lavoro: '#00d4ff',
  Crescita: '#aa88ff',
  Altro: 'rgba(200,230,245,0.5)',
};

const NOTE_TAGS = ['Progresso', 'Idea', 'Riflessione', 'Ostacolo'];
const NOTE_COLORS = {
  Progresso: '#00ff88',
  Idea: '#5fb7ff',
  Riflessione: '#aa88ff',
  Ostacolo: '#ff4455',
};

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}  ${d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return '';
  }
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function normalizeDate(value) {
  if (!value) return '';
  const text = String(value).trim();
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : '';
}

function ObiettiviTab({ data, onDataChange, trashed, deleted, onMoveToTrash, onRestore, onDeleteForever }) {
  const tasks = data?.tasks || [];
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('Vita');
  const [cestOpen, setCestOpen] = useState(false);

  const activeTasks   = tasks.filter((t) => !t.completed && !trashed.has(t.id) && !deleted.has(t.id));
  const completedTasks = tasks.filter((t) => t.completed && !trashed.has(t.id) && !deleted.has(t.id));
  const trashedTasks  = tasks.filter((t) => trashed.has(t.id) && !deleted.has(t.id));
  const allVisible    = [...activeTasks, ...completedTasks];

  const add = async () => {
    const text = input.trim();
    if (!text) return;
    await runDataTool('aggiungi_task', { ambito: 'alfred', testo: text, categoria: category });
    setInput('');
    await onDataChange?.();
  };

  const complete = async (task) => {
    if (task.completed) return;
    await runDataTool('completa_task', { ambito: 'alfred', id: task.id });
    await onDataChange?.();
  };

  return (
    <div className="ag-tab-content">
      <div className="ag-tab-summary">{activeTasks.length} obiettiv{activeTasks.length === 1 ? 'o aperto' : 'i aperti'}</div>
      <div className="ag-add-row">
        <input
          className="ag-input"
          placeholder="Aggiungi obiettivo..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && add()}
        />
        <select className="ag-select" value={category} onChange={(event) => setCategory(event.target.value)}>
          {OBJ_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button className="ag-add-btn" onClick={add}>+ Aggiungi</button>
      </div>

      <div className="ag-list">
        {allVisible.length === 0 && <div className="ag-empty">Nessun obiettivo ancora.</div>}
        {allVisible.map((task) => (
          <div key={task.id} className={`ag-item${task.completed ? ' ag-done' : ''}`}>
            <label className="ag-check-label">
              <input
                type="checkbox"
                checked={Boolean(task.completed)}
                onChange={() => complete(task)}
                className="ag-checkbox"
              />
              <span className="ag-item-text">{task.text}</span>
            </label>
            <span
              className="ag-cat-badge"
              style={{
                color: OBJ_COLORS[task.category] || OBJ_COLORS.Altro,
                borderColor: OBJ_COLORS[task.category] || OBJ_COLORS.Altro,
              }}
            >
              {task.category || 'Altro'}
            </span>
            {!task.completed && (
              <button type="button" className="ag-trash-btn" onClick={() => onMoveToTrash(task.id)} title="Sposta nel cestino">⌦</button>
            )}
          </div>
        ))}
      </div>

      {/* Cestino */}
      <div className="ag-cestino">
        <button type="button" className="ag-cest-toggle" onClick={() => setCestOpen((v) => !v)}>
          <span>Cestino{trashedTasks.length > 0 ? ` (${trashedTasks.length})` : ''}</span>
          <span className="ag-cest-chevron">{cestOpen ? '▲' : '▼'}</span>
        </button>
        {cestOpen && (
          <div className="ag-cest-list">
            {trashedTasks.length === 0 && <div className="ag-empty">Cestino vuoto.</div>}
            {trashedTasks.map((task) => (
              <div key={task.id} className="ag-cest-item">
                <span className="ag-cest-text">{task.text}</span>
                <div className="ag-cest-actions">
                  <button type="button" className="ag-cest-restore" onClick={() => onRestore(task.id)} title="Ripristina">↩</button>
                  <button type="button" className="ag-cest-delete" onClick={() => onDeleteForever(task.id)} title="Elimina definitivamente">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DiarioTab({ data, onDataChange }) {
  const notes = data?.notes || [];
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Progresso');
  const [message, setMessage] = useState('');

  const add = async () => {
    const nextTitle = title.trim();
    const nextContent = content.trim();
    if (!nextTitle && !nextContent) return;
    setMessage('');
    try {
      await createAlfredNote({
        titolo: nextTitle,
        contenuto: nextContent,
        categoria: tag,
      });
      setTitle('');
      setContent('');
      setMessage('Nota salvata.');
      await onDataChange?.();
    } catch (error) {
      setMessage(error.message || 'Errore durante il salvataggio nota.');
    }
  };

  return (
    <div className="ag-tab-content">
      <div className="ag-tab-summary">{notes.length} not{notes.length === 1 ? 'a' : 'e'} nel diario</div>
      <div className="ag-diary-compose">
        <input
          className="ag-input"
          placeholder="Titolo nota..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <div className="ag-tag-row">
          {NOTE_TAGS.map((item) => (
            <button
              key={item}
              className={`ag-tag-btn${tag === item ? ' active' : ''}`}
              style={tag === item ? { borderColor: NOTE_COLORS[item], color: NOTE_COLORS[item] } : {}}
              onClick={() => setTag(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <textarea
          className="ag-textarea"
          placeholder="Scrivi qui la tua nota..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
        />
        <button className="ag-add-btn" onClick={add}>+ Aggiungi nota</button>
        {message && <div className="ag-inline-message">{message}</div>}
      </div>
      <div className="ag-diary-list">
        {notes.length === 0 && <div className="ag-empty">Nessuna nota ancora.</div>}
        {notes.map((note) => {
          const category = note.category || note.tag || 'Progresso';
          return (
            <div key={note.id} className="ag-diary-entry">
              <div className="ag-diary-meta">
                <span className="ag-diary-date">{formatDate(note.createdAt)}</span>
                <span
                  className="ag-diary-tag"
                  style={{
                    color: NOTE_COLORS[category] || OBJ_COLORS.Altro,
                    borderColor: NOTE_COLORS[category] || OBJ_COLORS.Altro,
                  }}
                >
                  {category}
                </span>
              </div>
              {note.title && <div className="ag-diary-title">{note.title}</div>}
              {note.content && <div className="ag-diary-content">{note.content}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarTab({ data, onDataChange }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(toDateStr(now.getFullYear(), now.getMonth(), now.getDate()));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const tasks = data?.tasks || [];
  const events = data?.events || [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rawFirst = new Date(year, month, 1).getDay();
  const startOffset = rawFirst === 0 ? 6 : rawFirst - 1;
  const cells = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  const calendarItems = [
    ...tasks
      .map((task) => ({ id: task.id, date: normalizeDate(task.dueDate), title: task.text, type: 'task', completed: task.completed }))
      .filter((item) => item.date),
    ...events
      .map((event) => ({ id: event.id, date: normalizeDate(event.date), title: event.title, type: 'event', description: event.description }))
      .filter((item) => item.date),
  ];

  const selectedItems = calendarItems.filter((item) => item.date === selectedDate);

  const prevMonth = () => setMonth((value) => {
    if (value === 0) {
      setYear((current) => current - 1);
      return 11;
    }
    return value - 1;
  });

  const nextMonth = () => setMonth((value) => {
    if (value === 11) {
      setYear((current) => current + 1);
      return 0;
    }
    return value + 1;
  });

  const saveEvent = async () => {
    const nextTitle = title.trim();
    if (!nextTitle || !selectedDate) return;
    setMessage('');
    try {
      await createAlfredEvent({
        data: selectedDate,
        titolo: nextTitle,
        descrizione: description.trim(),
      });
      setTitle('');
      setDescription('');
      setMessage('Evento salvato.');
      await onDataChange?.();
    } catch (error) {
      setMessage(error.message || 'Errore durante il salvataggio evento.');
    }
  };

  return (
    <div className="ag-tab-content">
      <div className="ag-calendar-toolbar">
        <button className="ag-cal-nav" onClick={prevMonth} aria-label="Mese precedente">&lt;</button>
        <div className="ag-calendar-title">{MONTHS_IT[month]} {year}</div>
        <button className="ag-cal-nav" onClick={nextMonth} aria-label="Mese successivo">&gt;</button>
      </div>

      <div className="ag-calendar-grid">
        {DAYS_IT.map((day, index) => <div key={`${day}-${index}`} className="ag-cal-dow">{day}</div>)}
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="ag-cal-empty" />;
          const date = toDateStr(year, month, day);
          const dayItems = calendarItems.filter((item) => item.date === date);
          return (
            <button
              key={date}
              className={`ag-cal-day${date === selectedDate ? ' active' : ''}${dayItems.length ? ' has-items' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <span>{day}</span>
              {dayItems.length > 0 && <span className="ag-cal-dot">{dayItems.length}</span>}
            </button>
          );
        })}
      </div>

      <div className="ag-calendar-side">
        <div className="ag-tab-summary">Giorno selezionato: {selectedDate}</div>
        <div className="ag-add-row ag-calendar-form">
          <input
            className="ag-input"
            placeholder="Titolo evento..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button className="ag-add-btn" onClick={saveEvent}>+ Evento</button>
        </div>
        <textarea
          className="ag-textarea"
          placeholder="Descrizione opzionale..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
        {message && <div className="ag-inline-message">{message}</div>}
        <div className="ag-list">
          {selectedItems.length === 0 && <div className="ag-empty">Nessuna scadenza o evento in questo giorno.</div>}
          {selectedItems.map((item) => (
            <div key={`${item.type}-${item.id}`} className={`ag-item${item.completed ? ' ag-done' : ''}`}>
              <span className="ag-item-text">{item.title}</span>
              <span className="ag-cat-badge">{item.type === 'task' ? 'Scadenza' : 'Evento'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AlfredGoalsPanel({ data, onDataChange, onClose, trashed, deleted, onMoveToTrash, onRestore, onDeleteForever }) {
  const [activeTab, setActiveTab] = useState('Obiettivi');

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="ag-overlay" onClick={handleOverlayClick}>
      <div className="ag-modal">
        <div className="ag-modal-header">
          <div className="ag-modal-title">OBIETTIVI &amp; LAVORO</div>
          <button className="ag-close-btn" onClick={onClose} aria-label="Chiudi">x</button>
        </div>
        <div className="ag-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`ag-tab-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="ag-modal-body">
          {activeTab === 'Obiettivi' && (
            <ObiettiviTab
              data={data}
              onDataChange={onDataChange}
              trashed={trashed}
              deleted={deleted}
              onMoveToTrash={onMoveToTrash}
              onRestore={onRestore}
              onDeleteForever={onDeleteForever}
            />
          )}
          {activeTab === 'Calendario' && <CalendarTab data={data} onDataChange={onDataChange} />}
          {activeTab === 'Note' && <DiarioTab data={data} onDataChange={onDataChange} />}
        </div>
      </div>
    </div>
  );
}
