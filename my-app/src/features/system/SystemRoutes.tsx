import { Route } from "react-router-dom";
import { SystemPage } from "@/features/system/pages/SystemPage";

export function SystemRoutes() {
  return <Route path="system" element={<SystemPage />} />;
}
