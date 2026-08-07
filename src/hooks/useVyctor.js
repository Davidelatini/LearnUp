import { useCallback } from 'react';
import { BOTS } from '../config/bots';

const MODEL_NAME = 'gpt-4.1-mini';
const SERVER = 'http://localhost:3001';

function parseResponse(raw) {
  const meta = {
    suggestedSwitch: null,
    themes: [],
    keyMoment: '',
    questionToCarryForward: '',
    crisis: false,
  };

  const match = raw.match(/\[META:\s*(\{[\s\S]*?\})\s*\]\s*$/);
  if (!match) return { text: raw.trim(), meta };

  try {
    Object.assign(meta, JSON.parse(match[1]));
  } catch {
    // Ignore malformed metadata.
  }

  return { text: raw.slice(0, match.index).trim(), meta };
}

export default function useVyctor() {
  const chat = useCallback(
    async (userMessage, botId = 'CORE', history = []) => {
      const bot = BOTS[botId] ?? BOTS.CORE;
      const messages = [
        { role: 'system', content: bot.systemPrompt },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ];

      const response = await fetch(`${SERVER}/vyctor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error || `Backend VYCTOR ${response.status}`);
      }

      const data = await response.json();
      if (data.pendingAction) {
        return {
          text: data.pendingAction.message,
          meta: parseResponse('').meta,
          pendingAction: data.pendingAction,
          executedTools: data.executedTools || [],
        };
      }

      const raw = data.message?.content?.trim() ?? '';
      return {
        ...parseResponse(raw),
        executedTools: data.executedTools || [],
      };
    },
    []
  );

  const confirmAction = useCallback(
    async (pendingActionId, approved) => {
      const response = await fetch(`${SERVER}/vyctor/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pendingActionId, approved }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error || `Backend VYCTOR ${response.status}`);
      }

      const data = await response.json();
      const raw = data.message?.content?.trim() ?? '';
      return {
        ...parseResponse(raw),
        executedTools: data.executedTools || [],
      };
    },
    []
  );

  const getActionLog = useCallback(
    async () => {
      const response = await fetch(`${SERVER}/vyctor/action-log`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.log || [];
    },
    []
  );

  return {
    chat,
    confirmAction,
    getActionLog,
    modelName: MODEL_NAME,
  };
}
