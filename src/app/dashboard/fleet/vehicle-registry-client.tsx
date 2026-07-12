"use client";

import { useState, useActionState, useEffect } from "react";
import { createVehicle, type CreateVehicleState } from "@/app/actions/master-data";
import type { Vehicle } from "@prisma/client";
import { Plus, X, Search, ChevronDown, FileText, FilePlus, Download } from "lucide-react";

const VEHICLE_STATUSES = ["Available", "On Trip", "In Shop", "Retired"] as const;

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "On Trip": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "In Shop": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Retired: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatOdometer(km: number): string {
  return new Intl.NumberFormat("en-IN").format(km) + " km";
}

export function VehicleRegistryClient({
  initialVehicles,
}: {
  initialVehicles: Vehicle[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState<string | null>(null);
  const [formState, formAction, isPending] = useActionState<CreateVehicleState, FormData>(
    createVehicle,
    {}
  );

  // Close modal on success
  useEffect(() => {
    if (formState.success) {
      setShowModal(false);
    }
  }, [formState.success]);

  // Filter vehicles
  const filtered = initialVehicles.filter((v) => {
    const matchesSearch =
      search === "" ||
      v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Vehicle Registry</h1>
          <p className="mt-0.5 text-sm text-[#6b7280]">
            {initialVehicles.length} vehicles registered
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-orange-400 hover:-translate-y-px hover:shadow-amber-500/30"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        {/* Status dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-lg border border-[#2a2a3e] bg-[#111119] py-2 pl-3 pr-9 text-sm text-[#e0e0e0] outline-none transition-colors focus:border-[#d4910a]/50"
          >
            <option value="All">Status: All</option>
            {VEHICLE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search reg. no. or model..."
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
                Reg. No. (Unique)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Name/Model
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Capacity
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Odometer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Acq. Cost
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Docs
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-[#6b7280]"
                >
                  No vehicles match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((vehicle, idx) => (
                <tr
                  key={vehicle.id}
                  className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3 font-mono text-sm text-[#e0e0e0]">
                    {vehicle.registrationNumber}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    {vehicle.model}
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">
                    {vehicle.capacity}
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">
                    {formatOdometer(vehicle.odometer)}
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">
                    {formatCurrency(vehicle.acquisitionCost)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                        STATUS_STYLES[vehicle.status] || "bg-gray-500/15 text-gray-400 border-gray-500/20"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setShowDocsModal(vehicle.registrationNumber)}
                      className="inline-flex items-center gap-1.5 rounded bg-[#1e1e2e] px-2.5 py-1.5 text-xs font-medium text-[#e0e0e0] transition-colors hover:bg-[#d4910a] hover:text-black"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      View Docs
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Business rule note */}
      <p className="text-xs italic text-[#d4910a]/70">
        Rule: Registration No. must be unique · Retired/In Shop vehicles are hidden from Trip Dispatcher
      </p>

      {/* ── Add Vehicle Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md animate-[modalIn_0.25s_ease-out] rounded-2xl border border-[#1e1e2e] bg-[#111119] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Add New Vehicle</h2>
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

              {/* Registration Number */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                  Registration Number
                </label>
                <input
                  name="registrationNumber"
                  required
                  placeholder="e.g. GJ01BX999"
                  className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] placeholder-[#6b7280] outline-none focus:border-[#d4910a]/50"
                />
              </div>

              {/* Model */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                  Model
                </label>
                <input
                  name="model"
                  required
                  placeholder="e.g. VAN-12"
                  className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] placeholder-[#6b7280] outline-none focus:border-[#d4910a]/50"
                />
              </div>

              {/* Two-column: Capacity + Odometer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                    Capacity
                  </label>
                  <input
                    name="capacity"
                    required
                    placeholder="e.g. 500 kg"
                    className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] placeholder-[#6b7280] outline-none focus:border-[#d4910a]/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                    Odometer (km)
                  </label>
                  <input
                    name="odometer"
                    type="number"
                    required
                    min={0}
                    placeholder="0"
                    className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] placeholder-[#6b7280] outline-none focus:border-[#d4910a]/50"
                  />
                </div>
              </div>

              {/* Two-column: Acq Cost + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                    Acquisition Cost (₹)
                  </label>
                  <input
                    name="acquisitionCost"
                    type="number"
                    required
                    min={0}
                    placeholder="0"
                    className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] placeholder-[#6b7280] outline-none focus:border-[#d4910a]/50"
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
                      {VEHICLE_STATUSES.map((s) => (
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
                  {isPending ? "Adding..." : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Document Management Modal (Mock) ─────────────────────────────── */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md animate-[modalIn_0.25s_ease-out] rounded-2xl border border-[#1e1e2e] bg-[#111119] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Vehicle Documents</h2>
                <p className="text-xs text-[#9ca3af]">{showDocsModal}</p>
              </div>
              <button
                onClick={() => setShowDocsModal(null)}
                className="rounded-lg p-1.5 text-[#6b7280] transition-colors hover:bg-[#1e1e2e] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between rounded-lg border border-[#2a2a3e] bg-[#0a0a12] p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Registration_Cert.pdf</p>
                    <p className="text-xs text-[#6b7280]">Added 12 Jan 2026</p>
                  </div>
                </div>
                <button className="text-[#6b7280] hover:text-white"><Download className="h-4 w-4" /></button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#2a2a3e] bg-[#0a0a12] p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Insurance_Policy.pdf</p>
                    <p className="text-xs text-[#6b7280]">Expires 05 May 2027</p>
                  </div>
                </div>
                <button className="text-[#6b7280] hover:text-white"><Download className="h-4 w-4" /></button>
              </div>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#d4910a]/50 bg-[#d4910a]/10 py-3 text-sm font-medium text-[#d4910a] transition-colors hover:bg-[#d4910a]/20">
              <FilePlus className="h-4 w-4" />
              Upload New Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
