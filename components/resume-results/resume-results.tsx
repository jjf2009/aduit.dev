"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ResumeAnalysis } from "@/app/actions/analyze";
import { AtsScoreCard } from "@/components/resume-results/ats-score-card";
import {
  FeedbackItem,
  FeedbackSection,
} from "@/components/resume-results/feedback-section";
import { ScoreOverviewCard } from "@/components/resume-results/score-overview-card";
import { LatexCopierCard } from "@/components/resume-results/latex-copier-card";

type ResumeResultsProps = {
  analysis: ResumeAnalysis;
};

const sectionLabels: Array<keyof ResumeAnalysis["section_feedback"]> = [
  "summary",
  "experience",
  "skills",
  "education",
];

export function ResumeResults({ analysis }: ResumeResultsProps) {
  const [viewMode, setViewMode] = useState<"feedback" | "export">("feedback");

  const missingKeywordItems = analysis.missing_keywords.map<FeedbackItem>((keyword) => ({
    body: "Add this keyword only where it honestly matches your experience and the job description.",
    title: keyword,
    tone: "warning",
  }));

  const matchedKeywordItems = analysis.matched_keywords.map<FeedbackItem>((keyword) => ({
    body: "This keyword already helps your resume line up with the role.",
    title: keyword,
    tone: "positive",
  }));

  const actionableItems = analysis.actionable_bullets.map<FeedbackItem>((item, index) => ({
    title: `Fix ${index + 1}`,
    body: `${item.original_shortcoming} -> ${item.suggested_revision_markdown}`,
    tone: "warning",
  }));

  const sectionFeedbackItems = sectionLabels.map<FeedbackItem>((section) => ({
    title: titleCase(section),
    body: analysis.section_feedback[section],
    tone: section === "skills" && analysis.missing_keywords.length > 0 ? "warning" : "positive",
  }));

  return (
    <section className="space-y-6">
      <div className="flex justify-center mb-2">
        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setViewMode("feedback")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              viewMode === "feedback"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            Feedback & Metrics
          </button>
          <button
            onClick={() => setViewMode("export")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              viewMode === "export"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            Optimization Export
          </button>
        </div>
      </div>

      {viewMode === "feedback" ? (
        <>
          <ScoreOverviewCard analysis={analysis} />
          <AtsScoreCard analysis={analysis} />

          <div className="rounded-[8px] border border-[#edf0f5] bg-white px-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:px-7">
            <FeedbackSection
              defaultOpen
              items={actionableItems}
              scoreLabel={`${analysis.actionable_bullets.length} fixes`}
              title="Resume Improvement Checklist"
            />
            <FeedbackSection
              items={missingKeywordItems}
              scoreLabel={`${analysis.missing_keywords.length} missing`}
              title="Missing Keywords"
            />
            <FeedbackSection
              items={matchedKeywordItems}
              scoreLabel={`${analysis.matched_keywords.length} matched`}
              title="Matched Keywords"
            />
            <FeedbackSection
              items={sectionFeedbackItems}
              title="Section Feedback"
            />
          </div>
        </>
      ) : (
        <LatexCopierCard bullets={analysis.actionable_bullets} />
      )}
    </section>
  );
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
