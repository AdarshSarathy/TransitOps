import { prisma } from "@/lib/prisma";
import { getDashboardKPIs } from "@/app/actions/analytics";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const kpis = await getDashboardKPIs();
  
  const recentTrips = await prisma.trip.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      vehicle: true,
      driver: true
    }
  });

  const totalVehicles = Object.values(kpis.vehicleStatusCount).reduce((a: any, b: any) => a + b, 0);
  
  return (
    <DashboardClient 
      kpis={kpis} 
      recentTrips={recentTrips} 
      totalVehicles={totalVehicles} 
    />
  );
}
