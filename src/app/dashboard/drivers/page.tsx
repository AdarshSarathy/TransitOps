import { getDrivers } from "@/app/actions/master-data";
import { DriverProfilesClient } from "./driver-profiles-client";
import { getSession } from "@/lib/auth";

export default async function DriversPage() {
  const session = await getSession();
  const userRole = session?.role || "Unknown";
  const drivers = await getDrivers();

  return <DriverProfilesClient initialDrivers={drivers} userRole={userRole} />;
}
