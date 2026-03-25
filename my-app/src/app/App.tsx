import { Route, Routes } from "react-router-dom";
import { AdminAppShell } from "@/features/admin-shell";
import { DashboardPage } from "@/features/dashboard";
import { DocumentManagementPage } from "@/features/document-management";
import { BoardManagementPage } from "@/features/board-management";
import { CrisisHouseholdsPage } from "@/features/crisis-households";
import { FacilityManagementPage } from "@/features/facility-management";
import { MemberManagementPage } from "@/features/member-management";
import { PolicyManagementPage } from "@/features/policy-management";
import { RiskManagementPage } from "@/features/risk-management";
import { ServiceManagementPage } from "@/features/service-management";
import { StatisticsPage } from "@/features/statistics";
import { SubjectDetailPage, SubjectsListPage } from "@/features/subjects";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminAppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="subjects" element={<SubjectsListPage />} />
        <Route path="subjects/:subjectId" element={<SubjectDetailPage />} />
        <Route path="services" element={<ServiceManagementPage />} />
        <Route path="risks" element={<RiskManagementPage />} />
        <Route path="documents" element={<DocumentManagementPage />} />
        <Route path="members" element={<MemberManagementPage />} />
        <Route path="boards" element={<BoardManagementPage />} />
        <Route path="policies" element={<PolicyManagementPage />} />
        <Route path="facilities" element={<FacilityManagementPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="crisis-households" element={<CrisisHouseholdsPage />} />
      </Route>
    </Routes>
  );
}
