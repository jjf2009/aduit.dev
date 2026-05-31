import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import type { ResumeAnalysis } from "@/app/actions/analyze";
import { cn } from "@/lib/utils";

type AtsScoreCardProps = {
  analysis: ResumeAnalysis;
};

type ScoreTone = "good" | "ok" | "bad";

export function AtsScoreCard({ analysis }: AtsScoreCardProps) {
  const tone = getScoreTone(analysis.score);
  const hasMatchedKeywords = analysis.matched_keywords.length > 0;
  const hasMissingKeywords = analysis.missing_keywords.length > 0;
  const hasSkillsFeedback = analysis.section_feedback.skills.trim().length > 0;

  return (
    <section
      className={cn(
        "rounded-[8px] border p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-7",
        tone === "good" && "border-emerald-100 bg-[#f3fffb]",
        tone === "ok" && "border-orange-100 bg-[#fffaf2]",
        tone === "bad" && "border-red-100 bg-[#fff6f6]",
      )}
    >
      <div className="flex items-center gap-4">
        <StatusBadge tone={tone} />
        <h2 className="text-[24px] font-bold tracking-[-0.04em] text-[#172032]">
          ATS Score - {Math.round(analysis.score)}/100
        </h2>
      </div>

      <div className="mt-7 space-y-5">
        <div className="space-y-3">
          <h3 className="text-[21px] font-medium tracking-[-0.035em] text-[#172032]">
            How well does your resume pass through Applicant Tracking Systems?
          </h3>
          <p className="text-[17px] leading-relaxed tracking-[-0.03em] text-[#56637a]">
            Your resume was scanned like an employer would. Here&apos;s how it performed:
          </p>
        </div>

        <ul className="space-y-3 text-[17px] leading-snug tracking-[-0.03em] text-[#56637a]">
          <StatusLine
            isPositive={analysis.score >= 50}
            label={
              analysis.score >= 50
                ? "Clear formatting, readable by ATS"
                : "Needs clearer formatting for ATS scanning"
            }
          />
          <StatusLine
            isPositive={hasMatchedKeywords && !hasMissingKeywords}
            label={
              hasMissingKeywords
                ? "Missing keywords relevant to the job"
                : "Keywords relevant to the job"
            }
          />
          <StatusLine
            isPositive={hasSkillsFeedback && analysis.overall_verdict === "strong"}
            label={
              hasSkillsFeedback && analysis.overall_verdict === "strong"
                ? "Skills section is aligned with the role"
                : "Skills section needs stronger alignment"
            }
          />
        </ul>

        <p className="text-[17px] leading-relaxed tracking-[-0.03em] text-[#56637a]">
          Want a better score? Improve your resume by applying the suggestions listed below.
        </p>
      </div>
    </section>
  );
}

function StatusBadge({ tone }: { tone: ScoreTone }) {
  const Icon = tone === "good" ? CheckCircle2 : tone === "ok" ? AlertTriangle : XCircle;

  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-[8px] text-white shadow-inner",
        tone === "good" && "bg-gradient-to-br from-[#80d9ca] to-[#337f78]",
        tone === "ok" && "bg-gradient-to-br from-[#ffc178] to-[#df7135]",
        tone === "bad" && "bg-gradient-to-br from-[#f7998f] to-[#bc302d]",
      )}
    >
      <Icon className="size-5" strokeWidth={2.6} />
    </span>
  );
}

function StatusLine({ isPositive, label }: { isPositive: boolean; label: string }) {
  const Icon = isPositive ? CheckCircle2 : AlertTriangle;

  return (
    <li className="flex gap-3">
      <Icon
        className={cn(
          "mt-0.5 size-5 shrink-0",
          isPositive ? "text-[#0ba86d]" : "text-[#ff8a00]",
        )}
        strokeWidth={2.2}
      />
      <span className="break-words">{label}</span>
    </li>
  );
}

function getScoreTone(score: number): ScoreTone {
  if (score >= 75) {
    return "good";
  }

  if (score >= 50) {
    return "ok";
  }

  return "bad";
}
