import { useState } from "react";
import { Copy, Check, Code, FileText } from "lucide-react";
import type { ResumeAnalysis } from "@/app/actions/analyze";
import { cn } from "@/lib/utils";

type LatexCopierCardProps = {
  bullets: ResumeAnalysis["actionable_bullets"];
};

export function LatexCopierCard({ bullets }: LatexCopierCardProps) {
  const [format, setFormat] = useState<"latex" | "markdown">("latex");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Optimization Export</h3>
          <p className="text-sm text-gray-500">Copy these revised bullets directly into your resume.</p>
        </div>
        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setFormat("latex")}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              format === "latex"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Code className="h-4 w-4" />
            LaTeX
          </button>
          <button
            onClick={() => setFormat("markdown")}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              format === "markdown"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            )}
          >
            <FileText className="h-4 w-4" />
            Markdown
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {bullets.map((bullet, index) => (
          <SnippetCard 
            key={index} 
            bullet={bullet} 
            format={format} 
            index={index + 1} 
          />
        ))}
        {bullets.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-500 shadow-sm">
            No actionable revisions generated.
          </div>
        )}
      </div>
    </div>
  );
}

function SnippetCard({
  bullet,
  format,
  index,
}: {
  bullet: ResumeAnalysis["actionable_bullets"][number];
  format: "latex" | "markdown";
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  
  const contentToCopy =
    format === "latex"
      ? bullet.suggested_revision_latex
      : bullet.suggested_revision_markdown;

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
        <h4 className="text-sm font-semibold text-gray-700">Fix {index}: Original Shortcoming</h4>
        <p className="mt-1 text-sm text-gray-600 leading-relaxed">{bullet.original_shortcoming}</p>
      </div>
      <div className="group relative bg-[#0d1117] p-5">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 rounded-md bg-white/10 p-2 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/20 hover:text-white"
          title="Copy to clipboard"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </button>
        <pre className="overflow-x-auto pr-10 text-[13px] leading-relaxed text-gray-300 font-mono">
          <code>{contentToCopy}</code>
        </pre>
      </div>
    </div>
  );
}
