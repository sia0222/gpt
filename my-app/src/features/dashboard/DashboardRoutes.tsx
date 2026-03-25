import { Route } from "react-router-dom";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

export function DashboardRoutes() {
  return <Route index element={<DashboardPage />} />;
}
