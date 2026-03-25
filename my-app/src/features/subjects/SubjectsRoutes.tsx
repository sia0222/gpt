import { Route } from "react-router-dom";
import { SubjectsWorkspacePage } from "@/features/subjects/pages/SubjectsWorkspacePage";

export function SubjectsRoutes() {
  return <Route path="subjects" element={<SubjectsWorkspacePage />} />;
}
