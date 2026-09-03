# AI StudyOS

An AI-powered study companion for university CS students: organise subjects, turn
source material into revision notes, plan a week of study, practise interviews, and
track coding progress.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

## Getting Started

Install dependencies:

```bash
npm install
```

### Configure the AI features

The note generator, tutor chat, study planner and interview prep call the
Anthropic API, so they need a key:

```bash
cp .env.example .env.local
```

Then put your key in `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get one from the [Anthropic Console](https://console.anthropic.com/settings/keys).
`.env.local` is gitignored — never commit your key.

Without a key the app still runs; the AI surfaces just show a "not configured"
message instead of failing.

### Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

- **Auth** is a client-side demo (`lib/auth-context.tsx`) — any email with an
  8+ character password signs in. There is no server-side session.
- **Data** persists to `localStorage` via `lib/store-context.tsx`: subjects,
  tasks, saved notes, study plans, coding goals and study minutes.
- **AI** runs server-side in Route Handlers under `app/api/`, so the API key
  never reaches the browser. `lib/ai-client.ts` holds the browser-side callers.
- **Theming** is driven by a `data-theme` attribute set before first paint
  (`lib/theme-context.tsx`), so there's no flash of the wrong theme.

| Route | Purpose |
| --- | --- |
| `POST /api/tutor` | Streaming chat — powers the tutor, doc chat, subject chat, mock interview |
| `POST /api/notes` | Turns source text into notes, flashcards, a quiz and exam questions |
| `POST /api/study-plan` | Builds a weekly plan from your subjects and available hours |
| `POST /api/interview` | Generates role-specific interview questions with model answers |

## Learn More


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
