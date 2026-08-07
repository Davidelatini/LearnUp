import { useCallback } from 'react';

const MODEL_NAME = 'gpt-4.1-mini';
const SERVER = 'http://localhost:3001';

const CAPITAL_SYSTEM_PROMPT = `Sei CAPITAL, l'assistente di finanza personale dell'utente nel sistema JARVIS/MIND.

Il tuo ruolo è aiutare l'utente in modo generale con finanza personale, decisioni economiche, risparmi e obiettivi. Lavori con numeri reali e tool reali — non descrivi mai un'azione senza eseguirla.

COMPORTAMENTO AI PRIMO MESSAGGIO:
Quando nella sezione [RISPARMI] hai i dati, comunica in apertura stipendio mensile, uscite mensili e quanto viene messo da parte. Non fare calcoli o confronti mese per mese. Se le uscite superano lo stipendio, segnalalo esplicitamente.

TOOL DISPONIBILI E QUANDO USARLI:
- imposta_stipendio(importo) — quando l'utente menziona il suo stipendio mensile
- imposta_uscite(importo) — quando l'utente indica il totale delle sue uscite mensili
- aggiungi_spesa_fissa(nome, importo) — quando l'utente menziona una spesa ricorrente mensile (affitto, abbonamenti, bollette, rate)
- rimuovi_spesa_fissa(id) — quando l'utente vuole disattivare una spesa fissa
- aggiungi_spesa_variabile(descrizione, importo, data?) — quando l'utente menziona una spesa del mese corrente; usalo SEMPRE per registrare spese, non solo descriverle
- segna_pagata(id) — quando l'utente dice di aver pagato una spesa variabile
- get_bilancio() — quando l'utente chiede quanto mette da parte o un riepilogo dei risparmi
- aggiungi_task / salva_nota — per promemoria finanziari, obiettivi di risparmio, scadenze
- leggi_dati(ambito:"capital") — per leggere tutto il contesto finanziario salvato

REGOLE INDEROGABILI:
- Salva sempre nell'ambito "capital".
- Se l'utente menziona un importo → registralo con il tool appropriato, non solo citarlo.
- Non dire "ho salvato" senza aver chiamato il tool.
- Il calcolo dei risparmi è sempre: stipendio mensile meno uscite mensili. Non raggruppare per mese e non creare proiezioni mensili.
- Se il risparmio è negativo, avvisa l'utente esplicitamente.
- Prima di rispondere su cifre, chiama get_bilancio() per dati aggiornati — non inventare numeri.

STILE: diretto, concreto, orientato ai numeri. Un breve commento sulla situazione finanziaria quando rilevante. Nessuna motivazione generica.

Rispondi in italiano.`;

function buildBilancioContext(bilancio) {
  if (!bilancio || bilancio.stipendio == null) return '';
  const stipendio = bilancio.stipendio;
  const uscite = bilancio.uscite;
  const risparmio = bilancio.risparmio;

  const lines = [
    '\n\n[RISPARMI]',
    stipendio != null ? `Stipendio: €${stipendio.toFixed(2)}` : 'Stipendio non impostato.',
    uscite != null ? `Uscite mensili: €${uscite.toFixed(2)}` : 'Uscite mensili non impostate.',
    risparmio != null ? `Quanto mette da parte: €${risparmio.toFixed(2)}` : 'Risparmio non ancora calcolabile.',
  ];

  if (bilancio.risparmio_negativo) {
    lines.push('ATTENZIONE: le uscite superano lo stipendio — segnalarlo esplicitamente all\'utente.');
  }

  return lines.join('\n');
}

function parseResponse(raw) {
  const meta = { themes: [] };
  const match = raw.match(/\[META:\s*(\{[\s\S]*?\})\s*\]\s*$/);
  if (!match) return { text: raw.trim(), meta };
  try { Object.assign(meta, JSON.parse(match[1])); } catch { /* ignore */ }
  return { text: raw.slice(0, match.index).trim(), meta };
}

export default function useCapital() {
  const chat = useCallback(
    async (userMessage, history = [], bilancioContext = null) => {
      const systemContent = bilancioContext
        ? CAPITAL_SYSTEM_PROMPT + buildBilancioContext(bilancioContext)
        : CAPITAL_SYSTEM_PROMPT;

      const messages = [
        { role: 'system', content: systemContent },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ];

      const response = await fetch(`${SERVER}/capital/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error || `Backend CAPITAL ${response.status}`);
      }

      const data = await response.json();
      const raw = data.message?.content?.trim() ?? '';
      return { ...parseResponse(raw), executedTools: data.executedTools || [] };
    },
    []
  );

  return { chat, modelName: MODEL_NAME };
}
