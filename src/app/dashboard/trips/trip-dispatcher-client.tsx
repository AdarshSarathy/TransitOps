"use client";

import { useState, useActionState, useEffect } from "react";
import { createTrip, dispatchTrip, completeTrip, cancelTrip, type ActionState } from "@/app/actions/trips";
import type { Vehicle, Driver, Trip } from "@prisma/client";
import { Map, LOCATIONS } from "@/components/Map";
import { Truck, Users, Route, AlertCircle, CheckCircle2, Play, Ban } from "lucide-react";

type TripWithRelations = Trip & {
  vehicle: Vehicle | null;
  driver: Driver | null;
};

// Helper function to parse capacity string into a number of kg
function parseCapacity(capacityStr: string): number {
  const normalized = capacityStr.toLowerCase().trim();
  const num = parseFloat(normalized);
  if (isNaN(num)) return 0;
  if (normalized.includes("ton")) return num * 1000;
  return num; // assuming base is kg
}

const TRIP_STATUS_STYLES: Record<string, string> = {
  Draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export function TripDispatcherClient({
  vehicles,
  drivers,
  initialTrips,
  userRole,
}: {
  vehicles: Vehicle[];
  drivers: Driver[];
  initialTrips: TripWithRelations[];
  userRole: string;
}) {
  const isReadOnly = userRole !== "Dispatcher";
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [cargoWeight, setCargoWeight] = useState<number | "">("");
  
  const [formState, formAction, isPending] = useActionState<ActionState, FormData>(
    createTrip,
    {}
  );

  // Selected vehicle for load calculation
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const capacityKg = selectedVehicle ? parseCapacity(selectedVehicle.capacity) : 0;
  
  const loadPercentage = capacityKg > 0 && typeof cargoWeight === "number"
    ? (cargoWeight / capacityKg) * 100
    : 0;
    
  const isOverloaded = loadPercentage > 100;
  
  // Available selections
  const availableVehicles = vehicles.filter(v => v.status === "Available");
  // Hide suspended and expired drivers
  const now = new Date();
  const availableDrivers = drivers.filter(d => 
    d.status === "Available" && 
    new Date(d.expiryDate) >= now
  );

  // Quick Action Handlers
  const handleDispatch = async (id: string) => {
    await dispatchTrip(id);
  };
  
  const handleComplete = async (id: string) => {
    await completeTrip(id);
  };
  
  const handleCancel = async (id: string) => {
    await cancelTrip(id);
  };

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-12">
      {/* ── Left Column: Create Trip ───────────────────────────────────────── */}
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Trip Dispatcher</h1>
          <p className="mt-0.5 text-sm text-[#6b7280]">
            Create and monitor fleet operations
          </p>
        </div>

        {isReadOnly && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-4 py-2 rounded-lg mb-6">
            Viewing in Read-Only Mode
          </div>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#9ca3af]">
            Create Trip
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
                <p>Trip created successfully.</p>
              </div>
            )}

            {/* Source */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Source
              </label>
              <select
                name="source"
                required
                disabled={isReadOnly}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
              >
                <option value="">Select source...</option>
                {Object.keys(LOCATIONS).map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Destination
              </label>
              <select
                name="destination"
                required
                disabled={isReadOnly}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
              >
                <option value="">Select destination...</option>
                {Object.keys(LOCATIONS).map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Vehicle */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Vehicle (Available Only)
              </label>
              <select
                name="vehicleId"
                required
                disabled={isReadOnly}
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
              >
                <option value="">Select vehicle...</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.registrationNumber} - {v.model} ({v.capacity})
                  </option>
                ))}
              </select>
            </div>

            {/* Driver */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Driver (Available Only)
              </label>
              <select
                name="driverId"
                required
                disabled={isReadOnly}
                className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50 disabled:opacity-50"
              >
                <option value="">Select driver...</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.category}) - Safety: {d.safetyScore}%
                  </option>
                ))}
              </select>
            </div>

            {/* Cargo & Validation */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Cargo Weight (kg)
              </label>
              <input
                name="cargoWeight"
                type="number"
                required
                disabled={isReadOnly}
                min={1}
                value={cargoWeight}
                onChange={(e) => setCargoWeight(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="0"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#e0e0e0] outline-none ${
                  isOverloaded 
                    ? "border-red-500/50 bg-red-500/10 focus:border-red-500" 
                    : "border-[#2a2a3e] bg-[#0f0f1a] focus:border-[#d4910a]/50"
                }`}
              />
              
              {/* Smart Load Validator */}
              {selectedVehicle && (
                <div className="mt-3 space-y-1.5 rounded-lg border border-[#1e1e2e] bg-[#141420] p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9ca3af]">Vehicle Capacity:</span>
                    <span className="font-semibold text-white">{capacityKg} kg</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2a2a3e]">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOverloaded ? "bg-red-500" : loadPercentage > 80 ? "bg-[#d4910a]" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                    />
                  </div>
                  
                  {isOverloaded && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-red-400">
                      <Ban className="h-3.5 w-3.5" />
                      Capacity exceeded by {(cargoWeight as number) - capacityKg} kg — dispatch blocked
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Planned Distance */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Planned Distance (km)
              </label>
              <input
                name="plannedDistance"
                type="number"
                required
                disabled={isReadOnly}
                min={1}
                placeholder="0"
                className="w-full rounded-lg border border-[#2a2a3e] bg-[#0f0f1a] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none focus:border-[#d4910a]/50"
              />
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending || isOverloaded || isReadOnly}
                className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-lg transition-all ${
                  isOverloaded 
                    ? "cursor-not-allowed bg-red-500/20 text-red-200 shadow-none" 
                    : "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 hover:-translate-y-px hover:shadow-amber-500/30 disabled:opacity-60"
                }`}
              >
                {isPending ? "Creating..." : isOverloaded ? "Dispatch Disabled" : "Create Trip (Draft)"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Right Column: Map & Live Board ─────────────────────────────────── */}
      <div className="col-span-1 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
        
        {/* Map Container (Top Half) */}
        <div className="h-64 lg:h-2/5 min-h-[250px] w-full shrink-0 shadow-lg">
          <Map source={source} destination={destination} />
        </div>

        {/* Live Board (Bottom Half) */}
        <div className="flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/20 flex flex-col">
          <div className="border-b border-slate-800 bg-slate-950/50 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9ca3af]">
              Live Board
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {initialTrips.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-[#6b7280]">
                No trips active.
              </div>
            ) : (
              initialTrips.map((trip) => (
                <div 
                  key={trip.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#2a2a3e] bg-[#141420] p-4 transition-all hover:border-[#3a3a4e]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-white">
                        {trip.id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          TRIP_STATUS_STYLES[trip.status]
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>
                    
                    {/* Action Buttons based on status */}
                    <div className="flex items-center gap-2">
                      {!isReadOnly && trip.status === "Draft" && (
                        <>
                          <button
                            onClick={() => handleDispatch(trip.id)}
                            className="flex items-center gap-1.5 rounded bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/20"
                          >
                            <Play className="h-3.5 w-3.5" />
                            Dispatch
                          </button>
                          <button
                            onClick={() => handleCancel(trip.id)}
                            className="flex items-center gap-1.5 rounded bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        </>
                      )}
                      
                      {!isReadOnly && trip.status === "Dispatched" && (
                        <button
                          onClick={() => handleComplete(trip.id)}
                          className="flex items-center gap-1.5 rounded bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Complete
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    <div className="flex items-start gap-2 text-[#9ca3af]">
                      <Route className="mt-0.5 h-4 w-4 shrink-0 text-[#6b7280]" />
                      <div className="flex flex-col">
                        <span>{trip.source}</span>
                        <span className="text-xs text-[#6b7280]">↓</span>
                        <span>{trip.destination}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[#e0e0e0]">
                        <Truck className="h-4 w-4 shrink-0 text-[#d4910a]" />
                        {trip.vehicle?.registrationNumber || "Unassigned"}
                      </div>
                      <div className="flex items-center gap-2 text-[#e0e0e0]">
                        <Users className="h-4 w-4 shrink-0 text-[#d4910a]" />
                        {trip.driver?.name || "Unassigned"}
                      </div>
                    </div>
                  </div>
                  
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
