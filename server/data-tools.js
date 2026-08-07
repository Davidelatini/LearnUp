const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const SCOPES = ['alfred', 'alma', 'vyctor', 'capital'];
const DEFAULT_DATA = { tasks: [], notes: [], events: [] };

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function assertScope(scope) {
  const normalized = String(scope || '').trim().toLowerCase();
  if (!SCOPES.includes(normalized)) {
    throw new Error(`Ambito non valido: ${scope}. Usa alfred, alma, vyctor o capital.`);
  }
  return normalized;
}

function getScopePath(scope) {
  return path.join(DATA_DIR, `${assertScope(scope)}.json`);
}

function readScope(scope) {
  ensureDataDir();
  const filePath = getScopePath(scope);
  if (!fs.existsSync(filePath)) {
    const base = { tasks: [], notes: [], events: [] };
    if (scope === 'capital') {
      base.config = { stipendio: null, uscite: null, spese_fisse: [] };
      base.spese_variabili = [];
    }
    return base;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const result = {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
    };
    if (scope === 'capital') {
      result.config = parsed.config || { stipendio: null, uscite: null, spese_fisse: [] };
      if (!Object.prototype.hasOwnProperty.call(result.config, 'uscite')) result.config.uscite = null;
      if (!Array.isArray(result.config.spese_fisse)) result.config.spese_fisse = [];
      result.spese_variabili = Array.isArray(parsed.spese_variabili) ? parsed.spese_variabili : [];
    }
    return result;
  } catch {
    const base = { tasks: [], notes: [], events: [] };
    if (scope === 'capital') {
      base.config = { stipendio: null, uscite: null, spese_fisse: [] };
      base.spese_variabili = [];
    }
    return base;
  }
}

function writeScope(scope, data) {
  ensureDataDir();
  const filePath = getScopePath(scope);
  const tmpPath = path.join(DATA_DIR, `${assertScope(scope)}.${process.pid}.${Date.now()}.tmp`);
  const payload = {
    tasks: Array.isArray(data.tasks) ? data.tasks : [],
    notes: Array.isArray(data.notes) ? data.notes : [],
    events: Array.isArray(data.events) ? data.events : [],
  };
  if (scope === 'capital') {
    payload.config = data.config || { stipendio: null, uscite: null, spese_fisse: [] };
    if (!Array.isArray(payload.config.spese_fisse)) payload.config.spese_fisse = [];
    payload.spese_variabili = Array.isArray(data.spese_variabili) ? data.spese_variabili : [];
  }

  fs.writeFileSync(tmpPath, JSON.stringify(payload, null, 2), 'utf8');
  fs.renameSync(tmpPath, filePath);
  return payload;
}

