"use client";

import { useState, useActionState, useEffect } from "react";
import { createDriver, type CreateDriverState, sendLicenseReminder } from "@/app/actions/master-data";
import type { Driver } from "@prisma/client";
import { Plus, X, Search, ChevronDown, Mail, CheckCircle2 } from "lucide-react";

const DRIVER_STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"] as const;

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "On Trip": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Off Duty": "bg-gray-500/10 text-gray-400 border-gray-500/20",
  Suspended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const STATUS_TOGGLE_STYLES: Record<string, string> = {
  Available: "bg-emerald-500 text-white",
  "On Trip": "bg-blue-500 text-white",
  "Off Duty": "bg-gray-600 text-white",
  Suspended: "bg-orange-500 text-white",
};

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { month: "2-digit", year: "numeric" });
}

function isExpired(date: Date | string): boolean {
  return new Date(date) < new Date();
}

function getSafetyColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-yellow-400";
  return "text-red-400";
}

export function DriverProfilesClient({
  initialDrivers,
  userRole,
}: {
  initialDrivers: Driver[];
  userRole: string;
}) {
  const isReadOnly = userRole !== "Safety Officer";
  const [search, setSearch] = useState("");
  const [activeStatuses, setActiveStatuses] = useState<Set<string>>(
    new Set(DRIVER_STATUSES)
  );
  const [showModal, setShowModal] = useState(false);
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [formState, formAction, isPending] = useActionState<CreateDriverState, FormData>(
    createDriver,
    {}
  );

  // Close modal on success
  useEffect(() => {
    if (formState.success) {
      setShowModal(false);
    }
  }, [formState.success]);

  const handleSendReminder = async (driverId: string) => {
    const res = await sendLicenseReminder(driverId);
    if (res.success) {
      setReminderToast(`Reminder sent successfully`);
      setTimeout(() => setReminderToast(null), 3000);
    }
  };

  // Toggle status filter
  const toggleStatus = (status: string) => {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  // Filter drivers
  const filtered = initialDrivers.filter((d) => {
    const matchesSearch =
      search === "" ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = activeStatuses.has(d.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            Drivers & Safety Profiles
          </h1>
          <p className="mt-0.5 text-sm text-[#6b7280]">
            {initialDrivers.length} drivers registered
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-orange-400 hover:-translate-y-px hover:shadow-amber-500/30"
          >
            <Plus className="h-4 w-4" />
            Add Driver
          </button>
        )}
      </div>

      {isReadOnly && (
        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-4 py-2 rounded-lg mb-6">
          Viewing in Read-Only Mode
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search name or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#2a2a3e] bg-[#111119] py-2 pl-10 pr-4 text-sm text-[#e0e0e0] placeholder-[#6b7280] outline-none transition-colors focus:border-[#d4910a]/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Driver
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                License No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Expiry
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Safety
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-[#6b7280]"
                >
                  No drivers match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((driver, idx) => {
                const expired = isExpired(driver.expiryDate);
                return (
                  <tr
                    key={driver.id}
                    className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {driver.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[#e0e0e0]">
                      {driver.licenseNumber}
                    </td>
                    <td className="px-4 py-3 text-[#9ca3af]">
                      {driver.category}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm ${
                          expired
                            ? "font-semibold text-red-400"
                            : "text-[#9ca3af]"
                        }`}
                      >
                        {formatDate(driver.expiryDate)}
                        {expired && (
                          <span className="ml-1.5 text-xs uppercase">
                            expired
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#9ca3af]">
                      {driver.contact}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold ${getSafetyColor(
                          driver.safetyScore
                        )}`}
                      >
                        {driver.safetyScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                          STATUS_STYLES[driver.status] ||
                          "bg-gray-500/15 text-gray-400 border-gray-500/20"
                        }`}
                      >
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!isReadOnly && (expired || driver.status === "Suspended") && (
                        <button
                          onClick={() => handleSendReminder(driver.id)}
                          className="inline-flex items-center gap-1.5 rounded bg-[#1e1e2e] px-2.5 py-1.5 text-xs font-medium text-[#e0e0e0] transition-colors hover:bg-orange-500 hover:text-white"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Send Reminder
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Status toggle filters */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
          Toggle Status
        </p>
        <div className="flex gap-2">
          {DRIVER_STATUSES.map((status) => {
            const isActive = activeStatuses.has(status);
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? STATUS_TOGGLE_STYLES[status]
                    : "border border-[#2a2a3e] bg-[#111119] text-[#6b7280]"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Business rule */}
      <div className="flex items-center justify-between">
        <p className="text-xs italic text-[#d4910a]/70">
          Rule: Expired license or Suspended status → blocked from trip assignment
        </p>
        
        {/* Toast */}
        {reminderToast && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="h-4 w-4" />
            {reminderToast}
          </span>
        )}
      </div>

      {/* ── Add Driver Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md animate-[modalIn_0.25s_ease-out] rounded-2xl border border-[#1e1e2e] bg-[#111119] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Add New Driver</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-[#6b7280] transition-colors hover:bg-[#1e1e2e] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              {formState.error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-2.5 text-sm text-red-400">
                  {formState.error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                  Full Name
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Rahul Singh"
                  className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] placeholder-[#6b7280] outline-none focus:border-[#d4910a]/50"
                />
              </div>

              {/* Two-column: License + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                    License Number
                  </label>
                  <input
                    name="licenseNumber"
                    required
                    placeholder="e.g. DL-12345"
                    className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] placeholder-[#6b7280] outline-none focus:border-[#d4910a]/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue="LMV"
                      className="w-full appearance-none rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 pr-9 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
                    >
                      <option value="LMV">LMV</option>
                      <option value="HMV">HMV</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                  </div>
                </div>
              </div>

              {/* Two-column: Expiry + Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                    License Expiry
                  </label>
                  <input
                    name="expiryDate"
                    type="date"
                    required
                    className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                    Contact
                  </label>
                  <input
                    name="contact"
                    required
                    placeholder="e.g. 9876500001"
                    className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] placeholder-[#6b7280] outline-none focus:border-[#d4910a]/50"
                  />
                </div>
              </div>

              {/* Two-column: Safety Score + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                    Safety Score
                  </label>
                  <input
                    name="safetyScore"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={100}
                    className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      defaultValue="Available"
                      className="w-full appearance-none rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 pr-9 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
                    >
                      {DRIVER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-[#2a2a3e] bg-[#141420] py-2.5 text-sm font-medium text-[#9ca3af] transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-orange-400 hover:-translate-y-px hover:shadow-amber-500/30 disabled:opacity-60"
                >
                  {isPending ? "Adding..." : "Add Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
