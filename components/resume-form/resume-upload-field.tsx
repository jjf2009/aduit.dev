"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { FileCheck2, FileUp, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ResumeUploadFieldProps = {
  disabled?: boolean;
  error?: string;
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
};

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export function ResumeUploadField({
  disabled = false,
  error,
  onFileChange,
  selectedFile,
}: ResumeUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file: File | null) {
    onFileChange(file);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0] ?? null);
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();

    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) {
      return;
    }

    const file = event.dataTransfer.files[0] ?? null;
    handleFile(file);

    if (inputRef.current && file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputRef.current.files = dataTransfer.files;
    }
  }

  function clearFile() {
    handleFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const fileSizeText = selectedFile
    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`
    : "PDF (max. 10MB)";

  return (
    <div className="sm:col-span-2">
      <span
        className="mb-2 block text-[16px] font-medium tracking-[-0.04em] text-[#485774] sm:text-[18px]"
        id="resume-upload-label"
      >
        Upload Resume
      </span>
      <label
        aria-describedby={error ? "resume-upload-error" : undefined}
        aria-labelledby="resume-upload-label"
        className={cn(
          "relative flex min-h-[168px] cursor-pointer items-center justify-center rounded-[28px] bg-[#dfe6ff] p-3 shadow-[inset_0_0_20px_rgba(103,124,202,0.2)] transition",
          isDragging && "bg-[#cfd9ff] ring-4 ring-[#6677ff]/15",
          disabled && "cursor-not-allowed opacity-70",
          error && "bg-red-100 ring-2 ring-red-200",
        )}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          accept="application/pdf,.pdf"
          className="sr-only"
          disabled={disabled}
          onChange={handleInputChange}
          ref={inputRef}
          name="resume"
          type="file"
        />
        <div className="flex h-full w-full flex-col items-center justify-center rounded-[22px] bg-white px-4 py-2 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-gradient-to-b from-[#969ba6] to-[#4d4f59] shadow-[0_12px_24px_rgba(41,45,58,0.2)]">
            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-b from-white to-[#c6c9d1]">
              {selectedFile ? (
                <FileCheck2
                  aria-hidden="true"
                  className="size-5 text-[#6677ff]"
                  strokeWidth={3}
                />
              ) : (
                <FileUp
                  aria-hidden="true"
                  className="size-5 text-[#70747c]"
                  strokeWidth={3}
                />
              )}
            </div>
          </div>
          <p className="max-w-full break-words text-[20px] font-medium tracking-[-0.045em] text-[#485774]">
            {selectedFile ? (
              <span className="font-bold">{selectedFile.name}</span>
            ) : (
              <>
                <span className="font-bold">Click to upload</span> or drag and
                drop
              </>
            )}
          </p>
          <p className="mt-1 text-[16px] font-medium tracking-[-0.045em] text-[#485774]">
            {selectedFile && selectedFile.size > MAX_PDF_SIZE_BYTES
              ? "File is over 10MB"
              : fileSizeText}
          </p>
          {selectedFile ? (
            <button
              aria-label="Remove selected resume"
              className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-white text-[#485774] shadow-[0_6px_14px_rgba(83,119,190,0.16)] transition hover:text-red-500 disabled:cursor-not-allowed"
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                clearFile();
              }}
              type="button"
            >
              <X
                aria-hidden="true"
                className="size-4"
                strokeWidth={2.5}
              />
            </button>
          ) : null}
        </div>
      </label>
      {error ? (
        <p
          className="mt-2 text-sm font-medium tracking-[-0.03em] text-red-600"
          id="resume-upload-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
