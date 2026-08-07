import { useCallback } from 'react';

const SERVER = 'http://localhost:3001';

export default function useJarvis() {
  const sendMessage = useCallback(async (messages, systemPrompt, onChunk, signal) => {
    const allMessages = [{ role: 'system', content: systemPrompt }, ...messages];

    const response = await fetch(`${SERVER}/mind/chat`, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: allMessages }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || `Backend MIND ${response.status}`);

    const text = data.pendingAction?.message || data.message?.content || '';
    if (text) onChunk(text);

    return data.pendingAction
      ? [{ name: data.pendingAction.tool, args: data.pendingAction.params, pending: true, id: data.pendingAction.id }]
      : (data.executedTools || []);
  }, []);

  const confirmAction = useCallback(async (pendingActionId, approved, onChunk, signal) => {
    const response = await fetch(`${SERVER}/mind/confirm`, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pendingActionId, approved }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || `Backend MIND ${response.status}`);

    const text = data.message?.content || '';
    if (text) onChunk(text);
    return data.executedTools || [];
  }, []);

  return { sendMessage, confirmAction };
}
