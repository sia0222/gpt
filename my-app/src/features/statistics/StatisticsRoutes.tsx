import { Route } from "react-router-dom";
import { StatisticsPage } from "@/features/statistics/pages/StatisticsPage";

export function StatisticsRoutes() {
  return <Route path="statistics" element={<StatisticsPage />} />;
}
