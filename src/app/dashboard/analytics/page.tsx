import { getAnalyticsData, getDashboardKPIs } from "@/app/actions/analytics";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData();
  const kpis = await getDashboardKPIs();

  return (
    <AnalyticsClient 
      analyticsData={analyticsData}
      fleetUtilization={kpis.utilization}
    />
  );
}
