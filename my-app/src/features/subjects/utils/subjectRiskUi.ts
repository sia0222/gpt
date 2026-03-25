import type { SubjectRiskLevel } from "@/features/subjects/services/subjectWorkspaceMock";

export const RISK_LABEL: Record<SubjectRiskLevel, string> = {
  critical: "긴급",
  high: "높음",
  watch: "주의",
  normal: "안전",
};

export function riskBadgeClasses(level: SubjectRiskLevel) {
  switch (level) {
    case "critical":
      return "bg-rose-600 text-white ring-1 ring-rose-700/30";
    case "high":
      return "bg-rose-100 text-rose-900 ring-1 ring-rose-200";
    case "watch":
      return "bg-amber-100 text-amber-900 ring-1 ring-amber-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}