function resolveScope(args = {}, defaultScope = 'alma') {
  return assertScope(args.ambito || args.scope || defaultScope);
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readAllData() {
  return SCOPES.reduce((acc, scope) => {
    acc[scope] = readScope(scope);
    return acc;
  }, {});
}

function addTask(scope, args = {}, source = 'tool_call') {
  const data = readScope(scope);
  const text = String(args.testo || args.text || args.titolo || '').trim();
  if (!text) throw new Error('testo della task mancante.');

  const task = {
    id: makeId('task'),
    text,
    category: String(args.categoria || args.category || '').trim() || 'Generale',
    dueDate: String(args.scadenza || args.dueDate || '').trim() || null,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    source,
  };

  data.tasks.unshift(task);
  writeScope(scope, data);
  return task;
}

function completeTask(scope, args = {}) {
  const data = readScope(scope);
  const id = String(args.id || '').trim();
  const text = String(args.testo || args.text || '').trim().toLowerCase();
  const task = data.tasks.find((item) =>
    (id && item.id === id) || (text && String(item.text || '').toLowerCase().includes(text))
  );

  if (!task) throw new Error('Task non trovata.');
  task.completed = true;
  task.completedAt = new Date().toISOString();
  writeScope(scope, data);
  return task;
}

function addNote(scope, args = {}, source = 'tool_call') {
  const data = readScope(scope);
  const content = String(args.contenuto || args.content || args.descrizione || '').trim();
  if (!content) throw new Error('contenuto della nota mancante.');
  const emotion = String(args.emozione || args.emotion || args.mood || '').trim();

  const note = {
    id: makeId('note'),
    title: String(args.titolo || args.title || '').trim(),
    content,
    category: String(args.categoria || args.category || '').trim() || 'Nota',
    emotion: emotion || null,
    createdAt: new Date().toISOString(),
    source,
  };

  data.notes.unshift(note);
  writeScope(scope, data);
  return note;
}

function addEvent(scope, args = {}, source = 'ui') {
  const data = readScope(scope);
  const title = String(args.titolo || args.title || '').trim();
  const date = String(args.data || args.date || args.scadenza || '').trim();
  if (!title) throw new Error('titolo evento mancante.');
  if (!date) throw new Error('data evento mancante.');

  const event = {
    id: makeId('event'),
    title,
    description: String(args.descrizione || args.description || args.contenuto || '').trim(),
    date,
    createdAt: new Date().toISOString(),
    source,
  };

  data.events.unshift(event);
  writeScope(scope, data);
  return event;
}

// ─────────────────────────────────────────────────────────────────────────────
// CAPITAL — financial functions
// ─────────────────────────────────────────────────────────────────────────────

function currentMese() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function impostaStipendio(args = {}) {
  const importo = parseFloat(args.importo);
  if (isNaN(importo) || importo < 0) throw new Error('Importo stipendio non valido.');
  const data = readScope('capital');
  data.config.stipendio = importo;
  writeScope('capital', data);
  return { stipendio: importo };
}

function impostaUscite(args = {}) {
  const importo = parseFloat(args.importo);
  if (isNaN(importo) || importo < 0) throw new Error('Importo uscite non valido.');
  const data = readScope('capital');
  data.config.uscite = importo;
  writeScope('capital', data);
  return { uscite: importo };
}

function aggiungiSpesaFissa(args = {}) {
  const nome = String(args.nome || '').trim();
  const importo = parseFloat(args.importo);
  if (!nome) throw new Error('Nome spesa fissa mancante.');
  if (isNaN(importo) || importo < 0) throw new Error('Importo spesa fissa non valido.');
  const data = readScope('capital');
  const spesa = {
    id: makeId('sf'),
    nome,
    importo,
    attiva: true,
    createdAt: new Date().toISOString(),
  };
  data.config.spese_fisse.push(spesa);
  writeScope('capital', data);
  return { spesa };
}

function rimuoviSpesaFissa(args = {}) {
  const id = String(args.id || '').trim();
  if (!id) throw new Error('ID spesa fissa mancante.');
  const data = readScope('capital');
  const spesa = data.config.spese_fisse.find((s) => s.id === id);
  if (!spesa) throw new Error('Spesa fissa non trovata.');
  spesa.attiva = false;
  writeScope('capital', data);
  return { disattivata: true, id };
}

function attivaSpesaFissa(args = {}) {
  const id = String(args.id || '').trim();
  if (!id) throw new Error('ID spesa fissa mancante.');
  const data = readScope('capital');
  const spesa = data.config.spese_fisse.find((s) => s.id === id);
  if (!spesa) throw new Error('Spesa fissa non trovata.');
  spesa.attiva = true;
  writeScope('capital', data);
  return { attivata: true, id };
}

function aggiungiSpesaVariabile(args = {}) {
  const descrizione = String(args.descrizione || '').trim();
  const importo = parseFloat(args.importo);
  if (!descrizione) throw new Error('Descrizione spesa variabile mancante.');
  if (isNaN(importo) || importo < 0) throw new Error('Importo non valido.');
  const mese = String(args.mese || args.data || '').slice(0, 7) || currentMese();
  const data = readScope('capital');
  const spesa = {
    id: makeId('sv'),
    descrizione,
    importo,
    data: args.data || new Date().toISOString().slice(0, 10),
    pagata: false,
    mese,
    createdAt: new Date().toISOString(),
  };
  data.spese_variabili.unshift(spesa);
  writeScope('capital', data);
  return { spesa };
}

function segnaPagata(args = {}) {
  const id = String(args.id || '').trim();
  if (!id) throw new Error('ID spesa variabile mancante.');
  const data = readScope('capital');
  const spesa = data.spese_variabili.find((s) => s.id === id);
  if (!spesa) throw new Error('Spesa variabile non trovata.');
  spesa.pagata = true;
  writeScope('capital', data);
  return { spesa };
}

function getBilancio() {
  const data = readScope('capital');
  const { config } = data;
  const stipendio = config.stipendio ?? null;
  const uscite = config.uscite ?? null;
  const risparmio = stipendio != null && uscite != null ? stipendio - uscite : null;
  return {
    stipendio,
    uscite,
    risparmio,
    risparmio_negativo: risparmio != null && risparmio < 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool schemas
// ─────────────────────────────────────────────────────────────────────────────

const dataToolSchemas = [
  {
    type: 'function',
    function: {
      name: 'aggiungi_task',
      description: 'Salva una nuova task strutturata nel file JSON del bot. Usa l ambito del bot se non specificato.',
      parameters: {
        type: 'object',
        properties: {
          ambito: { type: 'string', enum: SCOPES, description: 'Ambito dati: alfred, alma, vyctor o capital. Opzionale.' },
          testo: { type: 'string', description: 'Testo della task da salvare.' },
          categoria: { type: 'string', description: 'Categoria o area della task, es. Finanza, Obiettivi, Mood, Organizzazione.' },
          scadenza: { type: 'string', description: 'Scadenza opzionale in formato libero o ISO.' },
        },
        required: ['testo'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'completa_task',
      description: 'Marca come completata una task salvata nel file JSON del bot.',
      parameters: {
        type: 'object',
        properties: {
          ambito: { type: 'string', enum: SCOPES, description: 'Ambito dati: alfred, alma, vyctor o capital. Opzionale.' },
          id: { type: 'string', description: 'ID esatto della task da completare.' },
          testo: { type: 'string', description: 'In alternativa all ID, testo o parte del testo della task da completare.' },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'salva_nota',
      description: 'Salva una nota strutturata nel file JSON del bot.',
      parameters: {
        type: 'object',
        properties: {
          ambito: { type: 'string', enum: SCOPES, description: 'Ambito dati: alfred, alma, vyctor o capital. Opzionale.' },
          titolo: { type: 'string', description: 'Titolo opzionale della nota.' },
          contenuto: { type: 'string', description: 'Contenuto della nota da salvare.' },
          categoria: { type: 'string', description: 'Categoria o tag della nota, es. Finanza, Riflessione, Mood.' },
          emozione: { type: 'string', description: 'Tag emotivo opzionale, es. sereno, stressato, triste, positivo, neutro.' },
        },
        required: ['contenuto'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'leggi_dati',
      description: 'Legge i dati salvati. Se ambito e vuoto o assente ritorna alfred, alma e vyctor; altrimenti solo l ambito richiesto.',
      parameters: {
        type: 'object',
        properties: {
          ambito: { type: 'string', enum: ['', ...SCOPES], description: 'Ambito opzionale da leggere: alfred, alma, vyctor, capital.' },
        },
        additionalProperties: false,
      },
    },
  },
];

const capitalToolSchemas = [
  {
    type: 'function',
    function: {
      name: 'imposta_stipendio',
      description: 'Salva lo stipendio mensile netto nella configurazione di Capital.',
      parameters: {
        type: 'object',
        properties: {
          importo: { type: 'number', description: 'Importo dello stipendio mensile netto in euro.' },
        },
        required: ['importo'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'imposta_uscite',
      description: 'Salva il totale generale delle uscite mensili usato per calcolare quanto viene messo da parte.',
      parameters: {
        type: 'object',
        properties: {
          importo: { type: 'number', description: 'Totale delle uscite mensili in euro.' },
        },
        required: ['importo'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'aggiungi_spesa_fissa',
      description: 'Aggiunge una spesa fissa mensile ricorrente alla configurazione (es. affitto, abbonamenti, bollette).',
      parameters: {
        type: 'object',
        properties: {
          nome: { type: 'string', description: 'Nome della spesa fissa (es. "Affitto", "Netflix", "Palestra").' },
          importo: { type: 'number', description: 'Importo mensile della spesa in euro.' },
        },
        required: ['nome', 'importo'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'rimuovi_spesa_fissa',
      description: 'Disattiva una spesa fissa dalla configurazione (non viene eliminata, solo disabilitata).',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID della spesa fissa da disattivare.' },
        },
        required: ['id'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'aggiungi_spesa_variabile',
      description: 'Registra una spesa variabile del mese corrente (acquisto, servizio, spesa una tantum).',
      parameters: {
        type: 'object',
        properties: {
          descrizione: { type: 'string', description: 'Descrizione della spesa (es. "Supermercato", "Benzina", "Ristorante").' },
          importo: { type: 'number', description: 'Importo della spesa in euro.' },
          data: { type: 'string', description: 'Data della spesa in formato YYYY-MM-DD. Default: oggi.' },
        },
        required: ['descrizione', 'importo'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'segna_pagata',
      description: 'Marca una spesa variabile come pagata/saldata.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID della spesa variabile da marcare come pagata.' },
        },
        required: ['id'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_bilancio',
      description: 'Calcola quanto viene messo da parte: stipendio mensile meno uscite mensili, senza suddivisioni per mese.',
      parameters: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
    },
  },
];

const dataToolNames = new Set(dataToolSchemas.map((tool) => tool.function.name));
const capitalToolNames = new Set(capitalToolSchemas.map((tool) => tool.function.name));

function isDataTool(toolName) {
  return dataToolNames.has(toolName) || capitalToolNames.has(toolName);
}

async function executeDataTool(toolName, args = {}, defaultScope = 'alma') {
  // Capital-specific financial tools (always operate on 'capital' scope)
  if (capitalToolNames.has(toolName)) {
    if (toolName === 'imposta_stipendio')      return impostaStipendio(args);
    if (toolName === 'imposta_uscite')         return impostaUscite(args);
    if (toolName === 'aggiungi_spesa_fissa')   return aggiungiSpesaFissa(args);
    if (toolName === 'rimuovi_spesa_fissa')    return rimuoviSpesaFissa(args);
    if (toolName === 'aggiungi_spesa_variabile') return aggiungiSpesaVariabile(args);
    if (toolName === 'segna_pagata')           return segnaPagata(args);
    if (toolName === 'get_bilancio')           return getBilancio();
    throw new Error(`Tool capital sconosciuto: ${toolName}`);
  }

  if (toolName === 'leggi_dati') {
    const requested = String(args.ambito || args.scope || '').trim().toLowerCase();
    return requested ? { ambito: assertScope(requested), data: readScope(requested) } : readAllData();
  }

  const scope = resolveScope(args, defaultScope);

  if (toolName === 'aggiungi_task') {
    const task = addTask(scope, args, 'tool_call');
    return { ambito: scope, task };
  }

  if (toolName === 'completa_task') {
    const task = completeTask(scope, args);
    return { ambito: scope, task };
  }

  if (toolName === 'salva_nota') {
    const note = addNote(scope, args, 'tool_call');
    return { ambito: scope, note };
  }

  throw new Error(`Tool dati sconosciuto: ${toolName}`);
}

module.exports = {
  DATA_DIR,
  SCOPES,
  addEvent,
  addNote,
  addTask,
  attivaSpesaFissa,
  capitalToolSchemas,
  completeTask,
  dataToolSchemas,
  executeDataTool,
  getBilancio,
  isDataTool,
  readAllData,
  readScope,
};
