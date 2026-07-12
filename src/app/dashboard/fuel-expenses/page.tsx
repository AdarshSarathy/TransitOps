import { prisma } from "@/lib/prisma";
import { getOperationalCosts } from "@/app/actions/finance";
import { FinanceClient } from "./finance-client";
import { getSession } from "@/lib/auth";

export default async function FuelExpensesPage() {
  const session = await getSession();
  const userRole = session?.role || "Unknown";
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
  });

  const maintenanceLogs = await prisma.maintenanceLog.findMany({
    orderBy: { createdAt: "desc" },
  });

  const fuelLogs = await prisma.fuelLog.findMany({
    include: {
      vehicle: true,
    },
    orderBy: { date: "desc" },
  });

  const expenses = await prisma.expense.findMany({
    include: {
      vehicle: true,
      trip: true,
      linkedMaintenance: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const costMap = await getOperationalCosts();
  const totalOperationalCost = Object.values(costMap).reduce((acc, curr) => acc + curr, 0);

  return (
    <FinanceClient
      vehicles={vehicles}
      trips={trips}
      maintenanceLogs={maintenanceLogs}
      fuelLogs={fuelLogs}
      expenses={expenses}
      totalOperationalCost={totalOperationalCost}
      userRole={userRole}
    />
  );
}
