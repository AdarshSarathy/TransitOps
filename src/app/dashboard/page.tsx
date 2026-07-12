import { getSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e0e0e0]">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-[#1e1e2e] px-8 py-4">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Transit<span className="text-[#d4910a]">Ops</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-[#9ca3af]">{session.email}</p>
            <span className="inline-block mt-0.5 rounded-full bg-[#d4910a]/15 px-3 py-0.5 text-xs font-medium text-[#e6a817]">
              {session.role}
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await destroySession();
              redirect("/login");
            }}
          >
            <button
              type="submit"
              className="rounded-lg border border-[#2a2a3e] bg-[#141420] px-4 py-2 text-sm text-[#9ca3af] transition-all hover:border-[#d4910a]/40 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 73px)" }}>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#d4910a]/10">
            <svg viewBox="0 0 32 32" fill="none" className="h-10 w-10">
              <rect x="2" y="2" width="12" height="12" rx="2" fill="#d4910a" opacity="0.9" />
              <rect x="18" y="2" width="12" height="12" rx="2" fill="#d4910a" opacity="0.5" />
              <rect x="2" y="18" width="12" height="12" rx="2" fill="#d4910a" opacity="0.5" />
              <rect x="18" y="18" width="12" height="12" rx="2" fill="#d4910a" opacity="0.3" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to TransitOps
          </h2>
          <p className="text-[#9ca3af] mb-1">
            You are signed in as{" "}
            <span className="text-[#e6a817] font-medium">{session.role}</span>
          </p>
          <p className="text-sm text-[#6b7280]">
            Dashboard modules coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
