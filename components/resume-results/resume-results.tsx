import type { ResumeAnalysis } from "@/app/actions/analyze";
import { AtsScoreCard } from "@/components/resume-results/ats-score-card";
import {
  FeedbackItem,
  FeedbackSection,
} from "@/components/resume-results/feedback-section";
import { ScoreOverviewCard } from "@/components/resume-results/score-overview-card";

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
    body: item,
    tone: "warning",
  }));

  const sectionFeedbackItems = sectionLabels.map<FeedbackItem>((section) => ({
    title: titleCase(section),
    body: analysis.section_feedback[section],
    tone: section === "skills" && analysis.missing_keywords.length > 0 ? "warning" : "positive",
  }));

  return (
    <section className="space-y-6">
      <ScoreOverviewCard analysis={analysis} />
      <AtsScoreCard analysis={analysis} />

      <div className="rounded-[8px] bg-white">
        <FeedbackSection
          defaultOpen
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
        <FeedbackSection
          items={actionableItems}
          scoreLabel={`${analysis.actionable_bullets.length} fixes`}
          title="Resume Improvement Checklist"
        />
      </div>
    </section>
  );
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
