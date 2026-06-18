import React from "react";
import { cn } from "@/lib/utils";

export interface HomePageCardProps {
  companyName: string;
  roleName: string;
  score: number;
  issuesCount: number;
  resumeImage: string;
  className?: string;
}

export function HomePageCard({
  companyName,
  roleName,
  score,
  issuesCount,
  resumeImage,
  className,
}: HomePageCardProps) {
  // Calculate the circumference for the progress ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={cn(
        "flex flex-col bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 w-full max-w-lg border border-slate-100",
        className
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col space-y-1">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            {companyName}
          </h2>
          <p className="text-xl text-slate-500">{roleName}</p>
        </div>

        <div className="relative flex items-center justify-center w-28 h-28">
          {/* SVG Progress Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <defs>
              <linearGradient
                id="score-gradient"
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
                <stop offset="50%" stopColor="#8b5cf6" /> {/* Purple */}
                <stop offset="100%" stopColor="#f43f5e" /> {/* Pink */}
              </linearGradient>
            </defs>
            {/* Background track */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="8"
            />
            {/* Progress track */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              stroke="url(#score-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-800">
              {score}/100
            </span>
            <span className="text-sm text-slate-500">{issuesCount} issues</span>
          </div>
        </div>
      </div>

      {/* Resume Preview Area */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner p-4">
        {/* We wrap the image in a styled container that mimics a glowing/floating paper */}
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resumeImage}
            alt={`${roleName} resume example`}
            className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
          />
          {/* Fading overlay at bottom to suggest scrolling/more content */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
