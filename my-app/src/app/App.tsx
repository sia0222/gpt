import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/features/home";

export function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}
