import { useState, useEffect, useCallback } from 'react';
import {
  loadDashboard, saveDashboard,
  loadTodos, loadDiaryEntries,
} from '../store/localStorage';
import EditModal from './EditModal';

// ─── Shared sub-components ─────────────────────────────────────────────────────

function CheckItem({ item, onToggle }) {
  return (
    <label className="dash-check-row">
      <input
        type="checkbox"
        checked={item.checked ?? item.done ?? false}
        onChange={() => onToggle(item.id)}
        className="dash-checkbox"
      />
      <span className={item.checked || item.done ? 'dash-check-label done' : 'dash-check-label'}>
        {item.text ?? item.label}
      </span>
    </label>
  );
}

function SkillBar({ item }) {
  return (
    <div className="dash-skill-row">
      <div className="dash-skill-header">
        <span className="dash-skill-name">{item.name}</span>
        <span className="dash-skill-pct">{item.pct}%</span>
      </div>
      <div className="dash-skill-track">
        <div className="dash-skill-fill" style={{ width: `${item.pct}%` }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }) {
  return (
    <div className="dash-stat-card">
      <span className="dash-stat-value">{value}<span className="dash-stat-unit">{unit}</span></span>
      <span className="dash-stat-label">{label}</span>
    </div>
  );
}

// ─── Modal content components ──────────────────────────────────────────────────

function ListEditor({ items, keyName, onChange, labels = {} }) {
  const [newText, setNewText] = useState('');

  const addItem = () => {
    const t = newText.trim();
    if (!t) return;
    const next = [...items, { id: Date.now(), [keyName]: t, checked: false, done: false }];
    onChange(next);
    setNewText('');
  };

  const removeItem = (id) => onChange(items.filter((i) => i.id !== id));

  const toggleItem = (id) =>
    onChange(items.map((i) =>
      i.id === id
        ? { ...i, checked: !i.checked, done: !i.done }
        : i,
    ));

  const editText = (id, val) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [keyName]: val } : i)));

  return (
    <div className="dash-modal-list">
      {items.map((item) => (
        <div key={item.id} className="dash-modal-list-row">
          <input
            type="checkbox"
            checked={item.checked ?? item.done ?? false}
            onChange={() => toggleItem(item.id)}
            className="dash-checkbox"
          />
          <input
            className="dash-modal-input flex1"
            value={item[keyName] ?? ''}
            onChange={(e) => editText(item.id, e.target.value)}
          />
          <button className="dash-modal-del" onClick={() => removeItem(item.id)} title="Elimina">✕</button>
        </div>
      ))}
      <div className="dash-modal-add-row">
        <input
          className="dash-modal-input flex1"
          placeholder={labels.placeholder ?? 'Nuova voce...'}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button className="dash-modal-add-btn" onClick={addItem}>+ AGGIUNGI</button>
      </div>
    </div>
  );
}

