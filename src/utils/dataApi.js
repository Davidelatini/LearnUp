const SERVER = 'http://localhost:3001';

export async function fetchBotData(scope = '') {
  const query = scope ? `?ambito=${encodeURIComponent(scope)}` : '';
  const response = await fetch(`${SERVER}/data${query}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Backend DATA ${response.status}`);
  return payload.data || {};
}

export async function runDataTool(tool, args = {}) {
  const response = await fetch(`${SERVER}/alma/direct-tool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, args, confirmed: true }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Backend DATA ${response.status}`);
  return payload.result;
}

export async function createAlfredEvent(data) {
  const response = await fetch(`${SERVER}/data/alfred/evento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Backend DATA ${response.status}`);
  return payload;
}

export async function createAlfredNote(data) {
  const response = await fetch(`${SERVER}/data/alfred/nota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Backend DATA ${response.status}`);
  return payload;
}

export async function createAlmaNote(data) {
  const response = await fetch(`${SERVER}/data/alma/nota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Backend DATA ${response.status}`);
  return payload;
}

export async function createCapitalNote(data) {
  const response = await fetch(`${SERVER}/data/capital/nota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Backend DATA ${response.status}`);
  return payload;
}

export async function fetchCapitalBilancio() {
  const response = await fetch(`${SERVER}/capital/bilancio`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Backend CAPITAL ${response.status}`);
  return payload.bilancio || {};
}

export async function runCapitalTool(tool, args = {}) {
  return runDataTool(tool, args);
}
