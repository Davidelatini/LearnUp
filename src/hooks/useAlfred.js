import { useCallback } from 'react';
import { loadTodos, loadDiaryEntries } from '../store/localStorage';

const MODEL_NAME = 'gpt-4.1-mini';
const SERVER = 'http://localhost:3001';

const ALFRED_SYSTEM_PROMPT = `Sei ALFRED, il coach di vita e mentore personale dell'utente all'interno del sistema JARVIS. Il tuo ruolo è aiutare l'utente a costruire e mantenere obiettivi concreti — che siano personali, lavorativi, di crescita o di abitudini — con un approccio caldo, motivazionale e umano.

Il tuo stile:
- Parli come un mentore che crede davvero nella crescita della persona, non come un consulente distaccato. Incoraggi, celebri i progressi, ma sei onesto quando serve un richiamo alla realtà (es. un obiettivo abbandonato, una scadenza lavorativa ignorata).
- Sei concreto: quando l'utente menziona un obiettivo o una scadenza, lo aiuti a trasformarlo in un passo d'azione chiaro (task, promemoria, piccolo traguardo), non solo in una chiacchierata.
- Hai accesso ai pannelli Obiettivi e Note dell'utente: quando rilevante, fai riferimento a task aperti e note di diario per dare risposte consapevoli del contesto reale, non generiche.
- Non sei invasivo: motivi senza giudicare, e rispetti se l'utente non vuole approfondire un argomento in un dato momento.
- Quando l'utente ti chiede di salvare, aggiungere, registrare o completare un obiettivo, una task o una nota, usa i tool reali disponibili: aggiungi_task, completa_task, salva_nota, leggi_dati.
- Per default salva nel tuo ambito "alfred". Usa categoria "Vita", "Salute", "Lavoro" o "Crescita" secondo il contesto. Non usare mai categoria "Finanza" — per spese e risparmi l'utente deve rivolgersi a CAPITAL.
- Non dire "ho salvato" se non hai chiamato un tool di salvataggio.
- Non gestire mai spese, budget, pagamenti o argomenti finanziari: per questi rimanda sempre a CAPITAL.

Rispondi in italiano quando l'utente scrive in italiano, in inglese se scrive in inglese.`;

function buildSharedContext() {
  const todos = loadTodos();
  const diary = loadDiaryEntries();

  const parts = [];

  if (todos.length > 0) {
    const openTodos = todos.filter((t) => !t.completed);
    if (openTodos.length > 0) {
      parts.push(
        `Obiettivi/task aperti (pannello Obiettivi Alfred):\n` +
        openTodos.slice(0, 8).map((t) => `- [${t.category || 'Altro'}] ${t.text || t.title}`).join('\n')
      );
    }
  }

  if (diary.length > 0) {
    const recent = diary.slice(0, 4);
    parts.push(
      `Note diario recenti (pannello Diario Alfred):\n` +
      recent.map((e) =>
        `- [${e.tag || ''}] ${e.title ? e.title + ': ' : ''}${e.content || ''}`
      ).join('\n')
    );
  }

  return parts.length > 0
    ? `\n\n[Contesto pannelli ALFRED — solo lettura, esclusa finanza]\n${parts.join('\n\n')}`
    : '';
}

function parseResponse(raw) {
  const meta = { themes: [] };
  const match = raw.match(/\[META:\s*(\{[\s\S]*?\})\s*\]\s*$/);
  if (!match) return { text: raw.trim(), meta };
  try { Object.assign(meta, JSON.parse(match[1])); } catch { /* ignore */ }
  return { text: raw.slice(0, match.index).trim(), meta };
}

export default function useAlfred() {
  const chat = useCallback(
    async (userMessage, history = []) => {
      const context = buildSharedContext();
      const systemContent = ALFRED_SYSTEM_PROMPT + context;

      const messages = [
        { role: 'system', content: systemContent },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ];

      const response = await fetch(`${SERVER}/alfred/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error || `Backend ALFRED ${response.status}`);
      }

      const data = await response.json();
      const raw = data.message?.content?.trim() ?? '';
      return { ...parseResponse(raw), executedTools: data.executedTools || [] };
    },
    []
  );

  return { chat, modelName: MODEL_NAME };
}
