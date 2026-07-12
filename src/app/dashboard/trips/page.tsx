import { prisma } from "@/lib/prisma";
import { TripDispatcherClient } from "./trip-dispatcher-client";

export default async function TripsPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
  });

  const trips = await prisma.trip.findMany({
    include: {
      vehicle: true,
      driver: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <TripDispatcherClient
      vehicles={vehicles}
      drivers={drivers}
      initialTrips={trips}
    />
  );
}
