import { getVehicles } from "@/app/actions/master-data";
import { VehicleRegistryClient } from "./vehicle-registry-client";
import { getSession } from "@/lib/auth";

export default async function FleetPage() {
  const session = await getSession();
  const userRole = session?.role || "Unknown";
  const vehicles = await getVehicles();

  return <VehicleRegistryClient initialVehicles={vehicles} userRole={userRole} />;
}
