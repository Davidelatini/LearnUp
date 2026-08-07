import { useState } from 'react';
import { runDataTool } from '../utils/dataApi';

const TABS = ['Missioni', 'Azioni'];
const CATEGORIES = ['Priorita', 'Lavoro', 'Strategia', 'Routine', 'Altro'];

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}  ${d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return '';
  }
}

function MissionsTab({ data, onDataChange }) {
  const tasks = data?.tasks || [];
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('Priorita');

  const add = async () => {
    const text = input.trim();
    if (!text) return;
    await runDataTool('aggiungi_task', { ambito: 'vyctor', testo: text, categoria: category });
    setInput('');
    await onDataChange?.();
  };

  const complete = async (task) => {
    if (task.completed) return;
    await runDataTool('completa_task', { ambito: 'vyctor', id: task.id });
    await onDataChange?.();
  };

  const open = tasks.filter((task) => !task.completed).length;

  return (
    <div className="ag-tab-content">
      <div className="ag-tab-summary">{open} mission{open === 1 ? 'e aperta' : 'i aperte'}</div>
      <div className="ag-add-row">
        <input
          className="ag-input"
          placeholder="Aggiungi task organizzativa..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && add()}
        />
        <select className="ag-select" value={category} onChange={(event) => setCategory(event.target.value)}>
          {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button type="button" className="ag-add-btn" onClick={add}>+ Aggiungi</button>
      </div>
      <div className="ag-list">
        {tasks.length === 0 && <div className="ag-empty">Nessuna missione ancora.</div>}
        {tasks.map((task) => (
          <div key={task.id} className={`ag-item${task.completed ? ' ag-done' : ''}`}>
            <label className="ag-check-label">
              <input
                type="checkbox"
                checked={Boolean(task.completed)}
                onChange={() => complete(task)}
                className="ag-checkbox"
              />
              <span className="ag-item-text">{task.text || task.title}</span>
            </label>
            <span className="ag-cat-badge">{task.category || 'Altro'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionsTab({ actionLog }) {
  return (
    <div className="ag-tab-content">
      <div className="ag-tab-summary">{actionLog.length} azion{actionLog.length === 1 ? 'e' : 'i'} recenti</div>
      <div className="ag-list">
        {actionLog.length === 0 && <div className="ag-empty">Nessuna azione eseguita.</div>}
        {actionLog.slice(0, 10).map((entry) => (
          <div key={entry.id} className={`ag-item${entry.ok ? '' : ' ag-error'}`}>
            <span className="ag-item-text">{entry.tool}</span>
            <span className="ag-cat-badge">{formatDate(entry.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VyctorMissionsPanel({ data, actionLog, onDataChange, onClose }) {
  const [activeTab, setActiveTab] = useState('Missioni');

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="ag-overlay vyctor-missions-panel" onClick={handleOverlayClick}>
      <div className="ag-modal">
        <div className="ag-modal-header">
          <div className="ag-modal-title">MISSIONI &amp; AZIONI</div>
          <button type="button" className="ag-close-btn" onClick={onClose} aria-label="Chiudi">x</button>
        </div>
        <div className="ag-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`ag-tab-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="ag-modal-body">
          {activeTab === 'Missioni' && <MissionsTab data={data} onDataChange={onDataChange} />}
          {activeTab === 'Azioni' && <ActionsTab actionLog={actionLog} />}
        </div>
      </div>
    </div>
  );
}
