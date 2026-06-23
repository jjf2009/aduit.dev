// app/login/page.jsx
"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLogin = true;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { supabase } = useAuth();
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${location.origin}/auth/callback` },
        });
        if (error) throw error;
        alert("Check your email for confirmation!");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF5F5] bg-gradient-to-tr from-[#FFE4E6] via-[#F3F4F6] to-[#EEF2FF] p-4 select-none">
      {/* Main Container Card */}
      <div className="w-full max-w-[540px] bg-white/80 backdrop-blur-md rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] px-10 py-12 md:px-16 md:py-16 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-semibold tracking-tight text-center mb-2">
            <span className="bg-gradient-to-r from-[#A78B93] via-[#4E5BA6] to-[#8FA3D4] bg-clip-text text-transparent font-bold">
              Welcome Back
            </span>
          </h2>
          <p className="mt-3 text-sm font-normal text-slate-500 tracking-wide">
            Log In to Continue Your Job Journey
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 rounded-xl bg-red-50 p-3 border border-red-100">
            <div className="text-xs text-red-600 text-center font-medium">
              {error}
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form className="w-full space-y-6" onSubmit={handleEmailAuth}>
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-slate-500 block pl-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                placeholder="Enter your email address"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-500 block pl-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white text-sm font-semibold rounded-full shadow-[0_4px_12px_rgba(99,102,241,0.3)] transition-all transform active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
      </div>

      {/* Outer Footnote Switcher */}
      <p className="mt-6 text-sm text-slate-500 font-normal">
        Don’t have an account? 
        <button
          onClick={() => router.push("/signup")}
          className="font-semibold text-[#6366F1] hover:underline transition-all"
        >Sign Up</button>
      </p>
    </div>
  );
}
