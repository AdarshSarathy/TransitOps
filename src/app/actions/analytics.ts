"use server";

import { prisma } from "@/lib/prisma";
import { getOperationalCosts } from "./finance";

export async function getDashboardKPIs() {
  const [
    activeVehicles,
    availableVehicles,
    maintenanceVehicles,
    retiredVehicles,
    activeTrips,
    pendingTrips,
    availableDrivers,
    onTripDrivers
  ] = await Promise.all([
    prisma.vehicle.count({ where: { status: "On Trip" } }),
    prisma.vehicle.count({ where: { status: "Available" } }),
    prisma.vehicle.count({ where: { status: "In Shop" } }),
    prisma.vehicle.count({ where: { status: "Retired" } }),
    prisma.trip.count({ where: { status: "Dispatched" } }),
    prisma.trip.count({ where: { status: "Draft" } }),
    prisma.driver.count({ where: { status: "Available" } }),
    prisma.driver.count({ where: { status: "On Trip" } })
  ]);

  const totalNonRetiredVehicles = activeVehicles + availableVehicles + maintenanceVehicles;
  const utilization = totalNonRetiredVehicles > 0 
    ? Math.round(((activeVehicles + availableVehicles) / totalNonRetiredVehicles) * 100) 
    : 0;

  return {
    activeVehicles: activeVehicles + availableVehicles, // As per original mockup logic
    availableVehicles,
    maintenanceVehicles,
    activeTrips,
    pendingTrips,
    driversOnDuty: availableDrivers + onTripDrivers,
    utilization,
    vehicleStatusCount: {
      Available: availableVehicles,
      "On Trip": activeVehicles,
      "In Shop": maintenanceVehicles,
      Retired: retiredVehicles
    }
  };
}

export async function getAnalyticsData() {
  // 1. Operational Cost per Vehicle
  const costMap = await getOperationalCosts();
  
  // 2. Fetch all completed trips to calculate revenue and distance
  const completedTrips = await prisma.trip.findMany({
    where: { status: "Completed" }
  });
  
  // 3. Fetch all fuel logs to calculate total liters
  const fuelLogs = await prisma.fuelLog.findMany();
  
  // 4. Fetch all non-retired vehicles for ROI calculation
  const vehicles = await prisma.vehicle.findMany({
    where: { status: { not: "Retired" } }
  });

  // Calculate Fleet Totals
  const totalOperationalCost = Object.values(costMap).reduce((acc, curr) => acc + curr, 0);
  const totalDistance = completedTrips.reduce((acc, trip) => acc + trip.plannedDistance, 0);
  const totalLiters = fuelLogs.reduce((acc, log) => acc + log.liters, 0);
  const fuelEfficiency = totalLiters > 0 ? (totalDistance / totalLiters).toFixed(2) : "0.00";

  // Calculate Vehicle ROI
  // Revenue = ₹10,000 per completed trip
  const vehicleStats = vehicles.map(v => {
    const vehicleTrips = completedTrips.filter(t => t.vehicleId === v.id);
    const revenue = vehicleTrips.length * 10000;
    const cost = costMap[v.id] || 0;
    
    // ROI = (Revenue - Cost) / Acquisition Cost
    let roi = 0;
    if (v.acquisitionCost > 0) {
      roi = ((revenue - cost) / v.acquisitionCost) * 100;
    }

    return {
      id: v.id,
      registrationNumber: v.registrationNumber,
      revenue,
      cost,
      roi: parseFloat(roi.toFixed(2))
    };
  });

  // Sort by cost for the "Top Costliest Vehicles" chart
  const costliestVehicles = [...vehicleStats]
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  const averageROI = vehicleStats.length > 0 
    ? (vehicleStats.reduce((acc, v) => acc + v.roi, 0) / vehicleStats.length).toFixed(2)
    : "0.00";

  return {
    totalOperationalCost,
    fuelEfficiency,
    averageROI,
    vehicleStats,
    costliestVehicles
  };
}
