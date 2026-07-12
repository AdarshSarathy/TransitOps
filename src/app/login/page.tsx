"use client";

import { useActionState } from "react";
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

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-950 animate-[loginFadeIn_0.6s_ease-out]">
      {/* ── Left branding panel ──────────────────────────────────────── */}
      <aside className="flex w-full md:w-[42%] min-w-[340px] flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900 p-8 md:p-12">
        <div className="flex flex-col gap-14">
          {/* Logo */}
          <div className="flex items-center gap-4">
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

          {/* Role list */}
          <div className="hidden md:block pl-1">
            <p className="mb-3 text-sm font-medium text-slate-300">One login, four roles:</p>
            <ul className="flex flex-col gap-2.5">
              {ROLES.map((role) => (
                <li key={role} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(212,145,10,0.4)]" />
                  {role}
                </li>
              ))}
            </ul>
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
                  defaultValue=""
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

          {/* Access scope legend */}
          <div className="mt-8 border-t border-slate-800 pt-5">
            <p className="mb-2 text-xs text-slate-400">
              Access is scoped by role after login:
            </p>
            <ul className="flex flex-col gap-1">
              {Object.entries(ROLE_ACCESS).map(([role, access]) => (
                <li key={role} className="flex gap-1.5 text-xs text-slate-500">
                  <span className="font-medium text-slate-400">{role}</span>
                  <span className="text-amber-500">→</span>
                  <span className="italic text-slate-500">{access}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
