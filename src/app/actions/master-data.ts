"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Vehicle, Driver } from "@prisma/client";

// ═══════════════════════════════════════════════════════════════════════════
// VEHICLES
// ═══════════════════════════════════════════════════════════════════════════

export async function getVehicles(): Promise<Vehicle[]> {
  return prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export interface CreateVehicleState {
  error?: string;
  success?: boolean;
}

export async function createVehicle(
  _prevState: CreateVehicleState,
  formData: FormData
): Promise<CreateVehicleState> {
  const registrationNumber = formData.get("registrationNumber")?.toString().trim();
  const model = formData.get("model")?.toString().trim();
  const capacity = formData.get("capacity")?.toString().trim();
  const odometerStr = formData.get("odometer")?.toString().trim();
  const acquisitionCostStr = formData.get("acquisitionCost")?.toString().trim();
  const status = formData.get("status")?.toString().trim() || "Available";

  // Validation
  if (!registrationNumber || !model || !capacity || !odometerStr || !acquisitionCostStr) {
    return { error: "All fields are required." };
  }

  const odometer = parseInt(odometerStr, 10);
  const acquisitionCost = parseFloat(acquisitionCostStr);

  if (isNaN(odometer) || odometer < 0) {
    return { error: "Odometer must be a valid positive number." };
  }

  if (isNaN(acquisitionCost) || acquisitionCost < 0) {
    return { error: "Acquisition cost must be a valid positive number." };
  }

  const validStatuses = ["Available", "On Trip", "In Shop", "Retired"];
  if (!validStatuses.includes(status)) {
    return { error: "Invalid status selected." };
  }

  // Check uniqueness of registrationNumber
  const existing = await prisma.vehicle.findUnique({
    where: { registrationNumber },
  });

  if (existing) {
    return { error: `Registration number "${registrationNumber}" already exists.` };
  }

  try {
    await prisma.vehicle.create({
      data: {
        registrationNumber,
        model,
        capacity,
        odometer,
        acquisitionCost,
        status,
      },
    });

    revalidatePath("/dashboard/fleet");
    return { success: true };
  } catch {
    return { error: "Failed to create vehicle. Please try again." };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DRIVERS
// ═══════════════════════════════════════════════════════════════════════════

export async function getDrivers(): Promise<Driver[]> {
  return prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export interface CreateDriverState {
  error?: string;
  success?: boolean;
}

export async function createDriver(
  _prevState: CreateDriverState,
  formData: FormData
): Promise<CreateDriverState> {
  const name = formData.get("name")?.toString().trim();
  const licenseNumber = formData.get("licenseNumber")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const expiryDateStr = formData.get("expiryDate")?.toString().trim();
  const contact = formData.get("contact")?.toString().trim();
  const safetyScoreStr = formData.get("safetyScore")?.toString().trim();
  const status = formData.get("status")?.toString().trim() || "Available";

  // Validation
  if (!name || !licenseNumber || !category || !expiryDateStr || !contact) {
    return { error: "All fields are required." };
  }

  const validCategories = ["LMV", "HMV"];
  if (!validCategories.includes(category)) {
    return { error: "Category must be LMV or HMV." };
  }

  const expiryDate = new Date(expiryDateStr);
  if (isNaN(expiryDate.getTime())) {
    return { error: "Invalid expiry date." };
  }

  const safetyScore = safetyScoreStr ? parseInt(safetyScoreStr, 10) : 100;
  if (isNaN(safetyScore) || safetyScore < 0 || safetyScore > 100) {
    return { error: "Safety score must be between 0 and 100." };
  }

  const validStatuses = ["Available", "On Trip", "Off Duty", "Suspended"];
  if (!validStatuses.includes(status)) {
    return { error: "Invalid status selected." };
  }

  // Check uniqueness of licenseNumber
  const existing = await prisma.driver.findUnique({
    where: { licenseNumber },
  });

  if (existing) {
    return { error: `License number "${licenseNumber}" already exists.` };
  }

  try {
    await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        category,
        expiryDate,
        contact,
        safetyScore,
        status,
      },
    });

    revalidatePath("/dashboard/drivers");
    return { success: true };
  } catch {
    return { error: "Failed to create driver. Please try again." };
  }
}

export async function sendLicenseReminder(driverId: string): Promise<CreateDriverState> {
  const driver = await prisma.driver.findUnique({ where: { id: driverId } });
  
  if (!driver) {
    return { error: "Driver not found" };
  }

  // Mocking the email transport
  console.log(`[EMAIL TRANSPORT MOCK] Sending license reminder to driver: ${driver.name} (License: ${driver.licenseNumber})`);
  console.log(`[EMAIL TRANSPORT MOCK] Expiry Date: ${driver.expiryDate}`);

  // In a real application, you would use Nodemailer, Resend, SendGrid, etc. here

  return { success: true };
}
