import { getSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d0d0d]">
      {/* Fixed left sidebar */}
      <Sidebar currentRole={session.role} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-[#1e1e2e] bg-[#0d0d0d] px-6 py-3">
          {/* Search */}
          <div className="relative w-72">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-[#2a2a3e] bg-[#111119] py-2 pl-10 pr-4 text-sm text-[#e0e0e0] placeholder-[#6b7280] outline-none transition-colors focus:border-[#d4910a]/50"
            />
          </div>

          {/* User info + sign out */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-[#9ca3af]">{session.email}</p>
              <span className="mt-0.5 inline-block rounded-full bg-[#d4910a]/15 px-3 py-0.5 text-xs font-medium text-[#e6a817]">
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

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
