export const BACKUP_VERSION = 1;

export const BACKUP_KEYS = [
  'jarvis_todo_v1',
  'jarvis_diary_v1',
  'jarvis_dashboard_v1',
  'jarvis_v2',
  'alma_chat_sessions_v2',
  'vyctor_chat_sessions_v2',
  'alfred_chat_sessions_v1',
  'capital_chat_sessions_v1',
];

export const SENSITIVE_KEYS = [
  'alma_key',
  'jarvis_key',
  'openai_api_key',
  'OPENAI_API_KEY',
  'VITE_OPENAI_API_KEY',
  'anthropic_api_key',
  'ANTHROPIC_API_KEY',
];

function safeParse(value) {
  if (value == null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function timestampForFilename(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function createBackupPayload(storage = window.localStorage) {
  const data = {};

  for (const key of BACKUP_KEYS) {
    data[key] = safeParse(storage.getItem(key));
  }

  return {
    version: BACKUP_VERSION,
    exported_at: new Date().toISOString(),
    excluded_keys: SENSITIVE_KEYS,
    data,
  };
}

export function downloadBackupFile(payload = createBackupPayload()) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `jarvis-backup-${timestampForFilename()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function validateBackupPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('File backup non valido: JSON principale mancante.');
  }

  if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
    throw new Error('File backup non valido: campo "data" mancante.');
  }

  // Restituisce solo le chiavi presenti nel file di backup.
  // Le chiavi assenti (es. backup pre-Capital) vengono saltate invece di bloccare l'import.
  return BACKUP_KEYS.filter((key) =>
    Object.prototype.hasOwnProperty.call(payload.data, key),
  );
}

export function restoreBackupPayload(payload, storage = window.localStorage) {
  const keysToRestore = validateBackupPayload(payload);

  for (const key of keysToRestore) {
    const value = payload.data[key];

    if (value == null) {
      storage.removeItem(key);
    } else if (typeof value === 'string') {
      storage.setItem(key, value);
    } else {
      storage.setItem(key, JSON.stringify(value));
    }
  }

  for (const key of SENSITIVE_KEYS) {
    if (Object.prototype.hasOwnProperty.call(payload.data, key)) {
      storage.removeItem(key);
    }
  }

  return keysToRestore;
}
