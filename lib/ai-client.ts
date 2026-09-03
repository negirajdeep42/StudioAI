'use client';

/**
 * Browser-side helpers for talking to the /api/* route handlers.
 * Everything here runs in the client; the API key never leaves the server.
 */

export class AiError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'AiError';
    this.code = code;
  }
}

async function readError(response: Response): Promise<never> {
  let message = `Request failed (${response.status})`;
  let code = 'unknown';
  try {
    const body = await response.json();
    if (body?.message) message = body.message;
    if (body?.error) code = body.error;
  } catch {
    /* non-JSON error body - keep the status-based message */
  }
  throw new AiError(code, message);
}

/** POST JSON, get JSON back. Used by the notes, plan and interview generators. */
export async function postJson<T>(url: string, payload: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) await readError(response);
  return (await response.json()) as T;
}

/**
 * Streams a tutor reply, invoking `onChunk` with each piece of text as it lands.
 * Resolves with the complete text.
 */
export async function streamTutor(
  payload: {
    messages: { role: 'user' | 'assistant'; content: string }[];
    subject?: string;
    difficulty?: string;
    mode?: string;
    documentContext?: string;
  },
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch('/api/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  // Errors come back as JSON before the stream starts.
  if (!response.ok) await readError(response);
  if (!response.body) throw new AiError('no_body', 'The server returned an empty response.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    if (!text) continue;
    full += text;
    onChunk(text);
  }

  // Flush any bytes held back by the multi-byte decoder.
  const tail = decoder.decode();
  if (tail) {
    full += tail;
    onChunk(tail);
  }

  return full;
}
