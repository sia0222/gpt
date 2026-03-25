import { Route } from "react-router-dom";
import { OperationsPage } from "@/features/operations/pages/OperationsPage";

export function OperationsRoutes() {
  return <Route path="operations" element={<OperationsPage />} />;
}
