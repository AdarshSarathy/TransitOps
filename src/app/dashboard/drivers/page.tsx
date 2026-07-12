import { getDrivers } from "@/app/actions/master-data";
import { DriverProfilesClient } from "./driver-profiles-client";

export default async function DriversPage() {
  const drivers = await getDrivers();

  return <DriverProfilesClient initialDrivers={drivers} />;
}
