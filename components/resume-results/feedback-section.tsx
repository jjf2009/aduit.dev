import { AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type FeedbackItemTone = "positive" | "warning";

export type FeedbackItem = {
  body?: string;
  tags?: string[];
  title: string;
  tone: FeedbackItemTone;
};

type FeedbackSectionProps = {
  defaultOpen?: boolean;
  items: FeedbackItem[];
  scoreLabel?: string;
  title: string;
};

export function FeedbackSection({
  defaultOpen = true,
  items,
  scoreLabel,
  title,
}: FeedbackSectionProps) {
  return (
    <details className="group border-b border-[#e7ebf1] py-5" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h3 className="text-[22px] font-bold tracking-[-0.045em] text-[#172032]">
            {title}
          </h3>
          {scoreLabel ? (
            <span className="rounded-full bg-[#fde8e6] px-2.5 py-1 text-xs font-bold tracking-[-0.02em] text-[#a93e38]">
              {scoreLabel}
            </span>
          ) : null}
        </div>
        <ChevronDown className="size-5 shrink-0 text-[#98a2b3] transition group-open:rotate-180" />
      </summary>

      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => <FeedbackCard item={item} key={item.title} />)
        ) : (
          <p className="rounded-[8px] bg-[#f8fafc] px-4 py-3 text-[15px] font-medium tracking-[-0.03em] text-[#64748b]">
            Nothing major found here.
          </p>
        )}
      </div>
    </details>
  );
}

function FeedbackCard({ item }: { item: FeedbackItem }) {
  const Icon = item.tone === "positive" ? CheckCircle2 : AlertTriangle;

  return (
    <article
      className={cn(
        "rounded-[8px] border px-4 py-3",
        item.tone === "positive" && "border-[#9be8c2] bg-[#effdf7]",
        item.tone === "warning" && "border-[#ffd38a] bg-[#fffaf0]",
      )}
    >
      <div className="flex gap-2.5">
        <Icon
          className={cn(
            "mt-0.5 size-4 shrink-0",
            item.tone === "positive" ? "text-[#0ba86d]" : "text-[#f59e0b]",
          )}
          strokeWidth={2.4}
        />
        <div className="min-w-0">
          <h4
            className={cn(
              "break-words text-[15px] font-bold tracking-[-0.03em]",
              item.tone === "positive" ? "text-[#0f8f62]" : "text-[#c46a1b]",
            )}
          >
            {item.title}
          </h4>
          {item.body ? (
            <p className="mt-2 break-words text-[14px] leading-relaxed tracking-[-0.025em] text-[#56637a]">
              {item.body}
            </p>
          ) : null}
          {item.tags && item.tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  className="rounded-full border border-[#94e2bd] bg-white px-2.5 py-1 text-xs font-bold tracking-[-0.02em] text-[#0f8f62]"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
