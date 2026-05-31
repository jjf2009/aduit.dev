
You are an expert Next.js and AI engineer helping me build [Audit.dev].
Write clean, simple, maintainable code. Prioritize speed to MVP and clarity over unnecessary abstraction. 
Think like a senior product engineer operating under a strict 90-minute deadline.

---
## Project Overview
We are building Audit.dev, a single-page web app that parses a student's PDF resume against a Job Description (JD) using AI to find missing keywords.
The app includes:
- A simple UI to upload a PDF and paste a JD string.
- A backend Server Action that extracts text from the PDF using `pdf-parse-new`.
- An integration with Gemini 1.5 Flash to analyze the text and return a JSON score and feedback.
- A results view displaying the ATS score and actionable bullet points.

Keep the implementation simple, functional, and contained entirely on one page. Do NOT build a multi-page platform.

---
## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- `lucide-react` (for simple icons)
- `pdf-parse-new` (for server-side PDF text extraction)
- `vercel/ai-sdk` (Gemini API)

**BANNED TECHNOLOGIES FOR V1:**
Do not introduce Stripe, Clerk, NextAuth, Prisma, Supabase, LangChain, or any database. 
Ask before installing anything new.

---
## Development Philosophy
Build for speed and immediate utility.
1. Read this file first.
2. Keep the implementation simple.
3. Avoid overengineering. Do not build generalized abstractions for single-use functions.
4. Prefer readable code over clever code.
5. Build the smallest useful version first. No "Coming Soon" UI.

---
## Architecture
Use this folder structure:

```text
src/
  app/
    layout.tsx
    page.tsx            # Single-page UI (Form + Results)
    actions/
      analyze.ts        # Next.js Server Action (PDF parse + AI call)
  components/
    ui/                 # Simple Tailwind/shadcn components
  lib/
    utils.ts            # Helper functions (e.g., Tailwind cn merge)

```

**app/page.tsx** is the only route. It manages the form state (`useState`, `useTransition`) and displays the results.
**app/actions/analyze.ts** contains the core business logic. It must run entirely on the server (`"use server"`).
**components/ui/** is for simple, scannable UI blocks (Button, Card, Input). Do not over-componentize early.

---

## Server Actions & PDF Parsing Rule

All PDF processing MUST happen on the server.

1. The client passes `FormData` containing the `File` to the Server Action.
2. The Server Action converts the `File` to an `ArrayBuffer` -> `Buffer`.
3. Pass the `Buffer` to `pdf-parse` to extract raw text. Do not attempt to parse PDFs on the client to avoid Webpack/Node polyfill errors.

---

## AI & Prompting Rule

The core value is the AI response.

1. Use `@google/generative-ai` pointing to `gemini-1.5-flash`.
2. The prompt MUST instruct the model to return raw, valid JSON without Markdown formatting (no ```json blocks).
3. The expected JSON structure is:

```json
   {
     "score": number,
     "missing_keywords": ["string"],
     "actionable_bullets": ["string"]
   }

```

4. Handle AI parsing errors gracefully. Return `{ success: false, error: "..." }` to the client if it fails.

---

## UI & Styling Rules

* Use Tailwind CSS (`className`).
* Keep the UI extremely clean, minimal, and professional (developer-focused).
* Use distinct loading states (e.g., "Extracting text...", "Analyzing with AI...") so the user knows the app isn't frozen.
* Handle long text wrapping for the Job Description input and AI output cleanly.

---

## State Management

* Use standard React Hooks (`useState`) for form data and results holding.
* Use `useTransition` or `useActionState` for handling the loading state of the Server Action to prevent UI blocking.
* No global state management (Redux, Zustand) is needed for this V1.

---

## TypeScript

* Strict mode.
* Define explicit interfaces for the Server Action response and the expected AI JSON structure.
* No `any`.

---

## Secrets

* Never expose `GEMINI_API_KEY` in client code.
* Ensure the Server Action is marked with `"use server"` so environmental variables are kept secure.

---

## Final Reminder

Before generating any code:

* Check that you are not adding scope.
* Ensure the Server Action handles errors without crashing the app.
* Remember the goal: Upload PDF + Paste JD -> Click "Analyze" -> See JSON Results. Nothing else.

```

### Your Next Action
1. Save this as `agent.md` in your project.
2. Open your AI code editor.
3. Prompt the AI: *"Read agent.md. Build the `src/app/actions/analyze.ts` file to take a FormData PDF, parse it with pdf-parse, and return the raw text to the console. Don't add the AI part yet, just prove the PDF parsing works."*

**Do not build the UI until the PDF parser works.** Let me know when that server action successfully prints your resume text to your terminal.

```