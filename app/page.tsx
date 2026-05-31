import { AppHeader } from "@/components/app-header";
import { HeroSection } from "@/components/hero-section";
import { ResumeForm } from "@/components/resume-form/resume-form";

export default function Home() {
  return (
    <div
      className="flex h-screen max-h-screen flex-col overflow-hidden bg-cover bg-top bg-no-repeat px-4 py-4 text-[#172032] sm:px-6 lg:px-10"
      style={{ backgroundImage: "url('/background-image.png')" }}
    >
      <AppHeader />

      <main className="mx-auto grid min-h-0 w-full max-w-[1144px] flex-1 items-center gap-6 py-5 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
        <HeroSection />
        <ResumeForm />
      </main>
    </div>
  );
}
