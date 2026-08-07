import { useState } from 'react';
import { createAlmaNote } from '../utils/dataApi';

const TABS = ['Diario', 'Meditazione'];
const EMOTIONS = ['neutro', 'sereno', 'stressato', 'triste', 'positivo'];

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}  ${d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return '';
  }
}

function DiarioTab({ data, onDataChange }) {
  const notes = data?.notes || [];
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('neutro');
  const [message, setMessage] = useState('');

  const add = async () => {
    const nextTitle = title.trim();
    const nextContent = content.trim();
    if (!nextTitle && !nextContent) return;
    setMessage('');
    try {
      await createAlmaNote({
        titolo: nextTitle,
        contenuto: nextContent,
        categoria: 'Diario',
        emozione: emotion,
      });
      setTitle('');
      setContent('');
      setEmotion('neutro');
      setMessage('Voce salvata.');
      await onDataChange?.();
    } catch (error) {
      setMessage(error.message || 'Errore durante il salvataggio diario.');
    }
  };

  return (
    <div className="ag-tab-content">
      <div className="ag-tab-summary">{notes.length} voc{notes.length === 1 ? 'e' : 'i'} nel diario</div>
      <div className="ag-diary-compose">
        <input
          className="ag-input"
          placeholder="Titolo opzionale..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <div className="ag-tag-row">
          {EMOTIONS.map((item) => (
            <button
              key={item}
              type="button"
              className={`ag-tag-btn${emotion === item ? ' active' : ''}`}
              onClick={() => setEmotion(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <textarea
          className="ag-textarea"
          placeholder="Scrivi una voce di diario..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
        />
        <button type="button" className="ag-add-btn" onClick={add}>+ Aggiungi voce</button>
        {message && <div className="ag-inline-message">{message}</div>}
      </div>
      <div className="ag-diary-list">
        {notes.length === 0 && <div className="ag-empty">Nessuna voce ancora.</div>}
        {notes.map((note) => (
          <div key={note.id} className="ag-diary-entry">
            <div className="ag-diary-meta">
              <span className="ag-diary-date">{formatDate(note.createdAt)}</span>
              {note.emotion && <span className="ag-diary-tag">{note.emotion}</span>}
            </div>
            {note.title && <div className="ag-diary-title">{note.title}</div>}
            {note.content && <div className="ag-diary-content">{note.content}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AlmaWellnessPanel({
  data,
  onStartMeditation,
  onDataChange,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('Diario');

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="ag-overlay alma-wellness-panel" onClick={handleOverlayClick}>
      <div className="ag-modal">
        <div className="ag-modal-header">
          <div className="ag-modal-title">DIARIO &amp; MEDITAZIONE</div>
          <button type="button" className="ag-close-btn" onClick={onClose} aria-label="Chiudi">x</button>
        </div>
        <div className="ag-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`ag-tab-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => {
                if (tab === 'Meditazione') {
                  onStartMeditation?.();
                  onClose();
                  return;
                }
                setActiveTab(tab);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="ag-modal-body">
          {activeTab === 'Diario' && <DiarioTab data={data} onDataChange={onDataChange} />}
        </div>
      </div>
    </div>
  );
}
