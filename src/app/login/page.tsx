"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";

const ROLES = [
  "Fleet Manager",
  "Dispatcher",
  "Safety Officer",
  "Financial Analyst",
] as const;

const ROLE_ACCESS: Record<string, string> = {
  "Fleet Manager": "Fleet, Maintenance",
  Dispatcher: "Dashboard, Trips",
  "Safety Officer": "Drivers, Compliance",
  "Financial Analyst": "Fuel & Expenses, Analytics",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const fillDemo = (roleName: string) => {
    const roleMap: Record<string, string> = {
      "Fleet Manager": "fleet.manager@transitops.in",
      "Dispatcher": "dispatcher@transitops.in",
      "Safety Officer": "safety.officer@transitops.in",
      "Financial Analyst": "financial.analyst@transitops.in"
    };
    setEmail(roleMap[roleName]);
    setPassword("Transit@2026");
    setRole(roleName);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-950 animate-[loginFadeIn_0.6s_ease-out]">
      {/* ── Left branding panel ──────────────────────────────────────── */}
      <aside className="flex w-full md:w-[42%] min-w-[340px] flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900 p-8 md:p-12">
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10 p-2">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="h-full w-full"
              >
                <rect x="2" y="2" width="12" height="12" rx="2" fill="#d4910a" opacity="0.9" />
                <rect x="18" y="2" width="12" height="12" rx="2" fill="#d4910a" opacity="0.5" />
                <rect x="2" y="18" width="12" height="12" rx="2" fill="#d4910a" opacity="0.5" />
                <rect x="18" y="18" width="12" height="12" rx="2" fill="#d4910a" opacity="0.3" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">TransitOps</h1>
              <p className="mt-0.5 text-sm text-slate-400">
                Smart Transport Operations Platform
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-xs uppercase tracking-wider text-slate-500 mt-12 md:mt-0">
          TransitOps © {new Date().getFullYear()} · RBAC ENQ
        </footer>
      </aside>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <main className="flex flex-1 items-center justify-center bg-slate-950 p-8 md:p-12">
        <div className="w-full max-w-[420px]">
          <h2 className="mb-1 text-2xl font-bold text-white">Sign in to your account</h2>
          <p className="mb-7 text-sm text-slate-400">
            Enter your credentials to continue
          </p>

          <form action={formAction} className="flex flex-col gap-5">
            {/* Error banner */}
            {state.error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-[loginShake_0.35s_ease-out]" role="alert">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{state.error}</span>
              </div>
            )}

            {/* Quick Demo Access */}
            <div>
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Quick Demo Access</p>
              <div className="flex flex-wrap">
                <button type="button" onClick={() => fillDemo("Fleet Manager")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 rounded-full px-3 py-1 mr-2 mb-4">Fleet Mgr</button>
                <button type="button" onClick={() => fillDemo("Dispatcher")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 rounded-full px-3 py-1 mr-2 mb-4">Dispatcher</button>
                <button type="button" onClick={() => fillDemo("Safety Officer")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 rounded-full px-3 py-1 mr-2 mb-4">Safety</button>
                <button type="button" onClick={() => fillDemo("Financial Analyst")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 rounded-full px-3 py-1 mr-2 mb-4">Finance</button>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="raven.k@transitops.in"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-role" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Role (RBAC)
              </label>
              <div className="relative">
                <select
                  id="login-role"
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/50 px-3.5 py-2.5 pr-10 text-sm text-slate-200 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">
                    Select your role
                  </option>
                  {ROLES.map((role) => (
                    <option key={role} value={role} className="bg-slate-900 text-slate-200">
                      {role}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-not-allowed items-center gap-2 opacity-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-not-allowed accent-amber-500"
                  disabled
                />
                <span className="text-sm text-slate-300">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-amber-500 opacity-60 transition-opacity hover:opacity-80 cursor-not-allowed"
                title="Coming soon"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-1 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-orange-400 hover:-translate-y-px hover:shadow-amber-500/30 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      className="opacity-100"
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-xs text-slate-500 mt-6 text-center">Demo credentials also available in README.md</p>
        </div>
      </main>
    </div>
  );
}
