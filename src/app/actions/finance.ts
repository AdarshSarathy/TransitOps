"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ActionState } from "./trips";

export async function logFuel(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const vehicleId = formData.get("vehicleId")?.toString().trim();
  const litersStr = formData.get("liters")?.toString().trim();
  const costStr = formData.get("cost")?.toString().trim();
  const dateStr = formData.get("date")?.toString().trim();

  if (!vehicleId || !litersStr || !costStr || !dateStr) {
    return { error: "All fields are required." };
  }

  const liters = parseFloat(litersStr);
  if (isNaN(liters) || liters <= 0) {
    return { error: "Liters must be a valid positive number." };
  }

  const cost = parseFloat(costStr);
  if (isNaN(cost) || cost < 0) {
    return { error: "Cost must be a valid positive number." };
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { error: "Invalid date format." };
  }

  try {
    await prisma.fuelLog.create({
      data: {
        vehicleId,
        liters,
        cost,
        date
      }
    });

    revalidatePath("/dashboard/fuel-expenses");
    return { success: true };
  } catch (error) {
    console.error("Failed to log fuel:", error);
    return { error: "Failed to log fuel. Please try again." };
  }
}

export async function logExpense(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const tripId = formData.get("tripId")?.toString().trim() || null;
  const vehicleId = formData.get("vehicleId")?.toString().trim() || null;
  const tollCostStr = formData.get("tollCost")?.toString().trim() || "0";
  const otherCostStr = formData.get("otherCost")?.toString().trim() || "0";
  const linkedMaintenanceId = formData.get("linkedMaintenanceId")?.toString().trim() || null;

  if (!tripId && !vehicleId && !linkedMaintenanceId) {
    return { error: "At least one relation (Trip, Vehicle, or Maintenance) must be provided." };
  }

  const tollCost = parseFloat(tollCostStr);
  const otherCost = parseFloat(otherCostStr);

  if (isNaN(tollCost) || tollCost < 0) return { error: "Toll Cost must be a non-negative number." };
  if (isNaN(otherCost) || otherCost < 0) return { error: "Other Cost must be a non-negative number." };

  if (tollCost === 0 && otherCost === 0) {
    return { error: "You must enter at least some cost." };
  }

  try {
    await prisma.expense.create({
      data: {
        tripId,
        vehicleId,
        tollCost,
        otherCost,
        linkedMaintenanceId
      }
    });

    revalidatePath("/dashboard/fuel-expenses");
    return { success: true };
  } catch (error) {
    console.error("Failed to log expense:", error);
    return { error: "Failed to log expense. Please try again." };
  }
}

export async function getOperationalCosts(): Promise<Record<string, number>> {
  // We want to calculate the total cost per vehicle.
  // This involves summing FuelLog costs + MaintenanceLog costs.

  const fuelLogs = await prisma.fuelLog.groupBy({
    by: ['vehicleId'],
    _sum: {
      cost: true
    }
  });

  const maintenanceLogs = await prisma.maintenanceLog.groupBy({
    by: ['vehicleId'],
    _sum: {
      cost: true
    }
  });

  const costMap: Record<string, number> = {};

  for (const log of fuelLogs) {
    if (log._sum.cost) {
      costMap[log.vehicleId] = log._sum.cost;
    }
  }

  for (const log of maintenanceLogs) {
    if (log._sum.cost) {
      costMap[log.vehicleId] = (costMap[log.vehicleId] || 0) + log._sum.cost;
    }
  }

  return costMap;
}
