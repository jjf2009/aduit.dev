"use client";

import { FormEvent, useState, useTransition } from "react";

import {
  analyzeResume,
  type AnalyzeResumeResponse,
} from "@/app/actions/analyze";
import { ResumeResults } from "@/components/resume-results/resume-results";
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
    console.log("Analyze response:", response);
    setResult(response);
    setLoadingMessage("");

    if (!response.success) {
      setFormError(response.error);
    }
  }

  const isBusy = isPending || Boolean(loadingMessage);

  return (
    <form className="max-h-full min-h-0 w-full overflow-y-auto pr-1" onSubmit={handleSubmit}>
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
        <div className="mt-6">
          <ResumeResults analysis={result.data} />
        </div>
      ) : null}
    </form>
  );
}
