import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { MODEL, TUTOR_PERSONA, getClient, refusalMessage, toErrorResponse } from '@/lib/claude';

export const maxDuration = 60;

const QnaSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      answer: z.string().describe('A strong model answer the student can learn from'),
      category: z.enum(['Technical', 'Behavioral', 'HR']),
    })
  ),
});

interface InterviewRequest {
  role: string;
  experience?: string;
  technologies?: string;
  count?: number;
}

export async function POST(request: Request) {
  try {
    const { role, experience, technologies, count } = (await request.json()) as InterviewRequest;

    if (!role?.trim()) {
      return Response.json({ error: 'bad_request', message: 'A target role is required.' }, { status: 400 });
    }

    const client = getClient();
    const howMany = Math.min(Math.max(count ?? 8, 3), 15);

    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: 'medium', format: zodOutputFormat(QnaSchema) },
      system:
        `${TUTOR_PERSONA}\n\n` +
        `Generate exactly ${howMany} interview questions with model answers. Mix technical, behavioural and ` +
        'HR questions, weighted towards technical. Answers should be concrete and specific to the role and ' +
        'stack given - the kind of answer that would actually land, not generic advice.',
      messages: [
        {
          role: 'user',
          content:
            `Target role: ${role}\n` +
            (experience ? `Experience level: ${experience}\n` : '') +
            (technologies ? `Technologies to focus on: ${technologies}` : ''),
        },
      ],
    });

    const refusal = refusalMessage(response.stop_reason);
    if (refusal) return Response.json({ error: 'refusal', message: refusal }, { status: 422 });

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
