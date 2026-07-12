"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Trip = any; // We can use the actual Prisma types, but 'any' is sufficient here since we know the shape (id, vehicle.registrationNumber, driver.name, status)
type KPIs = any; // Same for KPIs

export function DashboardClient({ 
  kpis, 
  recentTrips, 
  totalVehicles 
}: { 
  kpis: KPIs; 
  recentTrips: Trip[]; 
  totalVehicles: number;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const getPercentage = (count: number) => {
    return totalVehicles > 0 ? (count / totalVehicles) * 100 : 0;
  };

  const filteredTrips = recentTrips.filter(trip => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    
    const idMatch = trip.id.toLowerCase().includes(q);
    const vehicleMatch = trip.vehicle?.registrationNumber.toLowerCase().includes(q) || false;
    const driverMatch = trip.driver?.name.toLowerCase().includes(q) || false;
    
    return idMatch || vehicleMatch || driverMatch;
  });

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-950 text-slate-200">
      <div className="flex flex-col gap-6 p-6 pb-10 max-w-7xl mx-auto">
        {/* ── Top Bar ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search trips, vehicles, or drivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-10 pr-4 text-sm text-slate-200 outline-none transition-colors focus:border-slate-700"
            />
          </div>
          <div className="flex gap-2">
            <select className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400 outline-none focus:border-slate-700">
              <option>Vehicle Type: All</option>
              <option>Van</option>
              <option>Truck</option>
            </select>
            <select className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400 outline-none focus:border-slate-700">
              <option>Status: All</option>
              <option>Active</option>
              <option>Maintenance</option>
            </select>
            <select className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400 outline-none focus:border-slate-700">
              <option>Region: All</option>
              <option>North</option>
              <option>South</option>
            </select>
          </div>
        </div>

        {/* ── KPI Grid ──────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          <div className="col-span-1 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Vehicles</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-white">{kpis.activeVehicles}</p>
          </div>
          <div className="col-span-1 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Available Vehicles</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-white">{kpis.availableVehicles}</p>
          </div>
          <div className="col-span-1 rounded-xl border border-amber-500/30 bg-slate-900 p-6 shadow-lg shadow-black/20">
            <p className="text-sm font-medium text-amber-500 uppercase tracking-wider">Vehicles in Maint.</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-amber-500">{kpis.maintenanceVehicles}</p>
          </div>
          <div className="col-span-1 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Trips</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-white">{kpis.activeTrips}</p>
          </div>
          <div className="col-span-1 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Pending Trips</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-white">{kpis.pendingTrips}</p>
          </div>
          <div className="col-span-1 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Drivers On Duty</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-white">{kpis.driversOnDuty}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Recent Trips ────────────────────────────────────────────────────── */}
          <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl shadow-black/20">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Recent Trips</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Trip ID</th>
                    <th className="px-4 py-3 font-semibold">Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Driver</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredTrips.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                        No recent trips match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredTrips.map((trip: any) => (
                      <tr key={trip.id} className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                        <td className="px-4 py-4 font-mono text-xs text-slate-200">
                          {trip.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-4">
                          {trip.vehicle ? trip.vehicle.registrationNumber : "—"}
                        </td>
                        <td className="px-4 py-4">
                          {trip.driver ? trip.driver.name : "—"}
                        </td>
                        <td className="px-4 py-4">
                          {trip.status === "Draft" && <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full px-3 py-1 text-xs font-semibold">Draft</span>}
                          {trip.status === "Dispatched" && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-semibold">Dispatched</span>}
                          {trip.status === "Completed" && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-semibold">Completed</span>}
                          {trip.status === "Cancelled" && <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full px-3 py-1 text-xs font-semibold">Cancelled</span>}
                        </td>
                        <td className="px-4 py-4">
                          {trip.status === "Dispatched" ? "45 min" : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Fleet Utilization & Status ──────────────────────────────────────── */}
          <div className="col-span-1 flex flex-col gap-6">
            <div className="rounded-xl border border-emerald-500/30 bg-slate-900 p-6 shadow-xl shadow-black/20 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sm font-medium text-emerald-500 uppercase tracking-wider">Fleet Utilization</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-white">{kpis.utilization}%</span>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl"></div>
            </div>

            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/20 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">Vehicle Status</h2>
              <div className="space-y-6">
                
                {/* Available */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-200 font-medium">Available</span>
                    <span className="font-mono text-slate-500">{kpis.vehicleStatusCount.Available} / {totalVehicles}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${getPercentage(kpis.vehicleStatusCount.Available)}%` }}></div>
                  </div>
                </div>
                
                {/* On Trip */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-200 font-medium">On Trip</span>
                    <span className="font-mono text-slate-500">{kpis.vehicleStatusCount["On Trip"]} / {totalVehicles}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${getPercentage(kpis.vehicleStatusCount["On Trip"])}%` }}></div>
                  </div>
                </div>
                
                {/* In Shop */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-200 font-medium">In Shop</span>
                    <span className="font-mono text-slate-500">{kpis.vehicleStatusCount["In Shop"]} / {totalVehicles}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${getPercentage(kpis.vehicleStatusCount["In Shop"])}%` }}></div>
                  </div>
                </div>
                
                {/* Retired */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-200 font-medium">Retired</span>
                    <span className="font-mono text-slate-500">{kpis.vehicleStatusCount.Retired} / {totalVehicles}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-rose-500 transition-all duration-500" style={{ width: `${getPercentage(kpis.vehicleStatusCount.Retired)}%` }}></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
