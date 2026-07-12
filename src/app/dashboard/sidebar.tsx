"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Fleet", href: "/dashboard/fleet", icon: Truck },
  { label: "Drivers", href: "/dashboard/drivers", icon: Users },
  { label: "Trips", href: "/dashboard/trips", icon: Route },
  { label: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  { label: "Fuel & Expenses", href: "/dashboard/fuel-expenses", icon: Fuel },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ currentRole }: { currentRole: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-[200px] flex-shrink-0 flex-col border-r border-[#1e1e2e] bg-[#0a0a12]">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-5 hover:opacity-80 transition-opacity">
        <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7 flex-shrink-0">
          <rect x="2" y="2" width="12" height="12" rx="2" fill="#d4910a" opacity="0.9" />
          <rect x="18" y="2" width="12" height="12" rx="2" fill="#d4910a" opacity="0.5" />
          <rect x="2" y="18" width="12" height="12" rx="2" fill="#d4910a" opacity="0.5" />
          <rect x="18" y="18" width="12" height="12" rx="2" fill="#d4910a" opacity="0.3" />
        </svg>
        <span className="text-lg font-bold tracking-tight text-white">
          Transit<span className="text-[#d4910a]">Ops</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#d4910a]/12 text-[#e6a817] shadow-[inset_0_0_0_1px_rgba(212,145,10,0.15)]"
                  : "text-[#9ca3af] hover:bg-[#141420] hover:text-[#e0e0e0]"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                  isActive
                    ? "text-[#e6a817]"
                    : "text-[#6b7280] group-hover:text-[#9ca3af]"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Role badge at bottom */}
      <div className="border-t border-[#1e1e2e] px-4 py-4">
        <span className="text-xs font-medium uppercase tracking-wider text-[#6b7280]">
          Role
        </span>
        <p className="mt-1 text-sm font-medium text-[#e6a817]">{currentRole}</p>
      </div>
    </aside>
  );
}
