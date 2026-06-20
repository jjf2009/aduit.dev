"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import PdfParse from "pdf-parse-new";

export interface ResumeAnalysis {
  score: number;
  score_rationale: string;
  missing_keywords: string[];
  matched_keywords: string[];
  actionable_bullets: {
    original_shortcoming: string;
    suggested_revision_markdown: string;
    suggested_revision_latex: string;
  }[];
  section_feedback: {
    summary: string;
    experience: string;
    skills: string;
    education: string;
  };
  overall_verdict: "strong" | "moderate" | "weak";
}

export type AnalyzeResumeResponse =
  | {
      success: true;
      data: ResumeAnalysis;
    }
  | {
      success: false;
      error: string;
    };

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export async function analyzeResume(
  formData: FormData,
): Promise<AnalyzeResumeResponse> {
  try {
    const resumeFile = formData.get("resume");
    const jobDescription = getRequiredString(formData, [
      "description",
      "jobDescription",
      "jd",
    ]);
    const company = formData.get("company") as string | null;
    const jobTitle = formData.get("jobTitle") as string | null;

    if (!(resumeFile instanceof File)) {
      return {
        success: false,
        error: "Please upload a PDF resume before analyzing.",
      };
    }

    const isPdf =
      resumeFile.type === "application/pdf" ||
      resumeFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return {
        success: false,
        error: "Please upload a valid PDF file.",
      };
    }

    if (resumeFile.size > MAX_PDF_SIZE_BYTES) {
      return {
        success: false,
        error: "Please upload a PDF under 10MB.",
      };
    }

    if (!jobDescription) {
      return {
        success: false,
        error: "Please paste the job description before analyzing.",
      };
    }

    console.info("Extracting text from uploaded resume...");
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsedPdf = await PdfParse(buffer);
    const resumeText = parsedPdf.text.trim();

    console.log("Extracted resume text:", resumeText);

    if (!resumeText) {
      return {
        success: false,
        error: "Could not extract text from this PDF. Try another resume file.",
      };
    }

    console.info("Analyzing resume with Gemini...");
    const apiKey =
      process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "Missing GEMINI_API_KEY environment variable.",
      };
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt: buildPrompt(resumeText, jobDescription, company || "Unknown", jobTitle || "Unknown"),
    });

    const analysis = parseAnalysisJson(text);

    if (!analysis) {
      return {
        success: false,
        error: "The AI response was not valid JSON. Please try again.",
      };
    }

    return {
      success: true,
      data: analysis,
    };
  } catch (error) {
    console.error("Resume analysis failed:", error);

    return {
      success: false,
      error: "Something went wrong while analyzing the resume.",
    };
  }
}

function getRequiredString(formData: FormData, keys: string[]): string {
  for (const key of keys) {
    const value = formData.get(key);

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function buildPrompt(resumeText: string, jobDescription: string, company: string, jobTitle: string): string {
  return `
You are a senior ATS (Applicant Tracking System) expert and career coach specializing in helping students and early-career candidates optimize their resumes.

Target Company: ${company}
Target Role: ${jobTitle}

Your task: Analyze the candidate's resume against the provided job description and return a structured evaluation.

---

OUTPUT RULES (strictly follow these):
- Return ONLY raw, valid JSON. No markdown. No code fences. No preamble. No trailing commentary.
- The JSON must exactly match the schema below — no extra keys, no missing keys.
- All string arrays must contain actual strings, not nulls or empty strings.
- If a field has no values (e.g., no missing keywords), return an empty array [].

---

JSON SCHEMA:
{
  "score": number,
  "score_rationale": string,
  "missing_keywords": [string],
  "matched_keywords": [string],
  "actionable_bullets": [
    {
      "original_shortcoming": string,
      "suggested_revision_markdown": string,
      "suggested_revision_latex": string
    }
  ],
  "section_feedback": {
    "summary": string,
    "experience": string,
    "skills": string,
    "education": string
  },
  "overall_verdict": "strong" | "moderate" | "weak"
}

---

FIELD DEFINITIONS:
- score: Integer from 0–100 representing ATS compatibility. Base it on keyword overlap, role relevance, and formatting signals.
- score_rationale: One sentence explaining what drove the score up or down.
- missing_keywords: Skills, tools, certifications, or domain terms in the JD that are absent from the resume. Be specific (e.g., "REST APIs", "Agile/Scrum", "SQL").
- matched_keywords: Skills or terms from the JD that ARE present in the resume. Helps the candidate know what's working.
- actionable_bullets: 3–6 concrete, student-friendly rewrite suggestions. Each must identify an 'original_shortcoming', provide a 'suggested_revision_markdown', and a 'suggested_revision_latex' that is ready for \\item copy-paste into Overleaf. Tailor these for the target company and role.
- section_feedback: A brief 1–2 sentence critique for each standard resume section. If a section is missing entirely, note that.
- overall_verdict: "strong" if score ≥ 75, "moderate" if 50–74, "weak" if below 50.

---

RESUME:
${resumeText}

---

JOB DESCRIPTION:
${jobDescription}
`.trim();
}

function parseAnalysisJson(text: string): ResumeAnalysis | null {
  try {
    const jsonText = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "");
    const parsed: unknown = JSON.parse(jsonText);

    if (!isResumeAnalysis(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function isResumeAnalysis(value: unknown): value is ResumeAnalysis {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.score === "number" &&
    Number.isFinite(value.score) &&
    value.score >= 0 &&
    value.score <= 100 &&
    typeof value.score_rationale === "string" &&
    isStringArray(value.missing_keywords) &&
    isStringArray(value.matched_keywords) &&
    isActionableBulletsArray(value.actionable_bullets) &&
    isSectionFeedback(value.section_feedback) &&
    isOverallVerdict(value.overall_verdict)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSectionFeedback(value: unknown): value is ResumeAnalysis["section_feedback"] {
  return (
    isRecord(value) &&
    typeof value.summary === "string" &&
    typeof value.experience === "string" &&
    typeof value.skills === "string" &&
    typeof value.education === "string"
  );
}

function isActionableBulletsArray(value: unknown): value is ResumeAnalysis["actionable_bullets"] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.original_shortcoming === "string" &&
        typeof item.suggested_revision_markdown === "string" &&
        typeof item.suggested_revision_latex === "string"
    )
  );
}

function isOverallVerdict(value: unknown): value is ResumeAnalysis["overall_verdict"] {
  return value === "strong" || value === "moderate" || value === "weak";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
