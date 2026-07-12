import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#d4910a]/10">
          <svg viewBox="0 0 32 32" fill="none" className="h-10 w-10">
            <rect x="2" y="2" width="12" height="12" rx="2" fill="#d4910a" opacity="0.9" />
            <rect x="18" y="2" width="12" height="12" rx="2" fill="#d4910a" opacity="0.5" />
            <rect x="2" y="18" width="12" height="12" rx="2" fill="#d4910a" opacity="0.5" />
            <rect x="18" y="18" width="12" height="12" rx="2" fill="#d4910a" opacity="0.3" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">
          Welcome to TransitOps
        </h2>
        <p className="mb-1 text-[#9ca3af]">
          You are signed in as{" "}
          <span className="font-medium text-[#e6a817]">{session.role}</span>
        </p>
        <p className="text-sm text-[#6b7280]">
          Dashboard modules coming soon.
        </p>
      </div>
    </div>
  );
}
