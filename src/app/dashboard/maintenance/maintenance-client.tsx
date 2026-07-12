"use client";

import { useActionState } from "react";
import { createMaintenanceLog, closeMaintenanceLog } from "@/app/actions/maintenance";
import type { Vehicle, MaintenanceLog } from "@prisma/client";
import { Wrench, CheckCircle2, AlertCircle, Play } from "lucide-react";
import type { ActionState } from "@/app/actions/trips";

type MaintenanceLogWithVehicle = MaintenanceLog & {
  vehicle: Vehicle;
};

export function MaintenanceClient({
  vehicles,
  initialLogs,
  userRole,
}: {
  vehicles: Vehicle[];
  initialLogs: MaintenanceLogWithVehicle[];
  userRole: string;
}) {
  const isReadOnly = userRole !== "Fleet Manager";
  const [formState, formAction, isPending] = useActionState<ActionState, FormData>(
    createMaintenanceLog,
    {}
  );

  // Available selections for the form (exclude retired)
  const activeVehicles = vehicles.filter((v) => v.status !== "Retired");

  const handleCloseLog = async (id: string) => {
    await closeMaintenanceLog(id);
  };

  return (
    <div className="flex h-full flex-col gap-6">
      {/* ── Header ───────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-white">Maintenance</h1>
        <p className="mt-0.5 text-sm text-[#6b7280]">
          Log and manage vehicle servicing
        </p>
      </div>

      {isReadOnly && (
        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-4 py-2 rounded-lg -mt-2">
          Viewing in Read-Only Mode
        </div>
      )}

      {/* ── Main Content Grid ───────────────────────────────────────── */}
      <div className={`grid flex-1 gap-6 min-h-0 ${isReadOnly ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
        {/* ── Left Column: Log Record ───────────────────────────────────────── */}
        {!isReadOnly && (
          <div className="col-span-1 flex flex-col gap-4 lg:col-span-4 overflow-y-auto">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#9ca3af]">
                Log Record
              </h2>

          <form action={formAction} className="space-y-4">
            {formState.error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{formState.error}</p>
              </div>
            )}

            {formState.success && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <p>Maintenance log created.</p>
              </div>
            )}

            {/* Vehicle */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Vehicle
              </label>
              <select
                name="vehicleId"
                required
                className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
              >
                <option value="">Select vehicle...</option>
                {activeVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.registrationNumber} - {v.model}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Service Type
              </label>
              <input
                name="serviceType"
                type="text"
                required
                placeholder="e.g. Oil Change, Tire Replacement"
                className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
              />
            </div>

            {/* Cost */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Cost (₹)
              </label>
              <input
                name="cost"
                type="number"
                required
                min={0}
                placeholder="0"
                className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Date
              </label>
              <input
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
              />
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-orange-400 hover:-translate-y-px hover:shadow-amber-500/30 disabled:opacity-60"
              >
                {isPending ? "Logging..." : "Create Record"}
              </button>
            </div>
          </form>
        </div>
        </div>
        )}

      {/* ── Right Column: Service Log ─────────────────────────────────────── */}
      <div className={`col-span-1 flex flex-col gap-4 overflow-hidden ${!isReadOnly ? 'lg:col-span-8' : ''}`}>
        <div className="flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/20 flex flex-col">
          <div className="border-b border-slate-800 bg-slate-950/50 px-5 py-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Service Log
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
              <Wrench className="h-4 w-4" />
              <span>{initialLogs.length} Records</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {initialLogs.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-[#6b7280]">
                No maintenance records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#9ca3af]">
                  <thead className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Vehicle</th>
                      <th className="px-4 py-3 font-semibold">Service Type</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Cost</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      {!isReadOnly && <th className="px-4 py-3 font-semibold text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {initialLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-4 py-3 font-medium text-[#e0e0e0]">
                          {log.vehicle.registrationNumber}
                        </td>
                        <td className="px-4 py-3">{log.serviceType}</td>
                        <td className="px-4 py-3">
                          {new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3">₹{log.cost.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {log.status === "Active" ? (
                            <span className="inline-block rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                              In Shop
                            </span>
                          ) : (
                            <span className="inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                              Completed
                            </span>
                          )}
                        </td>
                        {!isReadOnly && (
                          <td className="px-4 py-3 text-right">
                            {log.status === "Active" && (
                              <button
                                onClick={() => handleCloseLog(log.id)}
                                className="inline-flex items-center gap-1.5 rounded bg-[#2a2a3e] px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-[#d4910a] hover:text-black"
                              >
                                <Play className="h-3.5 w-3.5" />
                                Close
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
