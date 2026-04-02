import type { SubjectRiskLevel } from "@/features/subjects/services/subjectWorkspaceMock";

/** 화면 표기 레이블 — 4단계 고정 */
export const RISK_LABEL: Record<SubjectRiskLevel, string> = {
  critical: "긴급",
  watch:    "주의",
  concern:  "관심",
  normal:   "정상",
};

/**
 * 위험 등급 뱃지 색상 클래스만 반환.
 * 구조 클래스(rounded, px, py, text-size…)는 사용 측에서 적용.
 */
export function riskBadgeClasses(level: SubjectRiskLevel): string {
  switch (level) {
    case "critical": return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200";
    case "watch":    return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
    case "concern":  return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200";
    default:         return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";
  }
}
