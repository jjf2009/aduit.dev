# Resulyze

Resulyze is a modern, single-page resume analyzer and workflow optimizer built for students and early-career candidates. It enables users to upload a PDF resume, provide a job description along with the target company and role, and receive instant, actionable feedback powered by Gemini 2.5 Flash Lite through the Vercel AI SDK.

## Features

- **PDF Parsing**: Server-side text extraction from uploaded PDF resumes using `pdf-parse-new`.
- **AI-Powered Analysis**: Deep analysis against job descriptions using Google Gemini via the Vercel AI SDK.
- **Actionable Feedback**: Split-screen dashboard providing:
  - High-level metrics and scores (Overall, ATS formatting, etc.)
  - Missing and matched keyword identification.
  - Contextual feedback per section (Summary, Experience, Skills, Education).
- **Optimization Workflow**: Instantly copyable LaTeX or Markdown bullet point rewrites optimized for the target role.
- **Responsive Split-Screen UI**: A side-by-side view where you can read your original uploaded PDF (cached in IndexedDB) while reviewing your feedback and LaTeX revisions. (On mobile, the layout stacks naturally and hides the PDF to optimize screen real estate).

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4, `class-variance-authority`, `clsx`, `tailwind-merge`
- **Icons**: `lucide-react`
- **AI & LLM**: Vercel AI SDK (`ai`), `@ai-sdk/google` (Model: Gemini 2.5 Flash Lite)
- **PDF Extraction**: `pdf-parse-new`
- **Authentication**: Supabase (Used strictly as an identity gate)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Google Gemini API Key (`GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`)
- Supabase Project (URL and Anon Key)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/aduit.git
   cd aduit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
.
├── AGENTS.md                   # AI Agent prompt engineering & architecture rules
├── app
│   ├── (auth)                  # Authentication routes (Login, Signup)
│   │   ├── login
│   │   │   └── page.tsx
│   │   └── signup
│   │       └── page.tsx
│   ├── actions
│   │   └── analyze.ts          # Server Action for PDF parsing & Gemini API call
│   ├── dashboard
│   │   ├── page.tsx            # Main application dashboard
│   │   └── results
│   │       └── page.tsx        # Split-screen UI for displaying analysis & PDF
│   ├── favicon.ico
│   ├── globals.css             # Global Tailwind CSS imports
│   ├── layout.tsx              # Root layout with AuthProvider wrapping
│   └── page.tsx                # Public Landing Page / Form
├── components
│   ├── app-header.tsx          # Main application header
│   ├── hero-section.tsx        # Landing page hero component
│   ├── home-page-card.tsx      # Landing page feature card
│   ├── resume-form
│   │   ├── form-field.tsx
│   │   ├── resume-form.tsx     # The upload form handling JD, Company, Title, PDF
│   │   └── resume-upload-field.tsx
│   ├── resume-results
│   │   ├── ats-score-card.tsx  # ATS compliance score visualizer
│   │   ├── feedback-section.tsx# Expandable accordions for general feedback
│   │   ├── latex-copier-card.tsx # Component to copy revised bullets to LaTeX/Markdown
│   │   ├── resume-results.tsx  # Right-pane aggregator for all feedback components
│   │   └── score-overview-card.tsx
│   └── ui
│       └── button.tsx          # Reusable UI primitives
├── components.json             # shadcn/ui configuration
├── contexts
│   └── AuthContext.tsx         # React Context providing user session & Supabase client
├── design                      # Visual reference mockups for UI implementation
├── lib
│   ├── storage.ts              # IndexedDB helpers for local PDF caching
│   ├── supabase
│   │   ├── client.ts           # Supabase client instantiation
│   │   └── server.ts           # Supabase server actions helpers
│   └── utils.ts                # Tailwind merge and generic utility functions
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration for Tailwind
└── tsconfig.json               # TypeScript configuration
```

## Architecture Details

- **Stateless Server Actions**: The `analyzeResume` function in `analyze.ts` remains entirely stateless. It does not write to a database. It simply receives the PDF stream, extracts the text, sends a carefully engineered zero-shot prompt to Gemini 2.5 Flash Lite, and returns a strict, validated JSON response of the critique.
- **Client-side PDF Storage**: To maintain privacy and avoid unnecessary server uploads and database writes, the original PDF uploaded by the user is stored locally in the browser using `IndexedDB`. When the results page loads, the PDF is retrieved from the local browser storage to populate the left pane of the split view.

## License

MIT
