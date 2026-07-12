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
    <div className="login-shell">
      {/* ── Left branding panel ──────────────────────────────────────── */}
      <aside className="login-brand">
        <div className="login-brand__inner">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo__icon">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="login-logo__svg"
              >
                <rect
                  x="2"
                  y="2"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#d4910a"
                  opacity="0.9"
                />
                <rect
                  x="18"
                  y="2"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#d4910a"
                  opacity="0.5"
                />
                <rect
                  x="2"
                  y="18"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#d4910a"
                  opacity="0.5"
                />
                <rect
                  x="18"
                  y="18"
                  width="12"
                  height="12"
                  rx="2"
                  fill="#d4910a"
                  opacity="0.3"
                />
              </svg>
            </div>
            <div>
              <h1 className="login-logo__title">TransitOps</h1>
              <p className="login-logo__subtitle">
                Smart Transport Operations Platform
              </p>
            </div>
          </div>

          {/* Role list */}
          <div className="login-roles">
            <p className="login-roles__heading">One login, four roles:</p>
            <ul className="login-roles__list">
              {ROLES.map((role) => (
                <li key={role} className="login-roles__item">
                  <span className="login-roles__dot" />
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <footer className="login-brand__footer">
          TransitOps © {new Date().getFullYear()} · RBAC ENQ
        </footer>
      </aside>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <main className="login-form-panel">
        <div className="login-form-wrapper">
          <h2 className="login-form__title">Sign in to your account</h2>
          <p className="login-form__subtitle">
            Enter your credentials to continue
          </p>

          <form action={formAction} className="login-form">
            {/* Error banner */}
            {state.error && (
              <div className="login-error" role="alert">
                <svg
                  className="login-error__icon"
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
            <div className="login-field">
              <label htmlFor="login-email" className="login-label">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="raven.k@transitops.in"
                className="login-input"
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="login-password" className="login-label">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="login-input"
              />
            </div>

            {/* Role */}
            <div className="login-field">
              <label htmlFor="login-role" className="login-label">
                Role (RBAC)
              </label>
              <div className="login-select-wrapper">
                <select
                  id="login-role"
                  name="role"
                  required
                  defaultValue=""
                  className="login-select"
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <svg
                  className="login-select__chevron"
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
            <div className="login-extras">
              <label className="login-remember">
                <input
                  type="checkbox"
                  className="login-remember__checkbox"
                  disabled
                />
                <span className="login-remember__text">Remember me</span>
              </label>
              <button
                type="button"
                className="login-forgot"
                title="Coming soon"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="login-submit"
            >
              {isPending ? (
                <span className="login-submit__loading">
                  <svg className="login-spinner" viewBox="0 0 24 24">
                    <circle
                      className="login-spinner__track"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      className="login-spinner__arc"
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
          <div className="login-scope">
            <p className="login-scope__title">
              Access is scoped by role after login:
            </p>
            <ul className="login-scope__list">
              {Object.entries(ROLE_ACCESS).map(([role, access]) => (
                <li key={role} className="login-scope__item">
                  <span className="login-scope__role">{role}</span>
                  <span className="login-scope__arrow">→</span>
                  <span className="login-scope__access">{access}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
