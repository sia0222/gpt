export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RuleStatus = "ACTIVE" | "DRAFT" | "PAUSED";

export interface RiskRule {
  readonly id: string;
  readonly name: string;
  readonly signal: string;
  readonly operator: ">" | ">=" | "<" | "<=" | "between";
  readonly threshold: string;
  readonly level: RiskLevel;
  readonly targetScope: string;
  readonly action: string;
  readonly status: RuleStatus;
  readonly updatedAt: string;
}

export interface LiveSignalValue {
  readonly signal: string;
  readonly unit: string;
  readonly value: number;
  readonly normalRange: string;
  readonly source: string;
}

export interface RiskEvaluationResult {
  readonly subjectName: string;
  readonly subjectId: string;
  readonly district: string;
  readonly matchedRuleId: string;
  readonly matchedRuleName: string;
  readonly level: RiskLevel;
  readonly signalValue: string;
  readonly detectedAt: string;
  readonly actionStatus: string;
}

export const RISK_RULES_MOCK: readonly RiskRule[] = [
  {
    id: "rule-co2-01",
    name: "실내 CO2 과다",
    signal: "CO2",
    operator: ">=",
    threshold: "900",
    level: "HIGH",
    targetScope: "가정 설치형 CO2 센서",
    action: "즉시 환기 알림 + 보호자 PUSH",
    status: "ACTIVE",
    updatedAt: "2026-03-25 10:10",
  },
  {
    id: "rule-heart-01",
    name: "심박 급등",
    signal: "심박",
    operator: ">",
    threshold: "105",
    level: "CRITICAL",
    targetScope: "심박 밴드 사용자",
    action: "콜센터 자동 연결 + 2차 보호자 연락",
    status: "ACTIVE",
    updatedAt: "2026-03-25 09:42",
  },
  {
    id: "rule-motion-01",
    name: "야간 미활동",
    signal: "미활동 시간",
    operator: ">=",
    threshold: "45",
    level: "HIGH",
    targetScope: "단독가구 22:00~06:00",
    action: "현장 확인 요청",
    status: "ACTIVE",
    updatedAt: "2026-03-24 18:30",
  },
  {
    id: "rule-temp-01",
    name: "실내 저체온 위험",
    signal: "실내 온도",
    operator: "<=",
    threshold: "16",
    level: "MEDIUM",
    targetScope: "겨울철 전 가구",
    action: "난방 점검 알림",
    status: "DRAFT",
    updatedAt: "2026-03-24 08:13",
  },
] as const;

export const LIVE_SIGNAL_VALUES_MOCK: readonly LiveSignalValue[] = [
  { signal: "CO2", unit: "ppm", value: 985, normalRange: "400~900", source: "거실 센서" },
  { signal: "심박", unit: "bpm", value: 108, normalRange: "55~100", source: "웨어러블 밴드" },
  { signal: "미활동 시간", unit: "분", value: 62, normalRange: "0~30", source: "활동 감지 센서" },
  { signal: "실내 온도", unit: "C", value: 22.8, normalRange: "18~26", source: "환경 센서" },
] as const;

export const RISK_EVALUATION_RESULTS_MOCK: readonly RiskEvaluationResult[] = [
  {
    subjectName: "송○○",
    subjectId: "s6",
    district: "□□동",
    matchedRuleId: "rule-motion-01",
    matchedRuleName: "야간 미활동",
    level: "CRITICAL",
    signalValue: "미활동 62분",
    detectedAt: "2026-03-25 11:51",
    actionStatus: "현장 확인 배정 완료",
  },
  {
    subjectName: "김영희",
    subjectId: "s2",
    district: "△△동",
    matchedRuleId: "rule-heart-01",
    matchedRuleName: "심박 급등",
    level: "CRITICAL",
    signalValue: "심박 108 bpm",
    detectedAt: "2026-03-25 11:24",
    actionStatus: "보호자 통화 완료",
  },
  {
    subjectName: "홍길동",
    subjectId: "s1",
    district: "○○동",
    matchedRuleId: "rule-co2-01",
    matchedRuleName: "실내 CO2 과다",
    level: "HIGH",
    signalValue: "CO2 985 ppm",
    detectedAt: "2026-03-25 11:40",
    actionStatus: "환기 안내 전송",
  },
] as const;
