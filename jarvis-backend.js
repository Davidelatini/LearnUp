(function () {
  const STORAGE_KEYS = {
    todos: 'jarvis_todos',
    diary: 'jarvis_diary',
    kanban: 'jarvis_kanban',
    chat: 'jarvis_chat',
    settings: 'jarvis_settings',
    stats: 'jarvis_stats',
    meta: 'jarvis_meta',
    activity: 'jarvis_activity',
  };

  const DEFAULTS = {
    todos: [],
    diary: [],
    kanban: { todo: [], inprogress: [], done: [] },
    chat: [],
    settings: {
      userName: 'David',
      almaPersonality: '',
      apiKeyHint: '',
      theme: 'dark',
      language: 'it',
      notifications: true,
      reminderCheckInterval: 60000,
      maxChatHistory: 100,
      createdAt: null,
      updatedAt: null,
    },
    stats: {},
    meta: {
      version: 2,
      createdAt: null,
      lastSync: null,
    },
    activity: [],
  };

  const inMemoryStore = new Map();
  let storageAvailable = null;

  const _utils = {
    uuid: () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16);
    }),
    now: () => new Date().toISOString(),
    today: () => new Date().toISOString().split('T')[0],
    dayName: (dateStr) => {
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('it-IT', { weekday: 'short' }).toUpperCase().slice(0, 3);
      } catch (err) {
        return '---';
      }
    },
    formatDate: (dateStr) => {
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('it-IT', {
          weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC'
        }).toUpperCase().replace(/ /g, ' ');
      } catch (err) {
        return dateStr;
      }
    },
    truncate: (str, n) => typeof str === 'string' && str.length > n ? str.slice(0, n) + '…' : str,
    countWords: (str) => typeof str === 'string' ? str.trim().split(/\s+/).filter(Boolean).length : 0,
    clamp: (n, min, max) => Math.min(Math.max(n, min), max),
  };

  const _validators = {
    date: (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime()),
    dateTime: (value) => typeof value === 'string' && !Number.isNaN(new Date(value).getTime()),
    mood: (value) => Number.isInteger(value) && value >= 1 && value <= 5,
    priority: (value) => ['alta', 'media', 'bassa'].includes(value),
    column: (value) => ['todo', 'inprogress', 'done'].includes(value),
    stringMax: (value, max) => typeof value === 'string' && value.length <= max,
    tags: (value) => Array.isArray(value) && value.every((item) => typeof item === 'string'),
    role: (value) => ['user', 'assistant'].includes(value),
  };

  function _checkStorageAvailability() {
    if (storageAvailable !== null) {
      return storageAvailable;
    }
    try {
      const key = '__alma_db_test__';
      window.localStorage.setItem(key, '1');
      window.localStorage.removeItem(key);
      storageAvailable = true;
    } catch (error) {
      storageAvailable = false;
      console.warn('ALMA_DB: localStorage unavailable, using in-memory fallback.', error);
    }
    return storageAvailable;
  }

  function _readRaw(key) {
    if (_checkStorageAvailability()) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.warn('ALMA_DB read failed, falling back to memory:', error);
      }
    }
    return inMemoryStore.has(key) ? inMemoryStore.get(key) : null;
  }

  function _writeRaw(key, value) {
    const serialized = JSON.stringify(value);
    if (_checkStorageAvailability()) {
      try {
        window.localStorage.setItem(key, serialized);
        return true;
      } catch (error) {
        console.warn('ALMA_DB write failed, falling back to memory:', error);
      }
    }
    inMemoryStore.set(key, serialized);
    return false;
  }

  function _removeRaw(key) {
    if (_checkStorageAvailability()) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn('ALMA_DB remove failed, falling back to memory:', error);
      }
    }
    inMemoryStore.delete(key);
  }

  function _parseOrDefault(raw, fallback) {
    if (typeof raw !== 'string' || raw === null) {
      return _deepClone(fallback);
    }
    try {
      const value = JSON.parse(raw);
      return value === null ? _deepClone(fallback) : value;
    } catch (error) {
      return _deepClone(fallback);
    }
  }

  function _deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function _safeString(value) {
    return typeof value === 'string' ? value : '';
  }

  function _normalizeApiKeyHint(value) {
    const hint = _safeString(value);
    return hint.slice(-4);
  }

  function _normalizeTask(task, existing = null) {
    if (!task || typeof task !== 'object') {
      throw Object.assign(new Error('InvalidTaskError: Task must be an object'), { name: 'InvalidTaskError' });
    }
    const now = _utils.now();
    const base = existing ? { ...existing } : {
      id: _utils.uuid(),
      createdAt: now,
      completed: false,
      completedAt: null,
      column: 'todo',
      position: 0,
      tags: [],
      reminder: null,
      reminded: false,
    };

    const title = _safeString(task.title).trim();
    if (!title || title.length > 200) {
      throw Object.assign(new Error('InvalidTaskError: title is required and must be 1-200 characters'), { name: 'InvalidTaskError' });
    }

    const description = _safeString(task.description).trim();
    if (description.length > 1000) {
      throw Object.assign(new Error('InvalidTaskError: description must be 0-1000 characters'), { name: 'InvalidTaskError' });
    }

    const priority = _validators.priority(task.priority) ? task.priority : 'media';
    const category = _safeString(task.category).trim();
    const dueDate = task.dueDate === null ? null : _safeString(task.dueDate).trim() || null;
    if (dueDate !== null && !_validators.date(dueDate)) {
      throw Object.assign(new Error('InvalidTaskError: dueDate must be ISO date string or null'), { name: 'InvalidTaskError' });
    }

    const completed = Boolean(task.completed);
    const completedAt = completed ? (task.completedAt || now) : null;
    const column = _validators.column(task.column) ? task.column : 'todo';
    const position = Number.isInteger(task.position) && task.position >= 0 ? task.position : 0;
    const tags = _validators.tags(task.tags) ? task.tags.slice() : [];
    const reminder = task.reminder === null ? null : _safeString(task.reminder).trim() || null;
    if (reminder !== null && !_validators.dateTime(reminder)) {
      throw Object.assign(new Error('InvalidTaskError: reminder must be ISO datetime or null'), { name: 'InvalidTaskError' });
    }
    const reminded = Boolean(task.reminded);

    return {
      ...base,
      title,
      description,
      priority,
      category,
      dueDate,
      completed,
      completedAt,
      column,
      position,
      updatedAt: now,
      tags,
      reminder,
      reminded,
    };
  }

  function _normalizeDiaryEntry(entry, existing = null) {
    if (!entry || typeof entry !== 'object') {
      throw Object.assign(new Error('InvalidDiaryEntryError: Entry must be an object'), { name: 'InvalidDiaryEntryError' });
    }
    const now = _utils.now();
    const date = _safeString(entry.date).trim();
    if (!_validators.date(date)) {
      throw Object.assign(new Error('InvalidDiaryEntryError: date must be ISO YYYY-MM-DD'), { name: 'InvalidDiaryEntryError' });
    }
    const content = _safeString(entry.content).trim();
    if (content.length > 10000) {
      throw Object.assign(new Error('InvalidDiaryEntryError: content must be 0-10000 characters'), { name: 'InvalidDiaryEntryError' });
    }
    const mood = Number(entry.mood);
    if (!_validators.mood(mood)) {
      throw Object.assign(new Error('InvalidDiaryEntryError: mood must be integer 1-5'), { name: 'InvalidDiaryEntryError' });
    }
    const moodLabel = _safeString(entry.moodLabel) || ['pessimo', 'brutto', 'ok', 'buono', 'ottimo'][mood - 1];
    return {
      id: existing ? existing.id : _utils.uuid(),
      date,
      content,
      mood,
      moodLabel,
      wordCount: _utils.countWords(content),
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };
  }

  function _normalizeMessage(message) {
    if (!message || typeof message !== 'object') {
      throw Object.assign(new Error('InvalidMessageError: Message must be an object'), { name: 'InvalidMessageError' });
    }
    const role = _validators.role(message.role) ? message.role : 'user';
    const content = _safeString(message.content);
    if (!content) {
      throw Object.assign(new Error('InvalidMessageError: content is required'), { name: 'InvalidMessageError' });
    }
    const timestamp = _safeString(message.timestamp) || _utils.now();
    if (!_validators.dateTime(timestamp)) {
      throw Object.assign(new Error('InvalidMessageError: timestamp must be ISO datetime string'), { name: 'InvalidMessageError' });
    }
    const tokens = Number.isFinite(message.tokens) ? Number(message.tokens) : null;
    return {
      id: message.id || _utils.uuid(),
      role,
      content,
      timestamp,
      tokens,
    };
  }

  function _normalizeSettings(settings) {
    if (!settings || typeof settings !== 'object') {
      throw Object.assign(new Error('InvalidSettingsError: Settings must be an object'), { name: 'InvalidSettingsError' });
    }
    const now = _utils.now();
    const merged = {
      ...DEFAULTS.settings,
      ...settings,
      userName: _safeString(settings.userName) || DEFAULTS.settings.userName,
      almaPersonality: _safeString(settings.almaPersonality),
      apiKeyHint: _normalizeApiKeyHint(settings.apiKeyHint || ''),
      theme: settings.theme === 'dark' ? 'dark' : 'dark',
      language: _safeString(settings.language) || 'it',
      notifications: typeof settings.notifications === 'boolean' ? settings.notifications : true,
      reminderCheckInterval: Number.isInteger(settings.reminderCheckInterval) && settings.reminderCheckInterval > 0 ? settings.reminderCheckInterval : 60000,
      maxChatHistory: Number.isInteger(settings.maxChatHistory) && settings.maxChatHistory > 0 ? settings.maxChatHistory : 100,
      createdAt: settings.createdAt || now,
      updatedAt: now,
    };
    return merged;
  }

  function _normalizeStats(stats = {}) {
    if (!stats || typeof stats !== 'object') {
      return {};
    }
    return stats;
  }

  function _normalizeKanban(kanban) {
    if (!kanban || typeof kanban !== 'object') {
      return _deepClone(DEFAULTS.kanban);
    }
    const columns = {
      todo: Array.isArray(kanban.todo) ? kanban.todo : [],
      inprogress: Array.isArray(kanban.inprogress) ? kanban.inprogress : [],
      done: Array.isArray(kanban.done) ? kanban.done : [],
    };
    return columns;
  }

  function _persistAll() {
    _writeRaw(STORAGE_KEYS.todos, state.todos);
    _writeRaw(STORAGE_KEYS.diary, state.diary);
    _writeRaw(STORAGE_KEYS.kanban, state.kanban);
    _writeRaw(STORAGE_KEYS.chat, state.chat);
    _writeRaw(STORAGE_KEYS.settings, state.settings);
    _writeRaw(STORAGE_KEYS.stats, state.stats);
    _writeRaw(STORAGE_KEYS.meta, state.meta);
    _writeRaw(STORAGE_KEYS.activity, state.activity);
  }

  function _saveState(key, value) {
    state[key] = _deepClone(value);
    _writeRaw(STORAGE_KEYS[key], state[key]);
  }

  function _updateMeta() {
    state.meta.lastSync = _utils.now();
    if (!state.meta.createdAt) {
      state.meta.createdAt = state.meta.lastSync;
    }
    _writeRaw(STORAGE_KEYS.meta, state.meta);
  }

  function _logActivity(type, label, data) {
    const entry = {
      id: _utils.uuid(),
      type: _safeString(type),
      label: _safeString(label),
      timestamp: _utils.now(),
      data: data === undefined ? null : data,
    };
    state.activity.unshift(entry);
    if (state.activity.length > 50) {
      state.activity.length = 50;
    }
    _writeRaw(STORAGE_KEYS.activity, state.activity);
    _updateStats();
    return entry;
  }

  function _computeStats() {
    const now = _utils.now();
    const tasks = state.todos;
    const overdue = tasks.filter((item) => item.dueDate && item.dueDate < _utils.today() && !item.completed).length;
    const completed = tasks.filter((item) => item.completed).length;
    const priorities = { alta: 0, media: 0, bassa: 0 };
    tasks.forEach((item) => { if (priorities[item.priority] !== undefined) priorities[item.priority] += 1; });
    const diaryCount = state.diary.length;
    const chatCount = state.chat.length;
    const moodAverage = diaryCount === 0 ? 0 : state.diary.reduce((sum, entry) => sum + entry.mood, 0) / diaryCount;
    return {
      generatedAt: now,
      totalTodos: tasks.length,
      totalDiaryEntries: diaryCount,
      totalChatMessages: chatCount,
      overdueTodos: overdue,
      completedTodos: completed,
      priorities,
      moodAverage: Math.round(moodAverage * 100) / 100,
      recentActivity: state.activity.slice(0, 10),
    };
  }

  function _updateStats() {
    state.stats = _computeStats();
    _writeRaw(STORAGE_KEYS.stats, state.stats);
  }

  function _loadState() {
    const todos = _parseOrDefault(_readRaw(STORAGE_KEYS.todos), DEFAULTS.todos).map((item) => _normalizeTask(item, null));
    const diary = _parseOrDefault(_readRaw(STORAGE_KEYS.diary), DEFAULTS.diary).map((item) => _normalizeDiaryEntry(item, null));
    const kanban = _normalizeKanban(_parseOrDefault(_readRaw(STORAGE_KEYS.kanban), DEFAULTS.kanban));
    const chat = _parseOrDefault(_readRaw(STORAGE_KEYS.chat), DEFAULTS.chat).map((item) => _normalizeMessage(item));
    const settings = _normalizeSettings(_parseOrDefault(_readRaw(STORAGE_KEYS.settings), DEFAULTS.settings));
    const stats = _normalizeStats(_parseOrDefault(_readRaw(STORAGE_KEYS.stats), DEFAULTS.stats));
    const metaRaw = _parseOrDefault(_readRaw(STORAGE_KEYS.meta), DEFAULTS.meta);
    const meta = {
      version: typeof metaRaw.version === 'number' ? metaRaw.version : DEFAULTS.meta.version,
      createdAt: metaRaw.createdAt || _utils.now(),
      lastSync: metaRaw.lastSync || _utils.now(),
    };
    const activity = Array.isArray(_parseOrDefault(_readRaw(STORAGE_KEYS.activity), DEFAULTS.activity))
      ? _parseOrDefault(_readRaw(STORAGE_KEYS.activity), DEFAULTS.activity)
      : DEFAULTS.activity;

    state.todos = todos;
    state.diary = diary;
    state.kanban = kanban;
    state.chat = chat.slice(-settings.maxChatHistory);
    state.settings = settings;
    state.stats = Object.keys(stats).length ? stats : _computeStats();
    state.meta = meta;
    state.activity = activity.slice(0, 50);

    _writeRaw(STORAGE_KEYS.chat, state.chat);
    _writeRaw(STORAGE_KEYS.settings, state.settings);
    _writeRaw(STORAGE_KEYS.stats, state.stats);
    _writeRaw(STORAGE_KEYS.meta, state.meta);
    _writeRaw(STORAGE_KEYS.activity, state.activity);
  }

  function _findTaskIndexById(id) {
    return state.todos.findIndex((item) => item.id === id);
  }

  const TodoStore = {
    /**
     * Returns all todo tasks sorted by createdAt descending.
     * @returns {Array}
     */
    getAll() {
      return _deepClone(state.todos).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    /**
     * Returns a task by id.
     * @param {string} id
     * @returns {Object|null}
     */
    getById(id) {
      return _deepClone(state.todos.find((item) => item.id === id) || null);
    },
    /**
     * Returns incomplete tasks filtered by priority.
     * @param {'alta'|'media'|'bassa'} priority
     * @returns {Array}
     */
    getByPriority(priority) {
      if (!_validators.priority(priority)) {
        return [];
      }
      return _deepClone(state.todos.filter((item) => item.priority === priority && !item.completed));
    },
    /**
     * Returns overdue tasks.
     * @returns {Array}
     */
    getOverdue() {
      const today = _utils.today();
      return _deepClone(state.todos.filter((item) => item.dueDate && item.dueDate < today && !item.completed));
    },
    /**
     * Creates a new todo task.
     * @param {Object} task
     * @returns {Object}
     */
    create(task) {
      const normalized = _normalizeTask(task);
      normalized.position = state.todos.length;
      state.todos.push(normalized);
      _saveState('todos', state.todos);
      _logActivity('todo', 'Task created', { id: normalized.id });
      _updateMeta();
      _updateStats();
      return _deepClone(normalized);
    },
    /**
     * Updates an existing todo task.
     * @param {string} id
     * @param {Object} updates
     * @returns {Object}
     */
    update(id, updates) {
      const index = _findTaskIndexById(id);
      if (index === -1) {
        throw Object.assign(new Error('NotFoundError: Task not found'), { name: 'NotFoundError' });
      }
      const updated = _normalizeTask({ ...state.todos[index], ...updates }, state.todos[index]);
      state.todos[index] = updated;
      _saveState('todos', state.todos);
      _logActivity('todo', 'Task updated', { id });
      _updateMeta();
      _updateStats();
      return _deepClone(updated);
    },
    /**
     * Removes a todo task.
     * @param {string} id
     * @returns {boolean}
     */
    remove(id) {
      const index = _findTaskIndexById(id);
      if (index === -1) {
        return false;
      }
      state.todos.splice(index, 1);
      _saveState('todos', state.todos);
      _logActivity('todo', 'Task removed', { id });
      _updateMeta();
      _updateStats();
      return true;
    },
  };

  const DiaryStore = {
    /**
     * Returns all diary entries sorted by date descending.
     * @returns {Array}
     */
    getAll() {
      return _deepClone(state.diary).sort((a, b) => b.date.localeCompare(a.date));
    },
    /**
     * Returns a diary entry by date.
     * @param {string} date
     * @returns {Object|null}
     */
    getByDate(date) {
      if (!_validators.date(date)) {
        return null;
      }
      return _deepClone(state.diary.find((entry) => entry.date === date) || null);
    },
    /**
     * Saves or updates a diary entry by date.
     * @param {Object} entry
     * @returns {Object}
     */
    save(entry) {
      const existing = state.diary.find((item) => item.date === _safeString(entry.date));
      const normalized = _normalizeDiaryEntry(entry, existing || null);
      if (existing) {
        const index = state.diary.findIndex((item) => item.id === existing.id);
        state.diary[index] = normalized;
        _logActivity('diary', 'Diary updated', { date: normalized.date, id: normalized.id });
      } else {
        state.diary.push(normalized);
        _logActivity('diary', 'Diary created', { date: normalized.date, id: normalized.id });
      }
      _saveState('diary', state.diary);
      _updateMeta();
      _updateStats();
      return _deepClone(normalized);
    },
    /**
     * Deletes a diary entry by date.
     * @param {string} date
     * @returns {boolean}
     */
    removeByDate(date) {
      const index = state.diary.findIndex((item) => item.date === date);
      if (index === -1) {
        return false;
      }
      const [removed] = state.diary.splice(index, 1);
      _saveState('diary', state.diary);
      _logActivity('diary', 'Diary removed', { date: removed.date, id: removed.id });
      _updateMeta();
      _updateStats();
      return true;
    },
  };

  const KanbanStore = {
    /**
     * Returns the kanban board.
     * @returns {Object}
     */
    getAll() {
      return _deepClone(state.kanban);
    },
    /**
     * Returns tasks in a specific kanban column.
     * @param {'todo'|'inprogress'|'done'} column
     * @returns {Array}
     */
    getByColumn(column) {
      if (!_validators.column(column)) {
        return [];
      }
      return _deepClone((state.kanban[column] || []).sort((a, b) => a.position - b.position));
    },
    /**
     * Adds a task to kanban.
     * @param {Object} task
     * @param {'todo'|'inprogress'|'done'} [column]
     * @returns {Object}
     */
    add(task, column = 'todo') {
      const normalized = _normalizeTask({ ...task, column });
      const list = state.kanban[column] || [];
      normalized.position = list.length;
      state.kanban[column] = [...list, normalized];
      _saveState('kanban', state.kanban);
      _logActivity('kanban', 'Kanban task added', { id: normalized.id, column });
      _updateMeta();
      _updateStats();
      return _deepClone(normalized);
    },
    /**
     * Moves a task from one column to another.
     * @param {string} id
     * @param {'todo'|'inprogress'|'done'} toColumn
     * @param {number} [position]
     * @returns {Object}
     */
    move(id, toColumn, position = null) {
      if (!_validators.column(toColumn)) {
        throw Object.assign(new Error('InvalidColumnError: Invalid kanban column'), { name: 'InvalidColumnError' });
      }
      const fromColumn = ['todo', 'inprogress', 'done'].find((col) => state.kanban[col].some((item) => item.id === id));
      if (!fromColumn) {
        throw Object.assign(new Error('NotFoundError: Kanban task not found'), { name: 'NotFoundError' });
      }
      const taskIndex = state.kanban[fromColumn].findIndex((item) => item.id === id);
      const [task] = state.kanban[fromColumn].splice(taskIndex, 1);
      if (!task) {
        throw Object.assign(new Error('NotFoundError: Kanban task not found'), { name: 'NotFoundError' });
      }
      task.column = toColumn;
      task.position = Number.isInteger(position) && position >= 0 ? position : state.kanban[toColumn].length;
      task.updatedAt = _utils.now();
      const target = state.kanban[toColumn] || [];
      target.splice(task.position, 0, task);
      state.kanban[toColumn] = target.map((item, idx) => ({ ...item, position: idx }));
      state.kanban[fromColumn] = state.kanban[fromColumn].map((item, idx) => ({ ...item, position: idx }));
      _saveState('kanban', state.kanban);
      _logActivity('kanban', 'Kanban task moved', { id, from: fromColumn, to: toColumn });
      _updateMeta();
      _updateStats();
      return _deepClone(task);
    },
    /**
     * Updates a kanban task in place.
     * @param {string} id
     * @param {Object} updates
     * @returns {Object}
     */
    update(id, updates) {
      const column = ['todo', 'inprogress', 'done'].find((col) => state.kanban[col].some((item) => item.id === id));
      if (!column) {
        throw Object.assign(new Error('NotFoundError: Kanban task not found'), { name: 'NotFoundError' });
      }
      const index = state.kanban[column].findIndex((item) => item.id === id);
      const item = state.kanban[column][index];
      const normalized = _normalizeTask({ ...item, ...updates }, item);
      if (updates.column && updates.column !== column) {
        return this.move(id, updates.column, normalized.position);
      }
      state.kanban[column][index] = normalized;
      state.kanban[column] = state.kanban[column].map((task, idx) => ({ ...task, position: idx }));
      _saveState('kanban', state.kanban);
      _logActivity('kanban', 'Kanban task updated', { id });
      _updateMeta();
      _updateStats();
      return _deepClone(normalized);
    },
    /**
     * Removes a task from kanban.
     * @param {string} id
     * @returns {boolean}
     */
    remove(id) {
      const column = ['todo', 'inprogress', 'done'].find((col) => state.kanban[col].some((item) => item.id === id));
      if (!column) {
        return false;
      }
      const index = state.kanban[column].findIndex((item) => item.id === id);
      state.kanban[column].splice(index, 1);
      state.kanban[column] = state.kanban[column].map((task, idx) => ({ ...task, position: idx }));
      _saveState('kanban', state.kanban);
      _logActivity('kanban', 'Kanban task removed', { id, column });
      _updateMeta();
      _updateStats();
      return true;
    },
  };

  const ChatStore = {
    /**
     * Returns all chat messages.
     * @returns {Array}
     */
    getAll() {
      return _deepClone(state.chat);
    },
    /**
     * Adds a chat message and keeps history within maxChatHistory.
     * @param {Object} message
     * @returns {Object}
     */
    add(message) {
      const normalized = _normalizeMessage(message);
      state.chat.push(normalized);
      const max = Number.isInteger(state.settings.maxChatHistory) ? state.settings.maxChatHistory : DEFAULTS.settings.maxChatHistory;
      if (state.chat.length > max) {
        state.chat.splice(0, state.chat.length - max);
      }
      _saveState('chat', state.chat);
      _logActivity('chat', 'Chat message added', { id: normalized.id, role: normalized.role });
      _updateMeta();
      _updateStats();
      return _deepClone(normalized);
    },
    /**
     * Clears the chat history.
     * @returns {void}
     */
    clear() {
      state.chat = [];
      _saveState('chat', state.chat);
      _logActivity('chat', 'Chat cleared');
      _updateMeta();
      _updateStats();
    },
  };

  const SettingsStore = {
    /**
     * Returns current settings.
     * @returns {Object}
     */
    get() {
      return _deepClone(state.settings);
    },
    /**
     * Sets settings, replacing current values.
     * @param {Object} settings
     * @returns {Object}
     */
    set(settings) {
      const normalized = _normalizeSettings({ ...state.settings, ...settings, createdAt: state.settings.createdAt });
      normalized.createdAt = state.settings.createdAt || normalized.createdAt;
      state.settings = normalized;
      _saveState('settings', state.settings);
      _logActivity('settings', 'Settings updated', { keys: Object.keys(settings) });
      _updateMeta();
      return _deepClone(state.settings);
    },
    /**
     * Resets settings to defaults.
     * @returns {Object}
     */
    reset() {
      const now = _utils.now();
      state.settings = _normalizeSettings({ ...DEFAULTS.settings, createdAt: now, updatedAt: now });
      _saveState('settings', state.settings);
      _logActivity('settings', 'Settings reset');
      _updateMeta();
      return _deepClone(state.settings);
    },
  };

  const StatsEngine = {
    /**
     * Returns dashboard stats including recent activity.
     * @returns {Object}
     */
    getDashboard() {
      return _deepClone(_computeStats());
    },
    /**
     * Returns raw stats cache.
     * @returns {Object}
     */
    getRaw() {
      return _deepClone(state.stats);
    },
    /**
     * Returns recent activity entries.
     * @returns {Array}
     */
    getActivityLog() {
      return _deepClone(state.activity);
    },
    /**
     * Clears activity logs.
     * @returns {void}
     */
    clearActivity() {
      state.activity = [];
      _saveState('activity', state.activity);
      _updateStats();
      _updateMeta();
    },
  };

  function _validateImportObject(data) {
    const errors = [];
    if (!data || typeof data !== 'object') {
      errors.push('Import payload must be an object');
      return { valid: false, errors };
    }
    const expectedKeys = Object.values(STORAGE_KEYS);
    expectedKeys.forEach((key) => {
      if (!(key in data)) {
        errors.push(`Missing key: ${key}`);
      }
    });
    if (errors.length) {
      return { valid: false, errors };
    }
    try {
      data[STORAGE_KEYS.todos].forEach((item) => _normalizeTask(item, null));
    } catch (error) {
      errors.push(error.message);
    }
    try {
      data[STORAGE_KEYS.diary].forEach((item) => _normalizeDiaryEntry(item, null));
    } catch (error) {
      errors.push(error.message);
    }
    try {
      _normalizeKanban(data[STORAGE_KEYS.kanban]);
    } catch (error) {
      errors.push(error.message);
    }
    try {
      data[STORAGE_KEYS.chat].forEach((item) => _normalizeMessage(item));
    } catch (error) {
      errors.push(error.message);
    }
    try {
      _normalizeSettings(data[STORAGE_KEYS.settings]);
    } catch (error) {
      errors.push(error.message);
    }
    if (errors.length) {
      return { valid: false, errors };
    }
    return { valid: true, errors };
  }

  function _importData(parsed) {
    state.todos = parsed[STORAGE_KEYS.todos].map((item) => _normalizeTask(item, null));
    state.diary = parsed[STORAGE_KEYS.diary].map((item) => _normalizeDiaryEntry(item, null));
    state.kanban = _normalizeKanban(parsed[STORAGE_KEYS.kanban]);
    state.chat = parsed[STORAGE_KEYS.chat].map((item) => _normalizeMessage(item));
    state.settings = _normalizeSettings(parsed[STORAGE_KEYS.settings]);
    state.stats = _normalizeStats(parsed[STORAGE_KEYS.stats]);
    const meta = parsed[STORAGE_KEYS.meta] || {};
    state.meta = {
      version: typeof meta.version === 'number' ? meta.version : DEFAULTS.meta.version,
      createdAt: meta.createdAt || _utils.now(),
      lastSync: _utils.now(),
    };
    state.activity = Array.isArray(parsed[STORAGE_KEYS.activity]) ? parsed[STORAGE_KEYS.activity].slice(0, 50) : [];
    _persistAll();
    _updateStats();
    _updateMeta();
  }

  const state = {
    todos: [],
    diary: [],
    kanban: _deepClone(DEFAULTS.kanban),
    chat: [],
    settings: _deepClone(DEFAULTS.settings),
    stats: {},
    meta: _deepClone(DEFAULTS.meta),
    activity: [],
  };

  const ALMA_DB = {
    _utils,
    todos: TodoStore,
    diary: DiaryStore,
    kanban: KanbanStore,
    chat: ChatStore,
    settings: SettingsStore,
    stats: StatsEngine,
    /**
     * Exports all JARVIS data as a JSON string.
     * @returns {string}
     */
    export() {
      const payload = {
        [STORAGE_KEYS.todos]: state.todos,
        [STORAGE_KEYS.diary]: state.diary,
        [STORAGE_KEYS.kanban]: state.kanban,
        [STORAGE_KEYS.chat]: state.chat,
        [STORAGE_KEYS.settings]: state.settings,
        [STORAGE_KEYS.stats]: state.stats,
        [STORAGE_KEYS.meta]: state.meta,
        [STORAGE_KEYS.activity]: state.activity,
      };
      return JSON.stringify(payload, null, 2);
    },
    /**
     * Imports and restores all JARVIS data from a JSON string.
     * @param {string} jsonString
     * @returns {{success:boolean,errors:string[]}}
     */
    import(jsonString) {
      let parsed;
      const errors = [];
      try {
        parsed = JSON.parse(jsonString);
      } catch (error) {
        return { success: false, errors: ['Invalid JSON payload'] };
      }
      const validation = _validateImportObject(parsed);
      if (!validation.valid) {
        return { success: false, errors: validation.errors };
      }
      _importData(parsed);
      try {
        window.dispatchEvent(new CustomEvent('alma:import:complete', { detail: { success: true } }));
      } catch (error) {
        console.warn('ALMA_DB event dispatch failed', error);
      }
      return { success: true, errors: [] };
    },
    /**
     * Clears all JARVIS keys from localStorage and resets runtime state.
     * @returns {void}
     */
    reset() {
      Object.values(STORAGE_KEYS).forEach((key) => _removeRaw(key));
      state.todos = [];
      state.diary = [];
      state.kanban = _deepClone(DEFAULTS.kanban);
      state.chat = [];
      state.settings = _normalizeSettings(DEFAULTS.settings);
      state.stats = _computeStats();
      state.meta = { version: DEFAULTS.meta.version, createdAt: _utils.now(), lastSync: _utils.now() };
      state.activity = [];
      _persistAll();
    },
    /**
     * Initializes the ALMA_DB state from storage.
     * @returns {void}
     */
    init() {
      _checkStorageAvailability();
      _loadState();
      _updateMeta();
      _updateStats();
    },
  };

  Object.defineProperty(window, 'ALMA_DB', {
    configurable: false,
    enumerable: true,
    writable: false,
    value: ALMA_DB,
  });

  try {
    ALMA_DB.init();
  } catch (error) {
    console.error('ALMA_DB initialization failed', error);
  }
}());


