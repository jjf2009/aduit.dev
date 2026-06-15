export function HeroSection() {
  return (
    <section className="text-center  flex items-center flex-col py-5 mt-3">
      <h1 className="max-w-[780px] text-[44px] font-semibold leading-[0.98] tracking-[-0.06em] text-[#0f1420] sm:text-[60px] lg:text-[72px]">
        <span className="bg-gradient-to-r from-[#9c7b80] via-[#05070b] to-[#858cb9] bg-clip-text text-transparent">
          Smart feedback
        </span>
        <br />
        <span className="bg-gradient-to-r from-[#9c7b80] via-[#05070b] to-[#858cb9] bg-clip-text text-transparent">
          for your dream job
        </span>
      </h1>
      <p className="mt-5 max-w-[520px] text-[20px] font-medium tracking-[-0.04em] text-[#4a5870] sm:text-[24px] lg:mx-0">
        Drop your resume for an ATS score and improvement tips.
      </p>
    </section>
  );
}
