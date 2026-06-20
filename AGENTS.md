
# AGENTS.md - Audit.dev / Resulyze (V2 Specs)

You are an expert Next.js and AI engineer helping build this resume analysis MVP.
Write clean, simple, maintainable code. Prioritize speed to MVP and clarity over unnecessary abstraction.
Think like a senior product engineer operating under a strict 90-minute deadline.

---

## Project Overview

This project is a single-page resume analyzer and workflow optimizer branded in the UI as **RESULYZE**.

The app lets a student or early-career candidate:
- Upload a PDF resume.
- Enter company name, job title, and a job description.
- Extract resume text on the server with `pdf-parse-new`.
- Analyze the resume against the job description with Gemini through the Vercel AI SDK.
- **[V2 Feature]** View an actionable, split-screen dashboard displaying critique alongside **instantly copyable LaTeX or Markdown bullet point rewrites** optimized for their target role.

Keep the implementation focused on this one workflow:
```text
Upload PDF + Paste JD -> Analyze -> Split-View Actionable Feedback & LaTeX Copier

```

Do not turn this into a multi-page platform, account system, dashboard, template builder, or database-backed product unless explicitly asked.

---

## Current Tech Stack

* Next.js 16 App Router (No `src/` directory)
* React 19
* TypeScript
* Tailwind CSS 4
* `lucide-react` for icons
* `pdf-parse-new` for server-side PDF text extraction
* `ai` + `@ai-sdk/google` for Gemini calls
* `class-variance-authority`, `clsx`, and `tailwind-merge` for UI utilities
* Minimal shadcn-style UI primitives in `components/ui`

---

## Banned Scope For V2 (Do Not Build)

Do not introduce these unless the user explicitly asks:

* Browser-based LaTeX compilers (e.g., trying to generate PDFs on the server or client)
* Rich text wysiwyg editors (e.g., TipTap, Quill)
* Database persistence, user accounts, authentication (Clerk, Supabase, NextAuth)
* Multi-page routing or complex client state management engines (Zustand, Redux)
* Gated: No user database writes, saved resume history tracking, or multi-tenant dashboard views until the V2 split layout and LaTeX export prompt are fully shipped and verified by your seniors. Keep Supabase purely as an identity gate if needed, nothing more.
---

## Current Architecture

```text
app/
  layout.tsx            <-- Wraps children with AuthProvider
  page.tsx              <-- Public Landing Page / Form
  globals.css
  (auth)/               <-- [Frozen Scope] Auth UI routes
    login/
      page.tsx
    signup/
      page.tsx
  actions/
    analyze.ts          <-- Houses V2 Gemini Prompt & Data Validation
  dashboard/            <-- [Gated Future Scope]
    page.tsx

components/
  app-header.tsx
  hero-section.tsx
  resume-form/
    form-field.tsx
    resume-form.tsx
    resume-upload-field.tsx
  resume-results/       <-- Focus here next
    ats-score-card.tsx
    feedback-section.tsx
    latex-copier-card.tsx
    resume-results.tsx  
    score-overview-card.tsx
  ui/
    button.tsx

contexts/
  AuthContext.tsx       <-- Provides session access across the application

lib/
  utils.ts
  supabase/             <-- Supabase JS clients
    client.ts
    server.ts

design/                 <-- Visual references from mockups

```

---

## Server Action Contract

The main server action remains stateless and server-only:

```ts
analyzeResume(formData: FormData): Promise<AnalyzeResumeResponse>

```

Expected form fields:

* `resume`: PDF `File`
* `description`: job description string
* `company`: target company name (Used in V2 Prompt)
* `jobTitle`: target job title (Used in V2 Prompt)

---

## AI Contract & Schema (V2 Update)

The Gemini model used is `gemini-2.5-flash-lite`.
The prompt must require raw valid JSON only. It **must** inject the `company` and `jobTitle` variables to tailor the output.

The V2 response shape includes a dedicated array for copy-pasteable LaTeX rewrite lines:

```ts
export interface ResumeAnalysis {
  score: number;
  score_rationale: string;
  missing_keywords: string[];
  matched_keywords: string[];
  // V2 Improvement: Concrete before/after bullets with prepared LaTeX syntax
  actionable_bullets: {
    original_shortcoming: string;
    suggested_revision_markdown: string;
    suggested_revision_latex: string; // Ready for \item copy-paste into Overleaf
  }[];
  section_feedback: {
    summary: string;
    experience: string;
    skills: string;
    education: string;
  };
  overall_verdict: "strong" | "moderate" | "weak";
}

```

---

## UI And Styling Rules (V2 Update)

* **Two-Column Layout:** When results load, transition the UI smoothly into a balanced, clean split layout. Left side: High-level metrics and contextual section feedback. Right side: The optimization workflow (Actionable revisions + LaTeX/Markdown export cards).
* Use Tailwind CSS 4 classes directly.
* Use `lucide-react` icons for quick feedback actions (e.g., `Check`, `Copy`, `Code`).
* Keep things stateless: Use a single click handler to copy text to clipboard with quick UI feedback states ("Copied!").

---

## TypeScript Rules

* Keep strict TypeScript. No `any`.
* Validate the schema explicitly inside `analyze.ts` before returning it to the client components.

```ts
export type AnalyzeResumeResponse =
  | { success: true; data: ResumeAnalysis }
  | { success: false; error: string };

```

---

## Near-Term Priorities

When asked what to do next, execute in this order:

1. Update `app/actions/analyze.ts` to utilize `company` and `jobTitle`, and update the prompt to enforce the new V2 JSON schema (including `suggested_revision_latex`).
2. Build `components/resume-results/latex-copier-card.tsx` to handle rendering the before/after comparisons and clipboard logic.
3. Update `components/resume-results/resume-results.tsx` to use a 2-column layout for easy review.
4. Update page metadata in `app/layout.tsx`.
5. Run `npm run lint` and `npm run build` to verify correctness.

```

***

### ⚡ Coach Checkpoint
Your `AGENTS.md` is locked and ready for V2. Open up `app/actions/analyze.ts` and let's update the prompt and types first. Paste your current server action file here so we can inject the LaTeX output generation safely.

```