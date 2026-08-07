import { useState } from 'react';
import { createCapitalNote, runDataTool } from '../utils/dataApi';

const TABS = ['Risparmi', 'Impegni', 'Note', 'Storico'];

const IMPEGNI_CATEGORIES = ['Spesa', 'Risparmio', 'Entrata', 'Abbonamento', 'Rata', 'Altro'];
const CAT_COLORS = {
  Spesa:       '#f0b429',
  Risparmio:   '#00ff88',
  Entrata:     '#5fb7ff',
  Abbonamento: '#aa88ff',
  Rata:        '#ff9944',
  Altro:       'rgba(255, 220, 150, 0.5)',
};
const NOTE_TAGS = ['Spesa', 'Risparmio', 'Budget', 'Entrata', 'Nota'];
const NOTE_COLORS = {
  Spesa:     '#f0b429',
  Risparmio: '#00ff88',
  Budget:    '#aa88ff',
  Entrata:   '#5fb7ff',
  Nota:      'rgba(255, 220, 150, 0.5)',
};

function getCurrentMese() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}  ${d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return '';
  }
}

// ── Risparmi ──────────────────────────────────────────────────────────────────

function RisparmiTab({ data, onDataChange }) {
  const config = data?.config || { stipendio: null, uscite: null };
  const [editingField, setEditingField] = useState(null);
  const [input, setInput] = useState('');
  const stipendio = config.stipendio || 0;
  const uscite = config.uscite || 0;
  const hasBothValues = config.stipendio != null && config.uscite != null;
  const risparmio = hasBothValues ? stipendio - uscite : null;
  const isNeg = risparmio != null && risparmio < 0;

  const saveValue = async () => {
    const val = parseFloat(input);
    if (!isNaN(val) && val >= 0) {
      await runDataTool(editingField === 'stipendio' ? 'imposta_stipendio' : 'imposta_uscite', { importo: val });
      await onDataChange?.();
    }
    setEditingField(null);
  };

  const startEdit = (field) => {
    const value = field === 'stipendio' ? config.stipendio : config.uscite;
    setInput(value != null ? String(value) : '');
    setEditingField(field);
  };

  const valueEditor = (field, value) => editingField === field ? (
    <div className="cp-riepilogo-edit">
      <input
        className="cp-input cp-input-sm"
        type="number"
        min="0"
        step="0.01"
        placeholder="€"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') saveValue();
          if (e.key === 'Escape') setEditingField(null);
        }}
        autoFocus
      />
      <button className="cp-add-btn" onClick={saveValue} aria-label="Salva">✓</button>
      <button className="cp-cancel-btn" onClick={() => setEditingField(null)} aria-label="Annulla">✕</button>
    </div>
  ) : (
    <button className="cp-riepilogo-value-btn" onClick={() => startEdit(field)} title="Clicca per modificare">
      {config[field] != null
        ? <span className={`cp-riepilogo-value ${field === 'stipendio' ? 'cp-value-green' : 'cp-value-red'}`}>€{value.toFixed(2)}</span>
        : <span className="cp-riepilogo-placeholder">— clicca per impostare</span>}
    </button>
  );

  return (
    <div className="cp-tab-content">

      {/* Big saldo */}
      <div className={`cp-saldo-card${isNeg ? ' cp-saldo-neg' : ' cp-saldo-pos'}`}>
        <div className="cp-saldo-eyebrow">Quanto metti da parte</div>
        <div className="cp-saldo-value">
          {risparmio == null ? '—' : `${isNeg ? '−' : '+'}€${Math.abs(risparmio).toFixed(2)}`}
        </div>
        {risparmio == null && <div className="cp-saldo-eyebrow">Imposta stipendio e uscite</div>}
        {isNeg && <div className="cp-saldo-warning">Le uscite superano lo stipendio</div>}
      </div>

      {/* Grid breakdown */}
      <div className="cp-riepilogo-grid">
        <div className="cp-riepilogo-row">
          <span className="cp-riepilogo-label">Stipendio mensile</span>
          {valueEditor('stipendio', stipendio)}
        </div>

        <div className="cp-riepilogo-row">
          <span className="cp-riepilogo-label">Uscite mensili</span>
          {valueEditor('uscite', uscite)}
        </div>

        <div className="cp-riepilogo-divider" />

        <div className="cp-riepilogo-row cp-riepilogo-row-total">
          <span className="cp-riepilogo-label">Risparmio</span>
          <span className={`cp-riepilogo-value ${isNeg ? 'cp-value-red' : 'cp-value-green'}`}>
            {risparmio == null ? '—' : `${isNeg ? '−' : '+'}€${Math.abs(risparmio).toFixed(2)}`}
          </span>
        </div>
      </div>

    </div>
  );
}

