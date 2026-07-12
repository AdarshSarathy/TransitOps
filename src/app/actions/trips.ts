"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper function to parse capacity string (e.g. "500 kg", "5 Ton") into a number of kg
function parseCapacity(capacityStr: string): number {
  const normalized = capacityStr.toLowerCase().trim();
  const num = parseFloat(normalized);

  if (isNaN(num)) return 0;

  if (normalized.includes("ton")) {
    return num * 1000;
  }
  return num; // assuming base is kg
}

export async function enforceCompliance() {
  const now = new Date();
  
  // Find drivers who are expired and NOT suspended
  const driversToSuspend = await prisma.driver.findMany({
    where: {
      expiryDate: {
        lt: now
      },
      status: {
        not: "Suspended"
      }
    }
  });

  if (driversToSuspend.length > 0) {
    await prisma.driver.updateMany({
      where: {
        id: {
          in: driversToSuspend.map(d => d.id)
        }
      },
      data: {
        status: "Suspended"
      }
    });
  }
}

export interface ActionState {
  error?: string;
  success?: boolean;
}

export async function createTrip(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await enforceCompliance();

  const source = formData.get("source")?.toString().trim();
  const destination = formData.get("destination")?.toString().trim();
  const vehicleId = formData.get("vehicleId")?.toString().trim();
  const driverId = formData.get("driverId")?.toString().trim();
  const cargoWeightStr = formData.get("cargoWeight")?.toString().trim();
  const plannedDistanceStr = formData.get("plannedDistance")?.toString().trim();

  if (!source || !destination || !vehicleId || !driverId || !cargoWeightStr || !plannedDistanceStr) {
    return { error: "All fields are required." };
  }

  const cargoWeight = parseFloat(cargoWeightStr);
  const plannedDistance = parseFloat(plannedDistanceStr);

  if (isNaN(cargoWeight) || cargoWeight <= 0) {
    return { error: "Cargo weight must be a valid positive number." };
  }

  if (isNaN(plannedDistance) || plannedDistance <= 0) {
    return { error: "Planned distance must be a valid positive number." };
  }

  // Fetch Vehicle and Driver
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  const driver = await prisma.driver.findUnique({ where: { id: driverId } });

  if (!vehicle) return { error: "Vehicle not found." };
  if (!driver) return { error: "Driver not found." };

  if (vehicle.status !== "Available") {
    return { error: "Selected vehicle is not available." };
  }

  if (driver.status !== "Available") {
    return { error: "Selected driver is not available." };
  }

  if (driver.expiryDate < new Date() || driver.status === "Suspended") {
    return { error: "Driver is suspended or license is expired." };
  }

  const vehicleCapacityKg = parseCapacity(vehicle.capacity);
  if (cargoWeight > vehicleCapacityKg) {
    return { error: `Capacity exceeded. Maximum allowed is ${vehicleCapacityKg} kg.` };
  }

  try {
    await prisma.trip.create({
      data: {
        source,
        destination,
        vehicleId,
        driverId,
        cargoWeight,
        plannedDistance,
        status: "Draft"
      }
    });

    revalidatePath("/dashboard/trips");
    return { success: true };
  } catch (error) {
    console.error("Failed to create trip:", error);
    return { error: "Failed to create trip. Please try again." };
  }
}

export async function dispatchTrip(id: string): Promise<ActionState> {
  await enforceCompliance();

  const trip = await prisma.trip.findUnique({ where: { id }, include: { driver: true, vehicle: true } });
  if (!trip) return { error: "Trip not found." };
  if (trip.status !== "Draft") return { error: "Only Draft trips can be dispatched." };

  if (trip.driver?.status !== "Available") return { error: "Driver is no longer available." };
  if (trip.vehicle?.status !== "Available") return { error: "Vehicle is no longer available." };
  if (trip.driver?.expiryDate && trip.driver.expiryDate < new Date()) return { error: "Driver license has expired." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.trip.update({
        where: { id },
        data: { status: "Dispatched" }
      });

      if (trip.vehicleId) {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: "On Trip" }
        });
      }

      if (trip.driverId) {
        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: "On Trip" }
        });
      }
    });

    revalidatePath("/dashboard/trips");
    revalidatePath("/dashboard/fleet");
    revalidatePath("/dashboard/drivers");
    return { success: true };
  } catch (error) {
    console.error("Failed to dispatch trip:", error);
    return { error: "Failed to dispatch trip." };
  }
}

export async function completeTrip(id: string): Promise<ActionState> {
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) return { error: "Trip not found." };
  if (trip.status !== "Dispatched") return { error: "Only Dispatched trips can be completed." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.trip.update({
        where: { id },
        data: { status: "Completed" }
      });

      if (trip.vehicleId) {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: "Available" }
        });
      }

      if (trip.driverId) {
        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: "Available" }
        });
      }
    });

    revalidatePath("/dashboard/trips");
    revalidatePath("/dashboard/fleet");
    revalidatePath("/dashboard/drivers");
    return { success: true };
  } catch (error) {
    console.error("Failed to complete trip:", error);
    return { error: "Failed to complete trip." };
  }
}

export async function cancelTrip(id: string): Promise<ActionState> {
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) return { error: "Trip not found." };
  if (trip.status === "Completed" || trip.status === "Cancelled") return { error: "Cannot cancel a completed or already cancelled trip." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.trip.update({
        where: { id },
        data: { status: "Cancelled" }
      });

      if (trip.vehicleId) {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: "Available" }
        });
      }

      if (trip.driverId) {
        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: "Available" }
        });
      }
    });

    revalidatePath("/dashboard/trips");
    revalidatePath("/dashboard/fleet");
    revalidatePath("/dashboard/drivers");
    return { success: true };
  } catch (error) {
    console.error("Failed to cancel trip:", error);
    return { error: "Failed to cancel trip." };
  }
}
