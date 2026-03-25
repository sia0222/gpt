import { Route } from "react-router-dom";
import { ContentPage } from "@/features/content/pages/ContentPage";

export function ContentRoutes() {
  return <Route path="content" element={<ContentPage />} />;
}
