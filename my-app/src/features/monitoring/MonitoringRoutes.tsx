import { Route } from "react-router-dom";
import { MonitoringPage } from "@/features/monitoring/pages/MonitoringPage";

export function MonitoringRoutes() {
  return <Route path="monitoring" element={<MonitoringPage />} />;
}
