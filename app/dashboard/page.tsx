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
      <HeroSection />
      <main className="flex justify-center w-full">
        <div className="mx-auto w-full max-w-[600px]">
          <ResumeForm  />{" "}
          {/* Adjust max-w as needed */}
        </div>
      </main>
    </div>
  );
}
