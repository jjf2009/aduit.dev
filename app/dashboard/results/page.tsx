"use client";

import { useEffect, useState } from "react";
import { ResumeResults } from "@/components/resume-results/resume-results";
import { type ResumeAnalysis } from "@/app/actions/analyze";
import { getPdf } from "@/lib/storage";

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("resumeAnalysisResult");
    if (data) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAnalysis(JSON.parse(data));
      } catch (e) {
        console.error(e);
      }
    }

    getPdf()
      .then((file) => {
        if (file) {
          const url = URL.createObjectURL(file);
          setPdfUrl(url);
        }
      })
      .catch((e) => console.error("Failed to load PDF", e));
  }, []);

  if (!analysis) {
    return <div className="p-8 text-center">Loading or no data available...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-80px)] w-full gap-6 p-6">
      <div className="w-1/2 overflow-hidden rounded-xl border border-[#e7ebf1] bg-gray-50 shadow-sm">
        {pdfUrl ? (
          <object data={pdfUrl} type="application/pdf" className="h-full w-full">
            <p className="p-4 text-center text-gray-500">
              Your browser does not support PDFs.
            </p>
          </object>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No resume file found.
          </div>
        )}
      </div>
      <div className="w-1/2 overflow-y-auto pr-2 pb-10">
        <ResumeResults analysis={analysis} />
      </div>
    </div>
  );
}