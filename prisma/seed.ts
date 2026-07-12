import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Users (4 roles) ─────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("Transit@2026", 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "fleet.manager@transitops.in" },
      update: {},
      create: {
        email: "fleet.manager@transitops.in",
        password: passwordHash,
        role: "Fleet Manager",
      },
    }),
    prisma.user.upsert({
      where: { email: "dispatcher@transitops.in" },
      update: {},
      create: {
        email: "dispatcher@transitops.in",
        password: passwordHash,
        role: "Dispatcher",
      },
    }),
    prisma.user.upsert({
      where: { email: "safety.officer@transitops.in" },
      update: {},
      create: {
        email: "safety.officer@transitops.in",
        password: passwordHash,
        role: "Safety Officer",
      },
    }),
    prisma.user.upsert({
      where: { email: "financial.analyst@transitops.in" },
      update: {},
      create: {
        email: "financial.analyst@transitops.in",
        password: passwordHash,
        role: "Financial Analyst",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // ── Vehicles (5) ────────────────────────────────────────────────────────
  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { registrationNumber: "GJ01BH452" },
      update: {},
      create: {
        registrationNumber: "GJ01BH452",
        model: "VAN-05",
        capacity: "500 kg",
        odometer: 74000,
        acquisitionCost: 620000,
        status: "Available",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "GJ01BA998" },
      update: {},
      create: {
        registrationNumber: "GJ01BA998",
        model: "TRUCK-11",
        capacity: "5 Ton",
        odometer: 182000,
        acquisitionCost: 2450000,
        status: "On Trip",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "GJ01BH120" },
      update: {},
      create: {
        registrationNumber: "GJ01BH120",
        model: "MINI-03",
        capacity: "1 Ton",
        odometer: 66000,
        acquisitionCost: 410000,
        status: "In Shop",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "GJ01B008" },
      update: {},
      create: {
        registrationNumber: "GJ01B008",
        model: "VAN-09",
        capacity: "750 kg",
        odometer: 241900,
        acquisitionCost: 590000,
        status: "Retired",
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNumber: "GJ01BK337" },
      update: {},
      create: {
        registrationNumber: "GJ01BK337",
        model: "TRUCK-07",
        capacity: "8 Ton",
        odometer: 53200,
        acquisitionCost: 3100000,
        status: "Available",
      },
    }),
  ]);

  console.log(`✅ Created ${vehicles.length} vehicles`);

  // ── Drivers (5) ─────────────────────────────────────────────────────────
  const drivers = await Promise.all([
    prisma.driver.upsert({
      where: { licenseNumber: "DL-88215" },
      update: {},
      create: {
        name: "Alex Sharma",
        licenseNumber: "DL-88215",
        category: "LMV",
        expiryDate: new Date("2028-12-15"),
        contact: "9876500001",
        safetyScore: 96,
        status: "Available",
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "DL-44120" },
      update: {},
      create: {
        name: "John Patel",
        licenseNumber: "DL-44120",
        category: "HMV",
        expiryDate: new Date("2025-03-01"),
        contact: "9822000002",
        safetyScore: 81,
        status: "Suspended",
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "DL-77031" },
      update: {},
      create: {
        name: "Priya Desai",
        licenseNumber: "DL-77031",
        category: "LMV",
        expiryDate: new Date("2027-08-20"),
        contact: "9911000003",
        safetyScore: 99,
        status: "On Trip",
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "DL-90045" },
      update: {},
      create: {
        name: "Suresh Kumar",
        licenseNumber: "DL-90045",
        category: "HMV",
        expiryDate: new Date("2027-01-10"),
        contact: "9744000004",
        safetyScore: 88,
        status: "Off Duty",
      },
    }),
    prisma.driver.upsert({
      where: { licenseNumber: "DL-55678" },
      update: {},
      create: {
        name: "Meera Rao",
        licenseNumber: "DL-55678",
        category: "LMV",
        expiryDate: new Date("2029-05-30"),
        contact: "9866000005",
        safetyScore: 94,
        status: "Available",
      },
    }),
  ]);

  console.log(`✅ Created ${drivers.length} drivers`);

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