function PriorityEditor({ items, onChange }) {
  const edit = (id, field, val) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: val } : i)));

  return (
    <div className="dash-modal-list">
      {items.map((item, idx) => (
        <div key={item.id} className="dash-modal-priority-row">
          <span className="dash-priority-num">{idx + 1}</span>
          <div className="dash-priority-fields">
            <input
              className="dash-modal-input"
              placeholder="Titolo priorità"
              value={item.title}
              onChange={(e) => edit(item.id, 'title', e.target.value)}
            />
            <textarea
              className="dash-modal-textarea"
              placeholder="Descrizione"
              value={item.desc}
              onChange={(e) => edit(item.id, 'desc', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CompetenzeEditor({ items, onChange }) {
  const [newName, setNewName] = useState('');

  const addItem = () => {
    const n = newName.trim();
    if (!n) return;
    onChange([...items, { id: Date.now(), name: n, pct: 50 }]);
    setNewName('');
  };

  const removeItem = (id) => onChange(items.filter((i) => i.id !== id));

  const editItem = (id, field, val) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: val } : i)));

  return (
    <div className="dash-modal-list">
      {items.map((item) => (
        <div key={item.id} className="dash-modal-skill-row">
          <input
            className="dash-modal-input flex1"
            value={item.name}
            onChange={(e) => editItem(item.id, 'name', e.target.value)}
          />
          <input
            type="range"
            min={0} max={100}
            value={item.pct}
            onChange={(e) => editItem(item.id, 'pct', Number(e.target.value))}
            className="dash-modal-range"
          />
          <span className="dash-modal-pct-label">{item.pct}%</span>
          <button className="dash-modal-del" onClick={() => removeItem(item.id)}>✕</button>
        </div>
      ))}
      <div className="dash-modal-add-row">
        <input
          className="dash-modal-input flex1"
          placeholder="Nome competenza..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button className="dash-modal-add-btn" onClick={addItem}>+ AGGIUNGI</button>
      </div>
    </div>
  );
}

function ServiziEditor({ items, onChange }) {
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const addItem = () => {
    const n = newName.trim();
    const p = newPrice.trim();
    if (!n) return;
    onChange([...items, { id: Date.now(), name: n, price: p }]);
    setNewName('');
    setNewPrice('');
  };

  const removeItem = (id) => onChange(items.filter((i) => i.id !== id));

  const editItem = (id, field, val) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: val } : i)));

  return (
    <div className="dash-modal-list">
      {items.map((item) => (
        <div key={item.id} className="dash-modal-list-row">
          <input
            className="dash-modal-input flex1"
            value={item.name}
            onChange={(e) => editItem(item.id, 'name', e.target.value)}
            placeholder="Servizio"
          />
          <input
            className="dash-modal-input"
            style={{ width: '110px' }}
            value={item.price}
            onChange={(e) => editItem(item.id, 'price', e.target.value)}
            placeholder="Prezzo"
          />
          <button className="dash-modal-del" onClick={() => removeItem(item.id)}>✕</button>
        </div>
      ))}
      <div className="dash-modal-add-row">
        <input
          className="dash-modal-input flex1"
          placeholder="Nome servizio..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          className="dash-modal-input"
          style={{ width: '110px' }}
          placeholder="Prezzo"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button className="dash-modal-add-btn" onClick={addItem}>+ AGGIUNGI</button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function DashboardHome() {
  const [data, setData]       = useState(() => loadDashboard());
  const [modal, setModal]     = useState(null);
  const [todoCount, setTodoCount]   = useState(0);
  const [diaryCount, setDiaryCount] = useState(0);

  useEffect(() => {
    setTodoCount(loadTodos().filter((t) => !t.completed).length);
    setDiaryCount(loadDiaryEntries().length);
  }, []);

  const sitePct = data.statoSito.length
    ? Math.round((data.statoSito.filter((s) => s.done).length / data.statoSito.length) * 100)
    : 0;

  const update = useCallback((key, value) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      saveDashboard(next);
      return next;
    });
  }, []);

  const toggleCheck = (key, id) => {
    const field = key === 'statoSito' ? 'done' : 'checked';
    update(key, data[key].map((i) => (i.id === id ? { ...i, [field]: !i[field] } : i)));
  };

  const openModal = (id) => setModal(id);
  const closeModal = () => setModal(null);

  return (
    <div className="view-area">

      {/* ── Panoramica ── */}
      <div className="dash-section-title">◉ PANORAMICA</div>
      <div className="dash-stats-row">
        <StatCard label="Task Aperti"   value={todoCount}  unit="" />
        <StatCard label="Note Diario"   value={diaryCount} unit="" />
        <StatCard label="Sito"          value={sitePct}    unit="%" />
      </div>

      <div className="dash-grid-2">

        {/* ── Hai già ── */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">HAI GIÀ</span>
            <button className="dash-edit-btn" onClick={() => openModal('haiGia')}>MODIFICA</button>
          </div>
          {data.haiGia.map((item) => (
            <CheckItem key={item.id} item={item} onToggle={(id) => toggleCheck('haiGia', id)} />
          ))}
        </div>

        {/* ── Priorità ── */}
        <div className="dash-card" style={{ gridRow: 'span 2' }}>
          <div className="dash-card-header">
            <span className="dash-card-title">PRIORITÀ PRINCIPALI</span>
            <button className="dash-edit-btn" onClick={() => openModal('priorita')}>MODIFICA</button>
          </div>
          {data.priorita.map((item, idx) => (
            <div key={item.id} className="dash-priority-item">
              <span className="dash-priority-num">{idx + 1}</span>
              <div>
                <div className="dash-priority-title">{item.title}</div>
                <div className="dash-priority-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Stai facendo ── */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">STAI FACENDO</span>
            <button className="dash-edit-btn" onClick={() => openModal('staiFacendo')}>MODIFICA</button>
          </div>
          {data.staiFacendo.map((item) => (
            <CheckItem key={item.id} item={item} onToggle={(id) => toggleCheck('staiFacendo', id)} />
          ))}
        </div>

        {/* ── Competenze ── */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">COMPETENZE</span>
            <button className="dash-edit-btn" onClick={() => openModal('competenze')}>MODIFICA</button>
          </div>
          {data.competenze.map((item) => <SkillBar key={item.id} item={item} />)}
        </div>

        {/* ── Stato sito ── */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">STATO SITO</span>
            <button className="dash-edit-btn" onClick={() => openModal('statoSito')}>MODIFICA</button>
          </div>
          <div className="dash-sito-progress">
            <div className="dash-sito-bar" style={{ width: `${sitePct}%` }} />
          </div>
          {data.statoSito.map((item) => (
            <CheckItem key={item.id} item={item} onToggle={(id) => toggleCheck('statoSito', id)} />
          ))}
        </div>

      </div>

      {/* ── Servizi ── */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">SERVIZI & PREZZI</span>
          <button className="dash-edit-btn" onClick={() => openModal('servizi')}>MODIFICA</button>
        </div>
        <div className="dash-servizi-grid">
          {data.servizi.map((item) => (
            <div key={item.id} className="dash-servizio-item">
              <span className="dash-servizio-name">{item.name}</span>
              <span className="dash-servizio-price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modals ── */}

      {modal === 'haiGia' && (
        <EditModal title="MODIFICA — HAI GIÀ" onClose={closeModal}>
          <ListEditor
            items={data.haiGia}
            keyName="text"
            onChange={(v) => { update('haiGia', v); }}
            labels={{ placeholder: 'Cosa hai già...' }}
          />
        </EditModal>
      )}

      {modal === 'staiFacendo' && (
        <EditModal title="MODIFICA — STAI FACENDO" onClose={closeModal}>
          <ListEditor
            items={data.staiFacendo}
            keyName="text"
            onChange={(v) => { update('staiFacendo', v); }}
            labels={{ placeholder: 'Cosa stai facendo...' }}
          />
        </EditModal>
      )}

      {modal === 'priorita' && (
        <EditModal title="MODIFICA — PRIORITÀ" onClose={closeModal}>
          <PriorityEditor
            items={data.priorita}
            onChange={(v) => { update('priorita', v); }}
          />
        </EditModal>
      )}

      {modal === 'competenze' && (
        <EditModal title="MODIFICA — COMPETENZE" onClose={closeModal}>
          <CompetenzeEditor
            items={data.competenze}
            onChange={(v) => { update('competenze', v); }}
          />
        </EditModal>
      )}

      {modal === 'statoSito' && (
        <EditModal title="MODIFICA — STATO SITO" onClose={closeModal}>
          <ListEditor
            items={data.statoSito.map((i) => ({ ...i, checked: i.done, text: i.label }))}
            keyName="text"
            onChange={(v) => {
              update('statoSito', v.map((i) => ({ ...i, label: i.text, done: i.checked })));
            }}
            labels={{ placeholder: 'Nome sezione...' }}
          />
        </EditModal>
      )}

      {modal === 'servizi' && (
        <EditModal title="MODIFICA — SERVIZI & PREZZI" onClose={closeModal}>
          <ServiziEditor
            items={data.servizi}
            onChange={(v) => { update('servizi', v); }}
          />
        </EditModal>
      )}

    </div>
  );
}
