import { useState, useEffect } from 'react';
import { loadDiaryEntries, saveDiaryEntries } from '../store/localStorage';

const TAGS = ['Progresso', 'Idea', 'Riflessione', 'Ostacolo'];

const TAG_COLORS = {
  Progresso:   '#00ff88',
  Idea:        '#00d4ff',
  Riflessione: '#aa88ff',
  Ostacolo:    '#ff4455',
};

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + '  '
      + d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

export default function DiarySection() {
  const [entries, setEntries] = useState(() => loadDiaryEntries());
  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [tag,     setTag]     = useState('Progresso');

  useEffect(() => { saveDiaryEntries(entries); }, [entries]);

  const addEntry = () => {
    const t = title.trim();
    const c = content.trim();
    if (!t && !c) return;
    setEntries((prev) => [
      {
        id:        Date.now(),
        title:     t,
        content:   c,
        tag,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setTitle('');
    setContent('');
  };

  const deleteEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="view-area">

      {/* Header */}
      <div className="dash-section-title">◌ DIARIO — <span style={{ color: 'rgba(200,230,245,0.5)', fontWeight: 400 }}>{entries.length} note</span></div>

      {/* Compose panel */}
      <div className="diary-compose">
        <input
          className="dash-input"
          placeholder="Titolo nota..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="diary-tag-row">
          {TAGS.map((t) => (
            <button
              key={t}
              className={`diary-tag-btn${tag === t ? ' active' : ''}`}
              style={tag === t ? { borderColor: TAG_COLORS[t], color: TAG_COLORS[t] } : {}}
              onClick={() => setTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <textarea
          className="diary-textarea"
          placeholder="Scrivi qui la tua nota..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
        />
        <button className="dash-action-btn" onClick={addEntry}>+ AGGIUNGI NOTA</button>
      </div>

      {/* Entries */}
      <div className="diary-list">
        {entries.length === 0 && (
          <div className="dash-empty">Nessuna nota. Scrivi il tuo primo pensiero.</div>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="diary-entry">
            <div className="diary-entry-meta">
              <span className="diary-entry-date">{formatDate(entry.createdAt)}</span>
              <span
                className="diary-entry-tag"
                style={{ color: TAG_COLORS[entry.tag], borderColor: TAG_COLORS[entry.tag] }}
              >
                {entry.tag}
              </span>
              <button className="dash-del-btn" onClick={() => deleteEntry(entry.id)} title="Elimina">✕</button>
            </div>
            {entry.title && <div className="diary-entry-title">{entry.title}</div>}
            {entry.content && <div className="diary-entry-content">{entry.content}</div>}
          </div>
        ))}
      </div>

    </div>
  );
}
