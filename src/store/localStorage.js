const KEYS = {
  TODO:      'jarvis_todo_v1',
  DIARY:     'jarvis_diary_v1',
  DASHBOARD: 'jarvis_dashboard_v1',
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── TODO ──────────────────────────────────────────────────────────────────────

export function loadTodos() {
  return load(KEYS.TODO, []);
}

export function saveTodos(todos) {
  save(KEYS.TODO, todos);
}

// ─── DIARY ─────────────────────────────────────────────────────────────────────

export function loadDiaryEntries() {
  return load(KEYS.DIARY, []);
}

export function saveDiaryEntries(entries) {
  save(KEYS.DIARY, entries);
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────

const DEFAULT_DASHBOARD = {
  haiGia: [
    { id: 1, text: 'Sito portfolio personale', checked: true },
    { id: 2, text: 'JARVIS AI Assistant',       checked: true },
    { id: 3, text: 'ALMA Mind App',             checked: true },
  ],
  staiFacendo: [
    { id: 1, text: 'Dashboard personale',         checked: false },
    { id: 2, text: 'Acquisizione nuovi clienti',  checked: false },
    { id: 3, text: 'Ottimizzazione UI/UX',        checked: false },
  ],
  priorita: [
    { id: 1, title: 'Completare la dashboard',   desc: 'Aggiungere tutte le sezioni previste e testare tutto' },
    { id: 2, title: 'Acquisire nuovi clienti',   desc: 'Portfolio aggiornato, contatti attivi e prezzi definiti' },
    { id: 3, title: 'Migliorare le competenze',  desc: 'React avanzato, Three.js, integrazioni AI' },
  ],
  competenze: [
    { id: 1, name: 'React / Frontend', pct: 85 },
    { id: 2, name: 'Node.js / Backend', pct: 75 },
    { id: 3, name: 'AI Integration',   pct: 70 },
    { id: 4, name: 'UI/UX Design',     pct: 65 },
  ],
  statoSito: [
    { id: 1, label: 'Hero Section',     done: true  },
    { id: 2, label: 'Portfolio',        done: true  },
    { id: 3, label: 'About Me',         done: false },
    { id: 4, label: 'Servizi & Prezzi', done: false },
    { id: 5, label: 'Contatti',         done: false },
    { id: 6, label: 'Blog / Case Study',done: false },
  ],
  servizi: [
    { id: 1, name: 'Sito Vetrina',    price: '500€'       },
    { id: 2, name: 'Web App Custom',  price: '1.500€'     },
    { id: 3, name: 'AI Integration',  price: '800€'       },
    { id: 4, name: 'Manutenzione',    price: '150€/mese'  },
  ],
};

export function loadDashboard() {
  return load(KEYS.DASHBOARD, DEFAULT_DASHBOARD);
}

export function saveDashboard(data) {
  save(KEYS.DASHBOARD, data);
}

export { DEFAULT_DASHBOARD };
