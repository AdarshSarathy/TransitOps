"use client";

import { useState, useActionState, useEffect } from "react";
import { logFuel, logExpense } from "@/app/actions/finance";
import type { Vehicle, Trip, MaintenanceLog, FuelLog, Expense } from "@prisma/client";
import { Receipt, Droplets, Plus, X, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ActionState } from "@/app/actions/trips";

type FuelLogWithVehicle = FuelLog & { vehicle: Vehicle };
type ExpenseWithRelations = Expense & {
  vehicle: Vehicle | null;
  trip: Trip | null;
  linkedMaintenance: MaintenanceLog | null;
};

export function FinanceClient({
  vehicles,
  trips,
  maintenanceLogs,
  fuelLogs,
  expenses,
  totalOperationalCost,
}: {
  vehicles: Vehicle[];
  trips: Trip[];
  maintenanceLogs: MaintenanceLog[];
  fuelLogs: FuelLogWithVehicle[];
  expenses: ExpenseWithRelations[];
  totalOperationalCost: number;
}) {
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [fuelFormState, fuelFormAction, isFuelPending] = useActionState<ActionState, FormData>(
    logFuel,
    {}
  );
  
  const [expenseFormState, expenseFormAction, isExpensePending] = useActionState<ActionState, FormData>(
    logExpense,
    {}
  );

  useEffect(() => {
    if (fuelFormState.success) setIsFuelModalOpen(false);
  }, [fuelFormState.success]);

  useEffect(() => {
    if (expenseFormState.success) setIsExpenseModalOpen(false);
  }, [expenseFormState.success]);

  return (
    <div className="flex h-full flex-col gap-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Fuel & Expenses</h1>
          <p className="mt-0.5 text-sm text-[#6b7280]">
            Track operational costs and general expenses
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFuelModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a2a3e] bg-[#141420] px-4 py-2 text-sm font-medium text-[#e0e0e0] shadow-sm transition-all hover:bg-[#1a1a2e] hover:text-white"
          >
            <Droplets className="h-4 w-4 text-[#d4910a]" />
            Log Fuel
          </button>
          
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/30"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* ── Tables ──────────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col gap-6 pb-20">
        
        {/* Fuel Logs Table */}
        <div className="flex h-1/2 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/20">
          <div className="border-b border-slate-800 bg-slate-950/50 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Fuel Logs
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {fuelLogs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-[#6b7280]">
                No fuel logs found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#9ca3af]">
                  <thead className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Vehicle</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Liters</th>
                      <th className="px-4 py-3 font-semibold">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {fuelLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                        <td className="px-4 py-3 font-medium text-[#e0e0e0]">
                          {log.vehicle.registrationNumber}
                        </td>
                        <td className="px-4 py-3">{new Date(log.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{log.liters.toFixed(2)} L</td>
                        <td className="px-4 py-3 text-[#d4910a]">₹{log.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Other Expenses Table */}
        <div className="flex h-1/2 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/20">
          <div className="border-b border-slate-800 bg-slate-950/50 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Other Expenses (Toll / Misc)
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {expenses.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-[#6b7280]">
                No expenses found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#9ca3af]">
                  <thead className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Trip</th>
                      <th className="px-4 py-3 font-semibold">Vehicle</th>
                      <th className="px-4 py-3 font-semibold">Maint. Linked</th>
                      <th className="px-4 py-3 font-semibold">Toll Cost</th>
                      <th className="px-4 py-3 font-semibold">Other Cost</th>
                      <th className="px-4 py-3 font-semibold text-white">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                        <td className="px-4 py-3">
                          {expense.trip ? (
                            <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-1 rounded">
                              {expense.trip.id.slice(-6).toUpperCase()}
                            </span>
                          ) : (
                            <span className="text-xs text-[#6b7280]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#e0e0e0]">
                          {expense.vehicle?.registrationNumber || <span className="text-xs text-[#6b7280]">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {expense.linkedMaintenance ? expense.linkedMaintenance.serviceType : <span className="text-xs text-[#6b7280]">—</span>}
                        </td>
                        <td className="px-4 py-3">₹{expense.tollCost.toLocaleString()}</td>
                        <td className="px-4 py-3">₹{expense.otherCost.toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-white">
                          ₹{(expense.tollCost + expense.otherCost).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Cost Footer ──────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t border-[#d4910a]/30 bg-[#111119]/95 px-6 py-4 backdrop-blur-md lg:left-56">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4910a]/15 text-[#d4910a]">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Total Operational Cost (Fuel + Maint)</p>
            <p className="text-sm text-[#6b7280]">Aggregated across entire fleet</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-white">
          ₹{totalOperationalCost.toLocaleString()}
        </div>
      </div>

      {/* ── Fuel Modal ───────────────────────────────────────────────────────── */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md rounded-2xl border border-[#1e1e2e] bg-[#0a0a12] p-6 shadow-2xl"
            style={{ animation: 'modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Log Fuel</h3>
              <button 
                onClick={() => setIsFuelModalOpen(false)}
                className="rounded-lg p-1.5 text-[#6b7280] hover:bg-[#1e1e2e] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form action={fuelFormAction} className="space-y-4">
              {fuelFormState.error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{fuelFormState.error}</p>
                </div>
              )}
              
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Vehicle</label>
                <select name="vehicleId" required className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50">
                  <option value="">Select vehicle...</option>
                  {vehicles.filter(v => v.status !== "Retired").map(v => (
                    <option key={v.id} value={v.id}>{v.registrationNumber}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Liters</label>
                  <input name="liters" type="number" step="0.01" required min={0.1} placeholder="0" className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Cost (₹)</label>
                  <input name="cost" type="number" required min={1} placeholder="0" className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Date</label>
                <input name="date" type="date" required defaultValue={new Date().toISOString().split("T")[0]} className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50" />
              </div>

              <button type="submit" disabled={isFuelPending} className="mt-2 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-amber-400 hover:to-orange-400 hover:-translate-y-px hover:shadow-amber-500/30 disabled:opacity-60">
                {isFuelPending ? "Saving..." : "Save Fuel Log"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Expense Modal ────────────────────────────────────────────────────── */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md rounded-2xl border border-[#1e1e2e] bg-[#0a0a12] p-6 shadow-2xl"
            style={{ animation: 'modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Add Expense</h3>
              <button 
                onClick={() => setIsExpenseModalOpen(false)}
                className="rounded-lg p-1.5 text-[#6b7280] hover:bg-[#1e1e2e] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form action={expenseFormAction} className="space-y-4">
              {expenseFormState.error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{expenseFormState.error}</p>
                </div>
              )}
              
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Link to Trip (Optional)</label>
                <select name="tripId" className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50">
                  <option value="">Select trip...</option>
                  {trips.map(t => (
                    <option key={t.id} value={t.id}>{t.id.slice(-6).toUpperCase()} ({t.status})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Link to Vehicle (Optional)</label>
                <select name="vehicleId" className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50">
                  <option value="">Select vehicle...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registrationNumber}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Link to Maintenance (Optional)</label>
                <select name="linkedMaintenanceId" className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50">
                  <option value="">Select maintenance...</option>
                  {maintenanceLogs.map(m => (
                    <option key={m.id} value={m.id}>{m.serviceType} ({m.status})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Toll Cost (₹)</label>
                  <input name="tollCost" type="number" defaultValue="0" min={0} className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Other Cost (₹)</label>
                  <input name="otherCost" type="number" defaultValue="0" min={0} className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50" />
                </div>
              </div>

              <button type="submit" disabled={isExpensePending} className="mt-2 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-amber-400 hover:to-orange-400 hover:-translate-y-px hover:shadow-amber-500/30 disabled:opacity-60">
                {isExpensePending ? "Saving..." : "Save Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
