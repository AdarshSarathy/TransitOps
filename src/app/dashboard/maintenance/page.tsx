import { prisma } from "@/lib/prisma";
import { MaintenanceClient } from "./maintenance-client";
import { getSession } from "@/lib/auth";

export default async function MaintenancePage() {
  const session = await getSession();
  const userRole = session?.role || "Unknown";
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
      userRole={userRole}
    />
  );
}
