"use client";

import { FormEvent, useState, useTransition } from "react";

import {
  analyzeResume,
  AnalyzeResumeResponse,
} from "@/app/actions/analyze";
import { Button } from "@/components/ui/button";
import {
  FormField,
  TextArea,
  TextInput,
} from "@/components/resume-form/form-field";
import { ResumeUploadField } from "@/components/resume-form/resume-upload-field";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export function ResumeForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalyzeResumeResponse | null>(null);
  const [formError, setFormError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleFileChange(file: File | null) {
    setSelectedFile(file);
    setResult(null);

    if (!file) {
      setUploadError("");
      return;
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setUploadError("Please upload a PDF file.");
      return;
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      setUploadError("Please upload a PDF under 10MB.");
      return;
    }

    setUploadError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const jobDescription = String(formData.get("description") ?? "").trim();

    setResult(null);
    setFormError("");

    if (!selectedFile) {
      setUploadError("Please upload a PDF resume.");
      return;
    }

    if (uploadError) {
      return;
    }

    if (!jobDescription) {
      setFormError("Paste the job description before analyzing.");
      return;
    }

    setLoadingMessage("Extracting text from your PDF...");

    startTransition(() => {
      void submitResume(formData);
    });
  }

  async function submitResume(formData: FormData) {
    setLoadingMessage("Analyzing with AI...");

    const response = await analyzeResume(formData);

    setResult(response);
    setLoadingMessage("");

    if (!response.success) {
      setFormError(response.error);
    }
  }

  const isBusy = isPending || Boolean(loadingMessage);

  return (
    <form className="min-h-0 w-full" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField className="block" htmlFor="company" label="Company Name">
          <TextInput
            defaultValue="JavaScript Mastery"
            disabled={isBusy}
            id="company"
            name="company"
            type="text"
          />
        </FormField>

        <FormField className="block" htmlFor="jobTitle" label="Job Title">
          <TextInput
            defaultValue="Frontend Developer"
            disabled={isBusy}
            id="jobTitle"
            name="jobTitle"
            type="text"
          />
        </FormField>

        <FormField
          className="block sm:col-span-2"
          htmlFor="description"
          label="Job Description"
        >
          <TextArea
            disabled={isBusy}
            id="description"
            name="description"
            placeholder="Write a clear & concise job description with responsibilities & expectations..."
            required
          />
        </FormField>

        <ResumeUploadField
          disabled={isBusy}
          error={uploadError}
          onFileChange={handleFileChange}
          selectedFile={selectedFile}
        />
      </div>

      {formError ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium tracking-[-0.03em] text-red-700">
          {formError}
        </p>
      ) : null}

      <Button
        className="mt-5 h-14 w-full rounded-full bg-[#6677ff] text-[18px] font-bold normal-case tracking-[-0.045em] text-white shadow-[0_8px_14px_rgba(77,93,219,0.22)] transition hover:bg-[#5d6df2]"
        disabled={isBusy}
        type="submit"
      >
        {loadingMessage || "Save & Analyze Resume"}
      </Button>

      {result?.success ? (
        <section className="mt-5 rounded-[24px] border border-[#e8efff] bg-white/90 p-5 shadow-[0_0_18px_rgba(83,119,190,0.12)]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#6677ff]">
                ATS Score
              </p>
              <p className="text-4xl font-bold tracking-[-0.06em] text-[#162033]">
                {Math.round(result.data.score)}
                <span className="text-xl text-[#667085]">/100</span>
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <ResultList
              items={result.data.missing_keywords}
              title="Missing Keywords"
            />
            <ResultList
              items={result.data.actionable_bullets}
              title="Actionable Fixes"
            />
          </div>
        </section>
      ) : null}
    </form>
  );
}

type ResultListProps = {
  items: string[];
  title: string;
};

function ResultList({ items, title }: ResultListProps) {
  return (
    <div>
      <h2 className="text-[18px] font-bold tracking-[-0.045em] text-[#162033]">
        {title}
      </h2>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-2 text-[15px] font-medium leading-snug tracking-[-0.03em] text-[#485774]">
          {items.map((item) => (
            <li className="break-words rounded-xl bg-[#f5f7ff] px-3 py-2" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl bg-[#f5f7ff] px-3 py-2 text-[15px] font-medium tracking-[-0.03em] text-[#485774]">
          Nothing major found here.
        </p>
      )}
    </div>
  );
}
