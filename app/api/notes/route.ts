import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { MODEL, TUTOR_PERSONA, getClient, refusalMessage, toErrorResponse } from '@/lib/claude';

export const maxDuration = 60;

/**
 * One generation fills every field of the app's GeneratedNote shape, so the
 * four output modes are just different views of the same result - and saving
 * to the library keeps the flashcards and quiz, not only the prose.
 */
const NoteSchema = z.object({
  title: z.string().describe('Short descriptive title for these notes'),
  summary: z.string().describe('Two or three sentence overview of the material'),
  markdown: z
    .string()
    .describe('The full structured notes in Markdown, using ## headings and bullet points'),
  flashcards: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .describe('Active-recall flashcards covering the key facts'),
  quiz: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()).describe('Exactly four answer options'),
        correctOptionIndex: z.number().int().describe('Zero-based index of the correct option'),
        explanation: z.string(),
      })
    )
    .describe('Multiple-choice questions with four options each'),
  importantQuestions: z
    .array(z.string())
    .describe('Long-form questions likely to appear in an exam on this material'),
});

interface NotesRequest {
  sourceText: string;
  subjectName?: string;
  sourceName?: string;
}

export async function POST(request: Request) {
  try {
    const { sourceText, subjectName, sourceName } = (await request.json()) as NotesRequest;

    if (!sourceText?.trim()) {
      return Response.json(
        { error: 'bad_request', message: 'Paste some text or upload a file first.' },
        { status: 400 }
      );
    }

    const client = getClient();

    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      // Study material is generated once and reused, so favour quality here.
      output_config: { effort: 'high', format: zodOutputFormat(NoteSchema) },
      system:
        `${TUTOR_PERSONA}\n\n` +
        'Turn the student\'s source material into revision notes. Cover only what the material supports - ' +
        'do not pad with unrelated topics. Aim for 6-10 flashcards, 4-6 quiz questions, and 4-6 important questions.',
      messages: [
        {
          role: 'user',
          content:
            (subjectName ? `Subject: ${subjectName}\n` : '') +
            (sourceName ? `Source: ${sourceName}\n` : '') +
            `\nMaterial:\n\n${sourceText}`,
        },
      ],
    });

    const refusal = refusalMessage(response.stop_reason);
    if (refusal) {
      return Response.json({ error: 'refusal', message: refusal }, { status: 422 });
    }

    if (!response.parsed_output) {
      return Response.json(
        { error: 'parse_failed', message: 'The model returned an unexpected shape. Try again.' },
        { status: 502 }
      );
    }

    return Response.json(response.parsed_output);
  } catch (error) {
    return toErrorResponse(error);
  }
}
