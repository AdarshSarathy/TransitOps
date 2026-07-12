import { getVehicles } from "@/app/actions/master-data";
import { VehicleRegistryClient } from "./vehicle-registry-client";

export default async function FleetPage() {
  const vehicles = await getVehicles();

  return <VehicleRegistryClient initialVehicles={vehicles} />;
}
