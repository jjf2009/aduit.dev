import { AppHeader } from "@/components/app-header";
import { HomePageCard } from "@/components/home-page-card";

export default function Home() {
  const applications = [
    { companyName: "CodeNest", roleName: "Frontend Dev", score: 88, issuesCount: 19, resumeImage: "/exmaple_resume_1.png" },
    { companyName: "LoopStack", roleName: "Backend Developer", score: 43, issuesCount: 38, resumeImage: "/exmaple_resume_2.png" },
    { companyName: "Bytebase", roleName: "15 years experience", score: 68, issuesCount: 27, resumeImage: "/exmaple_resume_3.png" },
    { companyName: "LaunchForge", roleName: "Product Manager", score: 68, issuesCount: 27, resumeImage: "/example_resume_4.png" },
    { companyName: "SyncLayer", roleName: "Full Stack Developer", score: 73, issuesCount: 23, resumeImage: "/example_resume_5.png" },
    { companyName: "Cloudverge", roleName: "DevOps Engineer", score: 47, issuesCount: 38, resumeImage: "/exmaple_resume_1.png" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] relative pb-20">
      {/* Background Image / Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none"
        style={{ backgroundImage: "url('/background-image.png')" }}
      />
      
      <div className="relative z-10 pt-8 px-6 sm:px-8">
        <AppHeader />

        <main className="mx-auto max-w-[1280px] mt-24 flex flex-col items-center">
          <div className="text-center space-y-4 mb-20">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#424248]">
              Track Your Applications
              <br />
              <span className="text-[#64646a]">& Resume Ratings</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-500 max-w-2xl mx-auto pt-4 font-medium">
              Review your submissions and check AI-powered feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full place-items-center">
            {applications.map((app, index) => (
              <HomePageCard
                key={index}
                companyName={app.companyName}
                roleName={app.roleName}
                score={app.score}
                issuesCount={app.issuesCount}
                resumeImage={app.resumeImage}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}