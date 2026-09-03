import Anthropic from '@anthropic-ai/sdk';

/**
 * Server-only Claude client. Never import this from a Client Component -
 * it reads ANTHROPIC_API_KEY, which must stay on the server.
 */

export const MODEL = 'claude-opus-5';

/** Thrown when the app is running without an API key configured. */
export class MissingApiKeyError extends Error {
  constructor() {
    super('ANTHROPIC_API_KEY is not set');
    this.name = 'MissingApiKeyError';
  }
}

let cached: Anthropic | null = null;

export function getClient(): Anthropic {
  cached ??= new Anthropic();
  // The SDK resolves credentials from several sources (API key, auth token, a
  // stored CLI profile), so check what it actually found rather than one env
  // var - and fail here with a clear message instead of a 401 at request time.
  if (!cached.apiKey && !cached.authToken) throw new MissingApiKeyError();
  return cached;
}

/** Shared framing so every surface answers like the same study assistant. */
export const TUTOR_PERSONA =
  'You are the AI tutor inside AI StudyOS, a study companion for university computer-science students. ' +
  'Explain concepts precisely and concretely, favour worked examples over abstractions, and keep a warm, ' +
  'direct tone. Never invent citations, exam dates, or syllabus details you were not given.';

/**
 * Human-readable version of a failure, for cases where a status code is no
 * longer available - e.g. an error part-way through an already-open stream.
 */
export function friendlyMessage(error: unknown): string {
  if (error instanceof MissingApiKeyError) {
    return 'AI features need an Anthropic API key. Add ANTHROPIC_API_KEY to .env.local and restart the dev server.';
  }
  if (error instanceof Anthropic.AuthenticationError) {
    return 'That API key was rejected. Check ANTHROPIC_API_KEY in .env.local.';
  }
  if (error instanceof Anthropic.RateLimitError) {
    return 'Rate limited by the API. Wait a moment and try again.';
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return 'Lost connection to the Anthropic API. Please try again.';
  }
  if (error instanceof Anthropic.APIError) {
    return error.message;
  }
  return 'The response was cut short. Please try again.';
}

/**
 * Maps any failure from a route handler onto a JSON response the UI can render.
 * Ordered most-specific first so retryable and non-retryable cases stay distinct.
 */
export function toErrorResponse(error: unknown): Response {
  if (error instanceof MissingApiKeyError) {
    return Response.json(
      {
        error: 'not_configured',
        message:
          'AI features need an Anthropic API key. Add ANTHROPIC_API_KEY to .env.local and restart the dev server.',
      },
      { status: 503 }
    );
  }

  if (error instanceof Anthropic.AuthenticationError) {
    return Response.json(
      { error: 'auth', message: 'That API key was rejected. Check ANTHROPIC_API_KEY in .env.local.' },
      { status: 401 }
    );
  }

  if (error instanceof Anthropic.RateLimitError) {
    return Response.json(
      { error: 'rate_limited', message: 'Rate limited by the API. Wait a moment and try again.' },
      { status: 429 }
    );
  }

  if (error instanceof Anthropic.BadRequestError) {
    return Response.json(
      { error: 'bad_request', message: error.message },
      { status: 400 }
    );
  }

  if (error instanceof Anthropic.APIConnectionError) {
    return Response.json(
      { error: 'network', message: 'Could not reach the Anthropic API. Check your connection.' },
      { status: 502 }
    );
  }

  if (error instanceof Anthropic.APIError) {
    return Response.json(
      { error: 'api_error', message: error.message },
      { status: error.status ?? 500 }
    );
  }

  console.error('[claude] unexpected error', error);
  return Response.json(
    { error: 'unknown', message: 'Something went wrong generating that. Try again.' },
    { status: 500 }
  );
}

/**
 * Claude may decline a request outright (HTTP 200 with stop_reason "refusal"),
 * so callers must check this before reading content.
 */
export function refusalMessage(stopReason: string | null | undefined): string | null {
  if (stopReason !== 'refusal') return null;
  return 'I could not generate a response for that request. Try rephrasing it.';
}
