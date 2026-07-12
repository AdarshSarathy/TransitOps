"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ActionState } from "./trips";
import { getSession } from "@/lib/auth";

export async function createMaintenanceLog(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (session?.role !== "Fleet Manager") {
    throw new Error("Unauthorized: Invalid Role.");
  }

  const vehicleId = formData.get("vehicleId")?.toString().trim();
  const serviceType = formData.get("serviceType")?.toString().trim();
  const costStr = formData.get("cost")?.toString().trim();
  const dateStr = formData.get("date")?.toString().trim();

  if (!vehicleId || !serviceType || !costStr || !dateStr) {
    return { error: "All fields are required." };
  }

  const cost = parseFloat(costStr);
  if (isNaN(cost) || cost < 0) {
    return { error: "Cost must be a valid positive number." };
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { error: "Invalid date format." };
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    return { error: "Vehicle not found." };
  }
  
  if (vehicle.status === "Retired") {
    return { error: "Cannot log maintenance for a retired vehicle." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create maintenance log
      await tx.maintenanceLog.create({
        data: {
          vehicleId,
          serviceType,
          cost,
          date,
          status: "Active"
        }
      });

      // 2. Update vehicle status
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: "In Shop" }
      });
    });

    revalidatePath("/dashboard/maintenance");
    revalidatePath("/dashboard/fleet");
    return { success: true };
  } catch (error) {
    console.error("Failed to create maintenance log:", error);
    return { error: "Failed to create maintenance log. Please try again." };
  }
}

export async function closeMaintenanceLog(id: string): Promise<ActionState> {
  const session = await getSession();
  if (session?.role !== "Fleet Manager") {
    throw new Error("Unauthorized: Invalid Role.");
  }

  const log = await prisma.maintenanceLog.findUnique({ 
    where: { id },
    include: { vehicle: true }
  });
  
  if (!log) return { error: "Maintenance log not found." };
  if (log.status === "Closed") return { error: "Log is already closed." };

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update log status
      await tx.maintenanceLog.update({
        where: { id },
        data: { status: "Closed" }
      });

      // 2. Update vehicle status if not retired
      if (log.vehicle && log.vehicle.status !== "Retired") {
        await tx.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: "Available" }
        });
      }
    });

    revalidatePath("/dashboard/maintenance");
    revalidatePath("/dashboard/fleet");
    return { success: true };
  } catch (error) {
    console.error("Failed to close maintenance log:", error);
    return { error: "Failed to close maintenance log." };
  }
}
