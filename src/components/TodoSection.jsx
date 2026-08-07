import { useState, useEffect } from 'react';
import { loadTodos, saveTodos } from '../store/localStorage';

const CATEGORIES = ['Tutti', 'Sito', 'Studio', 'Clienti', 'Altro'];

const CAT_COLORS = {
  Sito:    '#00d4ff',
  Studio:  '#00ff88',
  Clienti: '#ffaa00',
  Altro:   'rgba(200,230,245,0.5)',
};

export default function TodoSection() {
  const [todos,      setTodos]      = useState(() => loadTodos());
  const [input,      setInput]      = useState('');
  const [category,   setCategory]   = useState('Sito');
  const [filter,     setFilter]     = useState('Tutti');

  useEffect(() => { saveTodos(todos); }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      {
        id:        Date.now(),
        text,
        category,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setInput('');
  };

  const toggleTodo  = (id) => setTodos((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTodo  = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const visible = filter === 'Tutti' ? todos : todos.filter((t) => t.category === filter);
  const open    = todos.filter((t) => !t.completed).length;

  return (
    <div className="view-area">

      {/* Header */}
      <div className="dash-section-title">◎ TO DO — <span style={{ color: 'rgba(200,230,245,0.5)', fontWeight: 400 }}>{open} aperti</span></div>

      {/* Add row */}
      <div className="todo-add-row">
        <input
          className="dash-input"
          placeholder="Aggiungi un task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <select
          className="dash-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.slice(1).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="dash-action-btn" onClick={addTodo}>+ AGGIUNGI</button>
      </div>

      {/* Filters */}
      <div className="todo-filters">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`todo-filter-btn${filter === c ? ' active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
            {c !== 'Tutti' && (
              <span className="todo-filter-count">
                {todos.filter((t) => t.category === c && !t.completed).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="todo-list">
        {visible.length === 0 && (
          <div className="dash-empty">Nessun task. Aggiungine uno sopra.</div>
        )}
        {visible.map((todo) => (
          <div key={todo.id} className={`todo-item${todo.completed ? ' todo-done' : ''}`}>
            <label className="todo-check-label">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="dash-checkbox"
              />
              <span className="todo-text">{todo.text}</span>
            </label>
            <span
              className="todo-cat-badge"
              style={{ color: CAT_COLORS[todo.category] || CAT_COLORS.Altro, borderColor: CAT_COLORS[todo.category] || CAT_COLORS.Altro }}
            >
              {todo.category}
            </span>
            <button className="dash-del-btn" onClick={() => deleteTodo(todo.id)} title="Elimina">✕</button>
          </div>
        ))}
      </div>

    </div>
  );
}
