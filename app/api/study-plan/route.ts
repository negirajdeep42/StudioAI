import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { MODEL, TUTOR_PERSONA, getClient, refusalMessage, toErrorResponse } from '@/lib/claude';

export const maxDuration = 60;

const TaskSchema = z.object({
  topic: z.string(),
  subjectName: z.string(),
  durationMinutes: z.number().int(),
  type: z.enum(['Read Notes', 'Practice', 'Quiz', 'Revision']),
});

const PlanSchema = z.object({
  today: z
    .array(TaskSchema.extend({ timeSlot: z.string().describe('Clock time such as "09:00 AM"') }))
    .describe("Today's sessions, laid out against the clock in chronological order"),
  monday: z.array(TaskSchema),
  tuesday: z.array(TaskSchema),
  wednesday: z.array(TaskSchema),
  thursday: z.array(TaskSchema),
  friday: z.array(TaskSchema),
  rationale: z.string().describe('One or two sentences on how this plan is sequenced and why'),
});

interface PlanRequest {
  goal: string;
  examDate: string;
  dailyHours: number;
  difficulty: string;
  knowledgeLevel?: string;
  preferredTime?: string;
  /** Subjects with their weak topics, so the plan targets real gaps. */
  subjects?: { name: string; progress: number; weakTopics: string[] }[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PlanRequest;
    const { goal, examDate, dailyHours, difficulty, knowledgeLevel, preferredTime, subjects } = body;

    if (!goal?.trim()) {
      return Response.json({ error: 'bad_request', message: 'A goal is required.' }, { status: 400 });
    }

    const client = getClient();

    const subjectBrief = subjects?.length
      ? subjects
          .map(
            (s) =>
              `- ${s.name} (${s.progress}% complete)` +
              (s.weakTopics.length ? `; not yet finished: ${s.weakTopics.join(', ')}` : '')
          )
          .join('\n')
      : 'No subject data available - build a sensible generic CS revision plan.';

    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: 'medium', format: zodOutputFormat(PlanSchema) },
      system:
        `${TUTOR_PERSONA}\n\n` +
        'Build a realistic weekly revision plan. Respect the daily hour budget - the sum of each day\'s ' +
        'durationMinutes must not exceed it. Prioritise topics the student has not finished, interleave ' +
        'subjects rather than blocking one per day, and place revision sessions after the material is first studied.',
      messages: [
        {
          role: 'user',
          content:
            `Goal: ${goal}\n` +
            `Exam date: ${examDate}\n` +
            `Hours available per day: ${dailyHours}\n` +
            `Overall difficulty: ${difficulty}\n` +
            (knowledgeLevel ? `Current level: ${knowledgeLevel}\n` : '') +
            (preferredTime ? `Preferred study window: ${preferredTime}\n` : '') +
            `\nSubjects:\n${subjectBrief}`,
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
