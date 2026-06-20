import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="mx-auto flex h-16 w-full max-w-[1144px] shrink-0 items-center justify-between rounded-full bg-white px-6 shadow-[0_16px_45px_rgba(132,154,214,0.08)] sm:px-8">
      <div className="text-[18px] font-black tracking-[-0.04em] text-[#625967]">
      <Link href="/"> AUDIT </Link>
      </div>
      <Button
        className="h-auto rounded-full bg-[#6677ff] px-5 py-2.5 text-[16px] font-medium normal-case tracking-normal text-white shadow-[0_6px_12px_rgba(77,93,219,0.28)] transition hover:bg-[#5d6df2]"
        type="button"
        asChild
      >
        <Link href="/dashboard">Upload Resume</Link>
      </Button>
    </header>
  );
}
