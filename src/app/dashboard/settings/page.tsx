"use client";

import { useState } from "react";
import { Check, X, Shield, Settings2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [showToast, setShowToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto pb-10">
      
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="mt-0.5 text-sm text-[#6b7280]">
          Manage platform configuration and access control
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* ── Left Column: General Settings ─────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              General Configuration
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Depot Name</label>
                <input 
                  type="text" 
                  defaultValue="Gandhinagar Central Hub" 
                  className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50" 
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Currency</label>
                <select className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Distance Unit</label>
                <select className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50">
                  <option value="km">Kilometers (km)</option>
                  <option value="mi">Miles (mi)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button 
                  type="submit" 
                  className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-orange-400 hover:-translate-y-px hover:shadow-amber-500/30"
                >
                  Save Changes
                </button>
                {showToast && (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Saved successfully
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ── Right Column: RBAC Matrix ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/20 overflow-hidden">
            <div className="border-b border-slate-800 bg-slate-950/50 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role-Based Access Matrix
              </h2>
            </div>
            
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-sm text-[#9ca3af]">
                <thead className="border-b border-slate-800 bg-slate-950/50 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold text-center">Fleet</th>
                    <th className="px-4 py-3 font-semibold text-center">Drivers</th>
                    <th className="px-4 py-3 font-semibold text-center">Trips</th>
                    <th className="px-4 py-3 font-semibold text-center">Fuel/Exp.</th>
                    <th className="px-4 py-3 font-semibold text-center">Analytics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  
                  {/* Fleet Manager */}
                  <tr className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-[#e0e0e0]">Fleet Manager</td>
                    <td className="px-4 py-3 text-center"><Check className="mx-auto h-4 w-4 text-emerald-500" /></td>
                    <td className="px-4 py-3 text-center"><Check className="mx-auto h-4 w-4 text-emerald-500" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                  </tr>

                  {/* Dispatcher */}
                  <tr className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-[#e0e0e0]">Dispatcher</td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><Check className="mx-auto h-4 w-4 text-emerald-500" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                  </tr>

                  {/* Safety Officer */}
                  <tr className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-[#e0e0e0]">Safety Officer</td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><Check className="mx-auto h-4 w-4 text-emerald-500" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                  </tr>

                  {/* Financial Analyst */}
                  <tr className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-[#e0e0e0]">Financial Analyst</td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><X className="mx-auto h-4 w-4 text-[#6b7280]" /></td>
                    <td className="px-4 py-3 text-center"><Check className="mx-auto h-4 w-4 text-emerald-500" /></td>
                    <td className="px-4 py-3 text-center"><Check className="mx-auto h-4 w-4 text-emerald-500" /></td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
