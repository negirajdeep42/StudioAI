import Anthropic from '@anthropic-ai/sdk';
import { MODEL, TUTOR_PERSONA, friendlyMessage, getClient, refusalMessage, toErrorResponse } from '@/lib/claude';

// Generations can outrun the default serverless limit; raise the ceiling.
export const maxDuration = 60;

/** How the tutor should shape its answer. Mirrors the mode picker in the UI. */
const MODE_INSTRUCTIONS: Record<string, string> = {
  Explain: 'Explain the concept clearly, then give one concrete worked example.',
  'Teach Me': 'Teach this from first principles in a short numbered progression, building up from what the student already knows.',
  'Quiz Me': 'Ask one question at a time. Wait for the answer, then say whether it is right and why before moving on.',
  'Give Me a Hint': 'Do NOT give the full answer. Offer the smallest hint that unblocks the student, then ask what they will try next.',
  'Step-by-Step': 'Work through this as numbered steps, showing the reasoning at each step.',
  Interview:
    'You are conducting a mock interview. For each candidate answer: give one or two sentences of specific, ' +
    'honest feedback on what was strong and what was missing, then ask the next question. Ask exactly one ' +
    'question per turn and keep the difficulty appropriate to the stated experience level. Do not coach ' +
    'before they answer - assess what they actually said.',
};

interface TutorRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  subject?: string;
  difficulty?: string;
  mode?: string;
  /** Optional source material for "chat with this document" surfaces. */
  documentContext?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TutorRequest;
    const { messages, subject, difficulty, mode, documentContext } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'bad_request', message: 'messages is required' }, { status: 400 });
    }

    const client = getClient();

    const systemParts = [TUTOR_PERSONA];
    if (subject) systemParts.push(`The student is studying: ${subject}.`);
    if (difficulty) systemParts.push(`Pitch your answer at a ${difficulty} level.`);
    if (mode && MODE_INSTRUCTIONS[mode]) systemParts.push(MODE_INSTRUCTIONS[mode]);
    if (documentContext) {
      systemParts.push(
        'Answer strictly from the study material below. If the answer is not in it, say so rather than guessing.\n\n' +
          `<study_material>\n${documentContext}\n</study_material>`
      );
    }
    systemParts.push('Use Markdown. Keep answers focused - a few short paragraphs or a tight list, not an essay.');

    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      // Chat is latency-sensitive, so trade some depth for responsiveness.
      output_config: { effort: 'medium' },
      system: systemParts.join('\n\n'),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    // Pull the first event before committing to a 200. Failures that happen up
    // front (bad key, rate limit, invalid request) are by far the most common,
    // and this way they come back as a proper status code with a JSON body
    // instead of raw error text appearing inside the chat bubble.
    const iterator = stream[Symbol.asyncIterator]();
    let first: IteratorResult<Anthropic.MessageStreamEvent>;
    try {
      first = await iterator.next();
    } catch (error) {
      stream.abort();
      return toErrorResponse(error);
    }

    // Plain-text streaming: the client appends each chunk straight to the bubble.
    const encoder = new TextEncoder();
    const body$ = new ReadableStream<Uint8Array>({
      async start(controller) {
        const emit = (event: Anthropic.MessageStreamEvent) => {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        };

        try {
          if (!first.done) emit(first.value);

          let next = await iterator.next();
          while (!next.done) {
            emit(next.value);
            next = await iterator.next();
          }

          // A refusal arrives as a normal 200, so surface it in the stream body.
          const final = await stream.finalMessage();
          const refusal = refusalMessage(final.stop_reason);
          if (refusal) controller.enqueue(encoder.encode(refusal));
        } catch (error) {
          // Mid-stream failure: headers are already sent, so the only way to
          // tell the user is in-band.
          console.error('[tutor] stream failed', error);
          controller.enqueue(encoder.encode(`\n\n_${friendlyMessage(error)}_`));
        } finally {
          controller.close();
        }
      },
      cancel() {
        // User navigated away or hit stop - don't keep paying for tokens.
        stream.abort();
      },
    });

    return new Response(body$, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