// ── Spese Variabili ───────────────────────────────────────────────────────────

function SpeseVariabiliTab({ data, onDataChange }) {
  const speseVariabili = data?.spese_variabili || [];
  const [desc, setDesc] = useState('');
  const [importo, setImporto] = useState('');
  const [loading, setLoading] = useState(false);

  const mese = getCurrentMese();
  const speseMese = speseVariabili.filter((s) => s.mese === mese);
  const nonPagate = speseMese.filter((s) => !s.pagata).length;
  const totale = speseMese.reduce((sum, s) => sum + (s.importo || 0), 0);

  const add = async () => {
    const d = desc.trim();
    const imp = parseFloat(importo);
    if (!d || isNaN(imp) || imp < 0) return;
    setLoading(true);
    try {
      await runDataTool('aggiungi_spesa_variabile', { descrizione: d, importo: imp });
      setDesc('');
      setImporto('');
      await onDataChange?.();
    } finally {
      setLoading(false);
    }
  };

  const togglePagata = async (spesa) => {
    if (spesa.pagata) return;
    await runDataTool('segna_pagata', { id: spesa.id });
    await onDataChange?.();
  };

  return (
    <div className="cp-tab-content">
      <div className="cp-tab-summary">
        {speseMese.length} spese · {nonPagate} non pagate · totale €{totale.toFixed(2)}
      </div>
      <div className="cp-add-row">
        <input
          className="cp-input"
          placeholder="Descrizione spesa..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          disabled={loading}
        />
        <input
          className="cp-input cp-input-amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="€"
          value={importo}
          onChange={(e) => setImporto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          disabled={loading}
        />
        <button className="cp-add-btn" onClick={add} disabled={loading}>
          {loading ? '...' : '+ Aggiungi'}
        </button>
      </div>
      <div className="cp-list">
        {speseMese.length === 0 && (
          <div className="cp-empty">Nessuna spesa variabile questo mese.</div>
        )}
        {speseMese.map((spesa) => (
          <div key={spesa.id} className={`cp-item${spesa.pagata ? ' cp-done' : ''}`}>
            <label className="cp-check-label">
              <input
                type="checkbox"
                className="cp-checkbox"
                checked={Boolean(spesa.pagata)}
                onChange={() => togglePagata(spesa)}
                disabled={spesa.pagata}
              />
              <span className="cp-item-text">{spesa.descrizione}</span>
            </label>
            <span className="cp-sv-importo">€{(spesa.importo || 0).toFixed(2)}</span>
            <span
              className="cp-cat-badge"
              style={{
                color: spesa.pagata ? '#00ff88' : '#ff9944',
                borderColor: spesa.pagata ? '#00ff88' : '#ff9944',
              }}
            >
              {spesa.pagata ? 'Pagata' : 'Da pagare'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Spese Fisse ───────────────────────────────────────────────────────────────

function SpeseFisseTab({ data, onDataChange }) {
  const config = data?.config || { stipendio: null, spese_fisse: [] };
  const [nome, setNome] = useState('');
  const [importo, setImporto] = useState('');
  const [loading, setLoading] = useState(false);

  const speseFisse = config.spese_fisse || [];
  const attive = speseFisse.filter((s) => s.attiva);
  const totaleAttive = attive.reduce((sum, s) => sum + (s.importo || 0), 0);

  const add = async () => {
    const n = nome.trim();
    const imp = parseFloat(importo);
    if (!n || isNaN(imp) || imp < 0) return;
    setLoading(true);
    try {
      await runDataTool('aggiungi_spesa_fissa', { nome: n, importo: imp });
      setNome('');
      setImporto('');
      await onDataChange?.();
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (spesa) => {
    if (spesa.attiva) {
      await runDataTool('rimuovi_spesa_fissa', { id: spesa.id });
    } else {
      // Reactivate by calling the server directly — use aggiungi with same name/importo
      // For simplicity, update via the returned id if attiva_spesa_fissa is available
      try {
        await runDataTool('aggiungi_spesa_fissa', { nome: spesa.nome, importo: spesa.importo });
      } catch { /* ignore */ }
    }
    await onDataChange?.();
  };

  return (
    <div className="cp-tab-content">
      <div className="cp-tab-summary">
        {attive.length} attive · €{totaleAttive.toFixed(2)}/mese
      </div>
      <div className="cp-add-row">
        <input
          className="cp-input"
          placeholder="Nome spesa fissa..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          disabled={loading}
        />
        <input
          className="cp-input cp-input-amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="€/mese"
          value={importo}
          onChange={(e) => setImporto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          disabled={loading}
        />
        <button className="cp-add-btn" onClick={add} disabled={loading}>
          {loading ? '...' : '+ Aggiungi'}
        </button>
      </div>
      <div className="cp-list">
        {speseFisse.length === 0 && (
          <div className="cp-empty">Nessuna spesa fissa configurata.</div>
        )}
        {speseFisse.map((spesa) => (
          <div key={spesa.id} className={`cp-item${!spesa.attiva ? ' cp-done' : ''}`}>
            <label className="cp-check-label" title={spesa.attiva ? 'Disattiva' : 'Riattiva'}>
              <input
                type="checkbox"
                className="cp-checkbox"
                checked={Boolean(spesa.attiva)}
                onChange={() => toggle(spesa)}
              />
              <span className="cp-item-text">{spesa.nome}</span>
            </label>
            <span className="cp-sv-importo">€{(spesa.importo || 0).toFixed(2)}/mese</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Impegni ───────────────────────────────────────────────────────────────────

function ImpegniTab({ data, onDataChange }) {
  const tasks = data?.tasks || [];
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('Spesa');

  const add = async () => {
    const text = input.trim();
    if (!text) return;
    await runDataTool('aggiungi_task', { ambito: 'capital', testo: text, categoria: category });
    setInput('');
    await onDataChange?.();
  };

  const complete = async (task) => {
    if (task.completed) return;
    await runDataTool('completa_task', { ambito: 'capital', id: task.id });
    await onDataChange?.();
  };

  const open = tasks.filter((t) => !t.completed).length;

  return (
    <div className="cp-tab-content">
      <div className="cp-tab-summary">{open} impegn{open === 1 ? 'o in sospeso' : 'i in sospeso'}</div>
      <div className="cp-add-row">
        <input
          className="cp-input"
          placeholder="Es: affitto €950, abbonamento Netflix, fondo emergenza..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <select className="cp-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {IMPEGNI_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="cp-add-btn" onClick={add}>+ Aggiungi</button>
      </div>
      <div className="cp-list">
        {tasks.length === 0 && <div className="cp-empty">Nessun impegno finanziario ancora.</div>}
        {tasks.map((task) => (
          <div key={task.id} className={`cp-item${task.completed ? ' cp-done' : ''}`}>
            <label className="cp-check-label">
              <input
                type="checkbox"
                checked={Boolean(task.completed)}
                onChange={() => complete(task)}
                className="cp-checkbox"
              />
              <span className="cp-item-text">{task.text}</span>
            </label>
            <span
              className="cp-cat-badge"
              style={{
                color: CAT_COLORS[task.category] || CAT_COLORS.Altro,
                borderColor: CAT_COLORS[task.category] || CAT_COLORS.Altro,
              }}
            >
              {task.category || 'Altro'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Note ──────────────────────────────────────────────────────────────────────

function NoteTab({ data, onDataChange }) {
  const notes = (data?.notes || []).filter((n) => !n._storico);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Spesa');
  const [message, setMessage] = useState('');

  const add = async () => {
    const nextTitle = title.trim();
    const nextContent = content.trim();
    if (!nextTitle && !nextContent) return;
    setMessage('');
    try {
      await createCapitalNote({ titolo: nextTitle, contenuto: nextContent, categoria: tag });
      setTitle('');
      setContent('');
      setMessage('Nota salvata.');
      await onDataChange?.();
    } catch (error) {
      setMessage(error.message || 'Errore durante il salvataggio.');
    }
  };

  return (
    <div className="cp-tab-content">
      <div className="cp-tab-summary">{notes.length} not{notes.length === 1 ? 'a' : 'e'} registrat{notes.length === 1 ? 'a' : 'e'}</div>
      <div className="cp-note-compose">
        <input
          className="cp-input"
          placeholder="Titolo (es: spesa supermercato 14 giu)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="cp-tag-row">
          {NOTE_TAGS.map((t) => (
            <button
              key={t}
              className={`cp-tag-btn${tag === t ? ' active' : ''}`}
              style={tag === t ? { borderColor: NOTE_COLORS[t], color: NOTE_COLORS[t] } : {}}
              onClick={() => setTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <textarea
          className="cp-textarea"
          placeholder="Importo, dettagli, note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        <button className="cp-add-btn" onClick={add}>+ Aggiungi nota</button>
        {message && <div className="cp-inline-message">{message}</div>}
      </div>
      <div className="cp-note-list">
        {notes.length === 0 && <div className="cp-empty">Nessuna nota ancora.</div>}
        {notes.map((note) => {
          const category = note.category || note.tag || 'Nota';
          return (
            <div key={note.id} className="cp-note-entry">
              <div className="cp-note-meta">
                <span className="cp-note-date">{formatDate(note.createdAt)}</span>
                <span
                  className="cp-note-tag"
                  style={{
                    color: NOTE_COLORS[category] || NOTE_COLORS.Nota,
                    borderColor: NOTE_COLORS[category] || NOTE_COLORS.Nota,
                  }}
                >
                  {category}
                </span>
              </div>
              {note.title && <div className="cp-note-title">{note.title}</div>}
              {note.content && <div className="cp-note-content">{note.content}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Storico ───────────────────────────────────────────────────────────────────

function StoricoTab({ data }) {
  const tasks = data?.tasks || [];
  const notes = data?.notes || [];
  const done = tasks.filter((t) => t.completed);

  const items = [
    ...done.map((t) => ({ id: t.id, date: t.completedAt || t.createdAt, label: t.text, type: 'Completato', category: t.category })),
    ...notes.map((n) => ({ id: n.id, date: n.createdAt, label: n.title || n.content?.slice(0, 60) || '—', type: 'Nota', category: n.category || n.tag })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="cp-tab-content">
      <div className="cp-tab-summary">{items.length} element{items.length === 1 ? 'o' : 'i'} nello storico</div>
      <div className="cp-list">
        {items.length === 0 && <div className="cp-empty">Nessuno storico ancora.</div>}
        {items.map((item) => (
          <div key={`${item.type}-${item.id}`} className="cp-item cp-done">
            <span className="cp-item-text">{item.label}</span>
            <span
              className="cp-cat-badge"
              style={{
                color: CAT_COLORS[item.category] || CAT_COLORS.Altro,
                borderColor: CAT_COLORS[item.category] || CAT_COLORS.Altro,
              }}
            >
              {item.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export default function CapitalPanel({ data, onDataChange, onClose }) {
  const [activeTab, setActiveTab] = useState('Risparmi');

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="cp-overlay" onClick={handleOverlayClick}>
      <div className="cp-modal">
        <div className="cp-modal-header">
          <div className="cp-modal-title">CAPITAL — QUADRO FINANZIARIO</div>
          <button className="cp-close-btn" onClick={onClose} aria-label="Chiudi">✕</button>
        </div>
        <div className="cp-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`cp-tab-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="cp-modal-body">
          {activeTab === 'Risparmi'        && <RisparmiTab        data={data} onDataChange={onDataChange} />}
          {activeTab === 'Impegni'         && <ImpegniTab         data={data} onDataChange={onDataChange} />}
          {activeTab === 'Note'            && <NoteTab            data={data} onDataChange={onDataChange} />}
          {activeTab === 'Storico'         && <StoricoTab         data={data} />}
        </div>
      </div>
    </div>
  );
}
