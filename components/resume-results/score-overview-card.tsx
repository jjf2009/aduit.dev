import type { ResumeAnalysis } from "@/app/actions/analyze";
import { cn } from "@/lib/utils";

type ScoreOverviewCardProps = {
  analysis: ResumeAnalysis;
};

export function ScoreOverviewCard({ analysis }: ScoreOverviewCardProps) {
  const score = Math.round(analysis.score);
  const issueCount =
    analysis.missing_keywords.length + analysis.actionable_bullets.length;

  return (
    <section className="rounded-[8px] border border-[#edf0f5] bg-white p-5 shadow-[0_18px_45px_rgba(20,33,61,0.08)] sm:p-7">
      <div className="grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center">
        <div className="relative h-[100px] w-[150px]" aria-label={`Resume score ${score} out of 100`}>
          <div
            className="absolute inset-x-0 top-0 h-[80px] rounded-t-full"
            style={{
              background: `conic-gradient(from 270deg at 50% 100%, #9b7cf0 0deg, #f4779d ${
                score * 1.8
              }deg, #edf0f5 ${score * 1.8}deg, #edf0f5 180deg, transparent 180deg)`,
            }}
          />
          <div className="absolute inset-x-[20px] top-[20px] h-[60px] rounded-t-full bg-white" />
          <div className="absolute inset-x-0 top-[42px] text-center">
            <p className="text-[22px] font-bold tracking-[-0.045em] text-[#172032]">
              {score}/100
            </p>
            <p className="text-[14px] font-medium tracking-[-0.03em] text-[#56637a]">
              {issueCount} issues
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-[26px] font-bold tracking-[-0.045em] text-[#172032]">
            Your Resume Score
          </h2>
          <p className="mt-2 max-w-[620px] text-[17px] leading-relaxed tracking-[-0.03em] text-[#56637a]">
            {analysis.score_rationale}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <ScoreRow
          label="Verdict"
          value={titleCase(analysis.overall_verdict)}
          tone={analysis.overall_verdict}
        />
        <ScoreRow
          label="Matched Keywords"
          value={`${analysis.matched_keywords.length}`}
          tone="strong"
        />
        <ScoreRow
          label="Missing Keywords"
          value={`${analysis.missing_keywords.length}`}
          tone={analysis.missing_keywords.length > 0 ? "weak" : "strong"}
        />
        <ScoreRow
          label="Action Items"
          value={`${analysis.actionable_bullets.length}`}
          tone={analysis.actionable_bullets.length > 0 ? "moderate" : "strong"}
        />
      </div>
    </section>
  );
}

type ScoreRowProps = {
  label: string;
  value: string;
  tone: ResumeAnalysis["overall_verdict"];
};

function ScoreRow({ label, value, tone }: ScoreRowProps) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 rounded-[8px] bg-[#fafafa] px-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="break-words text-[18px] font-semibold tracking-[-0.04em] text-[#172032]">
          {label}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-bold tracking-[-0.02em]",
            tone === "strong" && "bg-[#dff7ef] text-[#0b7454]",
            tone === "moderate" && "bg-[#fff0dc] text-[#a35a14]",
            tone === "weak" && "bg-[#fde5e3] text-[#a93e38]",
          )}
        >
          {tone === "strong" ? "Strong" : tone === "moderate" ? "Good Start" : "Needs work"}
        </span>
      </div>
      <span
        className={cn(
          "shrink-0 text-[22px] font-bold tracking-[-0.045em]",
          tone === "strong" && "text-[#0b7454]",
          tone === "moderate" && "text-[#e8791a]",
          tone === "weak" && "text-[#d6453d]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
