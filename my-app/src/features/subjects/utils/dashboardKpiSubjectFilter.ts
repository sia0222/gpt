import type { SubjectListItem } from "@/features/subjects/services/subjectWorkspaceMock";

/** 대시보드 KPI 카드 → 목록 필터 (`?kpi=`) */
export function applyDashboardKpiFilter(
  rows: readonly SubjectListItem[],
  kpi: string | null,
): SubjectListItem[] {
  if (!kpi || kpi === "total") {
    return [...rows];
  }
  switch (kpi) {
    case "normal":
      return rows.filter((r) => r.riskLevel === "normal");
    case "concern":
      return rows.filter((r) => r.riskLevel === "concern");
    case "watch":
      return rows.filter((r) => r.riskLevel === "watch");
    case "danger":
      return rows.filter((r) => r.riskLevel === "high");
    case "critical":
      return rows.filter((r) => r.riskLevel === "critical");
    case "pending":
      return rows.filter((r) => r.activeAlerts.length > 0);
    case "no_signal":
      return rows.filter(
        (r) =>
          r.devicesOnline.startsWith("0/") ||
          r.deviceHint.includes("미수신") ||
          r.deviceHint.includes("오프라인") ||
          r.deviceHint.includes("끊김"),
      );
    default:
      return [...rows];
  }
}
