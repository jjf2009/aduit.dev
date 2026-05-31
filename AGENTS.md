# AGENTS.md - Audit.dev / Resulyze

You are an expert Next.js and AI engineer helping build this resume analysis MVP.
Write clean, simple, maintainable code. Prioritize speed to MVP and clarity over unnecessary abstraction.
Think like a senior product engineer operating under a strict 90-minute deadline.

---

## Project Overview

This project is currently a single-page resume analyzer branded in the UI as **RESULYZE**.

The app lets a student or early-career candidate:

- Upload a PDF resume.
- Enter company name, job title, and a job description.
- Submit the form.
- Extract resume text on the server with `pdf-parse-new`.
- Analyze the resume against the job description with Gemini through the Vercel AI SDK.
- Display an ATS-style score, matched keywords, missing keywords, section feedback, and concrete improvement bullets.

Keep the implementation focused on this one workflow:

```text
Upload PDF + Paste JD -> Analyze -> Show Results
```

Do not turn this into a multi-page platform, account system, dashboard, resume builder, or database-backed product unless explicitly asked.

---

## Current Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- `lucide-react` for icons
- `pdf-parse-new` for server-side PDF text extraction
- `ai` + `@ai-sdk/google` for Gemini calls
- `class-variance-authority`, `clsx`, and `tailwind-merge` for UI utilities
- Minimal shadcn-style UI primitives in `components/ui`

Current scripts:

```bash
npm run dev
npm run build
npm run lint
```

---

## Banned Scope For V1

Do not introduce these unless the user explicitly asks:

- Stripe
- Clerk
- NextAuth
- Prisma
- Supabase
- LangChain
- Any database
- Multi-page routing
- User accounts
- Payment or subscription flows
- Resume storage
- Analytics/event tracking

Ask before installing anything new.

---

## Current Architecture

This repo uses top-level `app/`, `components/`, and `lib/` directories. It does **not** currently use `src/`.

```text
app/
  layout.tsx
  page.tsx
  globals.css
  actions/
    analyze.ts

components/
  app-header.tsx
  hero-section.tsx
  resume-form/
    form-field.tsx
    resume-form.tsx
    resume-upload-field.tsx
  resume-results/
    ats-score-card.tsx
    feedback-section.tsx
    resume-results.tsx
    score-overview-card.tsx
  ui/
    button.tsx

lib/
  utils.ts

public/
  background-image.png
  logo.png

design/
  reference mockups and screenshots
```

`app/page.tsx` is the only route. It composes `AppHeader`, `HeroSection`, and `ResumeForm`.

`components/resume-form/resume-form.tsx` owns client state, form validation, loading messages, calls the server action, and renders results.

`app/actions/analyze.ts` owns the business logic and must remain server-only with `"use server"`.

`components/resume-results/*` renders the structured AI output. Keep result components presentational and typed from `ResumeAnalysis`.

---

## Server Action Contract

The main server action is:

```ts
analyzeResume(formData: FormData): Promise<AnalyzeResumeResponse>
```

Expected form fields:

- `resume`: PDF `File`
- `description`: job description string
- `company`: currently collected by the UI but not used by the action
- `jobTitle`: currently collected by the UI but not used by the action

Current behavior:

1. Validate that `resume` exists and is a PDF.
2. Reject PDFs over 10MB.
3. Validate that a job description was provided.
4. Convert the uploaded `File` to `ArrayBuffer`, then `Buffer`.
5. Parse resume text using `pdf-parse-new`.
6. Log extracted resume text to the server console for debugging.
7. Require `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`.
8. Call Gemini via `@ai-sdk/google` and `generateText`.
9. Parse the model response as raw JSON.
10. Validate the parsed JSON shape before returning it to the client.
11. Return `{ success: false, error: string }` for validation, parsing, API, or unexpected failures.

All PDF parsing must stay on the server. Never parse PDFs in client components.

---

## AI Contract

The current Gemini model in `app/actions/analyze.ts` is:

```ts
gemini-2.5-flash-lite
```

The prompt must require raw valid JSON only. No Markdown, no code fences, no preamble, and no trailing commentary.

The expected response shape is:

```ts
export interface ResumeAnalysis {
  score: number;
  score_rationale: string;
  missing_keywords: string[];
  matched_keywords: string[];
  actionable_bullets: string[];
  section_feedback: {
    summary: string;
    experience: string;
    skills: string;
    education: string;
  };
  overall_verdict: "strong" | "moderate" | "weak";
}
```

When editing prompt or parsing logic:

- Keep the schema stable unless the UI is updated at the same time.
- Keep runtime validation in place.
- Keep graceful error responses.
- Do not expose API keys to client code.

---

## UI And Styling Rules

- Use Tailwind classes directly.
- Match the existing visual direction from `design/` and current components.
- Keep the first screen focused: header, hero copy, and analysis form.
- The app is already componentized enough for V1. Avoid splitting single-use pieces further unless it clearly improves readability.
- Use `lucide-react` icons for UI indicators.
- Preserve long-text handling for job descriptions, file names, keywords, and AI output.
- Results should remain scannable:
  - score overview
  - ATS card
  - missing keywords
  - matched keywords
  - section feedback
  - improvement checklist

Important current styling note: the UI intentionally uses a designed landing/app hybrid with `public/background-image.png`, rounded upload surfaces, gradient hero text, and compact result cards. Keep changes visually consistent.

---

## State Management

- Use local React state only.
- `ResumeForm` currently uses `useState` and `useTransition`.
- Do not add Redux, Zustand, React Query, or global stores.
- Keep loading states explicit. Current messages include:
  - `Extracting text from your PDF...`
  - `Analyzing with AI...`

---

## TypeScript Rules

- Keep strict TypeScript.
- Do not use `any`.
- Prefer explicit exported types for server action data returned to the UI.
- Validate unknown AI output before treating it as `ResumeAnalysis`.
- Keep action response as a discriminated union:

```ts
export type AnalyzeResumeResponse =
  | { success: true; data: ResumeAnalysis }
  | { success: false; error: string };
```

---

## Environment Variables

The server action accepts either:

```text
GEMINI_API_KEY
GOOGLE_GENERATIVE_AI_API_KEY
```

Never read these from client components.
Never prefix these with `NEXT_PUBLIC_`.
Never print secret values.

---

## Current Implementation Notes

- The app is already past the initial PDF-parser proof phase.
- `analyzeResume` now includes PDF parsing, Gemini analysis, JSON parsing, and runtime validation.
- The upload field validates PDF type and 10MB max size on the client.
- The server repeats file validation, which should remain in place.
- `company` and `jobTitle` are collected but not yet included in the AI prompt.
- `app/layout.tsx` still has default metadata (`Create Next App`). Updating metadata is a reasonable near-term cleanup.
- The header upload button is visual only right now. Wire it to focus the upload input only if requested.

---

## Near-Term Priorities

When asked what to do next, prefer these focused improvements:

1. Include `company` and `jobTitle` in the server action prompt.
2. Update page metadata to match the product.
3. Improve submit/loading status so extraction and AI phases are represented accurately.
4. Remove or gate debug logging of full resume text before production.
5. Run `npm run lint` and `npm run build` after meaningful code changes.

Avoid adding features outside the resume analyzer workflow.

---

## Final Reminder

Before generating code:

- Read the relevant files first.
- Keep changes small and directly tied to the request.
- Preserve the single-page MVP.
- Keep all PDF and AI work server-side.
- Handle errors without crashing the UI.
- Do not add scope just because the app could eventually need it.
