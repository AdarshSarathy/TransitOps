import { prisma } from "@/lib/prisma";
import { MaintenanceClient } from "./maintenance-client";

export default async function MaintenancePage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  const maintenanceLogs = await prisma.maintenanceLog.findMany({
    include: {
      vehicle: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <MaintenanceClient
      vehicles={vehicles}
      initialLogs={maintenanceLogs}
    />
  );
}
