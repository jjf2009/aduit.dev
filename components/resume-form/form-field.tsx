import { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type FormFieldProps = {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
  label: string;
};

export function FormField({
  children,
  className,
  htmlFor,
  label,
}: FormFieldProps) {
  return (
    <label className={className} htmlFor={htmlFor}>
      <span className="mb-2 block text-[16px] font-medium tracking-[-0.04em] text-[#485774] sm:text-[18px]">
        {label}
      </span>
      {children}
    </label>
  );
}

type TextInputProps = ComponentPropsWithoutRef<"input">;

export function TextInput({ className, ...props }: TextInputProps) {
  return (
    <input
      className={cn(
        "h-14 w-full rounded-2xl border border-[#e8efff] bg-white px-5 text-[20px] font-semibold tracking-[-0.045em] text-[#162033] shadow-[0_0_18px_rgba(83,119,190,0.12)] outline-none placeholder:text-[#96a1b8] focus:border-[#b8c6ff] focus:ring-4 focus:ring-[#6677ff]/15 disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

type TextAreaProps = ComponentPropsWithoutRef<"textarea">;

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        "min-h-[116px] w-full resize-y rounded-2xl border border-[#e8efff] bg-white px-5 py-4 text-[20px] font-medium leading-snug tracking-[-0.045em] text-[#162033] shadow-[0_0_18px_rgba(83,119,190,0.12)] outline-none placeholder:text-[#99a4bb] focus:border-[#b8c6ff] focus:ring-4 focus:ring-[#6677ff]/15 disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}
