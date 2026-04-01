import type { SubjectRiskLevel } from "@/features/subjects/services/subjectWorkspaceMock";

export const RISK_LABEL: Record<SubjectRiskLevel, string> = {
  critical: "긴급",
  high: "위험",
  watch: "주의",
  concern: "관심",
  normal: "정상",
};

export function riskBadgeClasses(level: SubjectRiskLevel) {
  switch (level) {
    case "critical":
      return "bg-rose-600 text-white ring-1 ring-rose-700/30";
    case "high":
      return "bg-rose-100 text-rose-900 ring-1 ring-rose-200";
    case "watch":
      return "bg-amber-100 text-amber-900 ring-1 ring-amber-200";
    case "concern":
      return "bg-sky-100 text-sky-900 ring-1 ring-sky-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}
