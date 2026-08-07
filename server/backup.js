const fs = require('fs');
const os = require('os');
const path = require('path');

const BACKUP_KEYS = [
  'jarvis_todos',
  'jarvis_diary',
  'jarvis_tasks',
  'alma_conversations',
];
const SENSITIVE_KEYS = ['alma_key'];
const BACKUP_DIR = path.join(os.homedir(), 'ALMA-backup');
const ARCHIVE_DIR = path.join(BACKUP_DIR, 'archive');
const BACKUP_FILE = path.join(BACKUP_DIR, 'alma-data.json');
const MAX_ARCHIVES = 10;

function ensureBackupDirs() {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

function timestampForFile() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function sanitizeBackupPayload(payload = {}) {
  const data = {};
  for (const key of BACKUP_KEYS) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) data[key] = payload[key];
  }
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    excludedKeys: SENSITIVE_KEYS,
    data,
  };
}

function pruneArchive() {
  const archives = fs.readdirSync(ARCHIVE_DIR)
    .filter((name) => /^alma-data\.backup-.+\.json$/.test(name))
    .map((name) => {
      const filePath = path.join(ARCHIVE_DIR, name);
      return { name, filePath, mtimeMs: fs.statSync(filePath).mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  for (const archive of archives.slice(MAX_ARCHIVES)) {
    fs.unlinkSync(archive.filePath);
  }
}

function writeBackup(payload) {
  ensureBackupDirs();

  if (fs.existsSync(BACKUP_FILE)) {
    const archivePath = path.join(ARCHIVE_DIR, `alma-data.backup-${timestampForFile()}.json`);
    fs.copyFileSync(BACKUP_FILE, archivePath);
  }

  const backup = sanitizeBackupPayload(payload);
  const tmpPath = path.join(BACKUP_DIR, `alma-data.${process.pid}.${Date.now()}.tmp`);
  fs.writeFileSync(tmpPath, JSON.stringify(backup, null, 2), 'utf8');
  fs.renameSync(tmpPath, BACKUP_FILE);
  pruneArchive();

  return {
    ok: true,
    path: BACKUP_FILE,
    savedAt: backup.savedAt,
    excludedKeys: backup.excludedKeys,
  };
}

function readBackup() {
  if (!fs.existsSync(BACKUP_FILE)) {
    return { exists: false, path: BACKUP_FILE, data: null };
  }

  const parsed = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
  return {
    exists: true,
    path: BACKUP_FILE,
    savedAt: parsed.savedAt || null,
    excludedKeys: parsed.excludedKeys || SENSITIVE_KEYS,
    data: parsed.data || {},
  };
}

module.exports = {
  BACKUP_FILE,
  BACKUP_KEYS,
  readBackup,
  writeBackup,
};
