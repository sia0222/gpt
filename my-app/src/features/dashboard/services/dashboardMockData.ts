/** 대시보드 목업 데이터 (API 없음) — 와이어프레임 §1 기준 */

export type KpiSentiment = "positive" | "negative" | "neutral";

/** KPI 카드 → 대상자 목록 필터 쿼리 `?kpi=` */
export type DashboardKpiKey =
  | "total"
  | "normal"
  | "concern"
  | "watch"
  | "danger"
  | "critical"
  | "pending"
  | "no_signal";

export interface DashboardKpiItem {
  readonly key: DashboardKpiKey;
  readonly label: string;
  readonly value: string;
  readonly numericValue: number;
  readonly hint: string;
  readonly delta: string;
  readonly sentiment: KpiSentiment;
}

export const KPI_ROW: readonly DashboardKpiItem[] = [
  { key: "total", label: "전체 대상자", value: "12,480", numericValue: 12480, hint: "등록 기준", delta: "+0.6%", sentiment: "positive" },
  { key: "normal", label: "정상", value: "9,020", numericValue: 9020, hint: "위험등급 정상", delta: "+0.2%", sentiment: "positive" },
  { key: "concern", label: "관심", value: "1,842", numericValue: 1842, hint: "AI 관심 구간", delta: "+12명", sentiment: "neutral" },
  { key: "watch", label: "주의", value: "1,580", numericValue: 1580, hint: "모니터링 강화", delta: "−8", sentiment: "positive" },
  { key: "danger", label: "위험", value: "312", numericValue: 312, hint: "즉시 점검 권고", delta: "+3", sentiment: "negative" },
  { key: "critical", label: "긴급", value: "24", numericValue: 24, hint: "응급 프로토콜", delta: "−2", sentiment: "positive" },
  { key: "pending", label: "미조치", value: "47", numericValue: 47, hint: "조치 미완료 알림", delta: "−5", sentiment: "positive" },
  { key: "no_signal", label: "미수신", value: "156", numericValue: 156, hint: "센서·단말 미수신", delta: "+4", sentiment: "negative" },
] as const;

/** 주요 KPI (상단 4대 스코어카드) */
export interface ScoreCardData {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly sentiment: KpiSentiment;
  readonly color: string;          // tailwind color token
  readonly sparkline: number[];    // 최근 7일 추세
}

export const SCORECARDS: readonly ScoreCardData[] = [
  {
    id: "active",
    label: "실시간 모니터링",
    value: "12,324",
    delta: "98.7% 온라인",
    sentiment: "positive",
    color: "emerald",
    sparkline: [88, 92, 89, 95, 93, 97, 98.7],
  },
  {
    id: "alerts",
    label: "금일 발생 알림",
    value: "38",
    delta: "+5 (전일 대비)",
    sentiment: "negative",
    color: "rose",
    sparkline: [22, 18, 25, 30, 28, 33, 38],
  },
  {
    id: "risk",
    label: "위험·긴급 대상자",
    value: "336",
    delta: "+1 (전일 대비)",
    sentiment: "negative",
    color: "amber",
    sparkline: [310, 318, 322, 325, 330, 335, 336],
  },
  {
    id: "resolved",
    label: "24h 조치 완료율",
    value: "78%",
    delta: "+2.4%p",
    sentiment: "positive",
    color: "blue",
    sparkline: [68, 71, 73, 72, 74, 76, 78],
  },
] as const;

export interface RiskTopSubject {
  readonly id: string;
  readonly name: string;
  readonly gradeLabel: string;
  readonly gradeLevel: "critical" | "danger" | "watch" | "concern";
  readonly reason: string;
  readonly occurredAt: string;
  readonly assignee: string;
  readonly avatar: string;
}

export const RISK_TOP_SUBJECTS: readonly RiskTopSubject[] = [
  {
    id: "s6",
    name: "송○○",
    gradeLabel: "긴급",
    gradeLevel: "critical",
    reason: "거실 미활동 62분 · 응급콜 미응답",
    occurredAt: "11:51",
    assignee: "응급반장",
    avatar: "송",
  },
  {
    id: "s2",
    name: "김영희",
    gradeLabel: "위험",
    gradeLevel: "danger",
    reason: "심박 상한 초과 (108bpm)",
    occurredAt: "11:24",
    assignee: "이상담",
    avatar: "김",
  },
  {
    id: "s1",
    name: "홍길동",
    gradeLabel: "관심",
    gradeLevel: "concern",
    reason: "실내 CO₂ 임계 근접",
    occurredAt: "11:40",
    assignee: "박간호",
    avatar: "홍",
  },
  {
    id: "s4",
    name: "최○○",
    gradeLabel: "주의",
    gradeLevel: "watch",
    reason: "단말 미수신 · 서비스 일시중지",
    occurredAt: "09:12",
    assignee: "박간호",
    avatar: "최",
  },
] as const;

export type RealtimeAlertKind =
  | "heart"
  | "activity"
  | "sensor"
  | "emergency"
  | "counsel";

export interface RealtimeAlertItem {
  readonly id: string;
  readonly kind: RealtimeAlertKind;
  readonly label: string;
  readonly message: string;
  readonly time: string;
  readonly subjectId?: string;
  readonly subjectName?: string;
}

export const REALTIME_ALERTS: readonly RealtimeAlertItem[] = [
  {
    id: "a1",
    kind: "heart",
    label: "심박 이상",
    message: "김영희 · 심박 108 bpm (상한 초과)",
    time: "11:24",
    subjectId: "s2",
    subjectName: "김영희",
  },
  {
    id: "a2",
    kind: "activity",
    label: "활동 미감지",
    message: "송○○ · 거실 미활동 62분",
    time: "11:51",
    subjectId: "s6",
    subjectName: "송○○",
  },
  {
    id: "a3",
    kind: "sensor",
    label: "센서 미수신",
    message: "최○○ · LTE 허브 2시간 무응답",
    time: "09:12",
    subjectId: "s4",
    subjectName: "최○○",
  },
  {
    id: "a4",
    kind: "emergency",
    label: "긴급호출",
    message: "한○○ · 응급 버튼 1회",
    time: "10:02",
    subjectId: "s3",
    subjectName: "이민수",
  },
  {
    id: "a5",
    kind: "counsel",
    label: "상담 위험",
    message: "AI 스피커 · '힘들다'·'끝내고' 반복 탐지",
    time: "08:55",
    subjectId: "s5",
    subjectName: "정○○",
  },
] as const;

export const ALERT_KIND_LABEL: Record<RealtimeAlertKind, string> = {
  heart: "심박 이상",
  activity: "활동 미감지",
  sensor: "센서 미수신",
  emergency: "긴급호출",
  counsel: "상담 위험 키워드",
};

export interface DongRiskBucket {
  readonly dong: string;
  readonly riskScore: number;
  readonly subjectCount: number;
  readonly critical: number;
  readonly danger: number;
  readonly watch: number;
}

/** 동별 위험도 분포 */
export const DONG_RISK_DISTRIBUTION: readonly DongRiskBucket[] = [
  { dong: "○○동", riskScore: 72, subjectCount: 1840, critical: 5, danger: 48, watch: 120 },
  { dong: "△△동", riskScore: 58, subjectCount: 1520, critical: 2, danger: 35, watch: 98 },
  { dong: "□□동", riskScore: 81, subjectCount: 1210, critical: 8, danger: 62, watch: 145 },
  { dong: "◇◇동", riskScore: 44, subjectCount: 980, critical: 1, danger: 22, watch: 64 },
  { dong: "☆☆동", riskScore: 39, subjectCount: 760, critical: 0, danger: 14, watch: 42 },
] as const;

export interface ServiceUsageItem {
  readonly serviceName: string;
  readonly enrolled: number;
  readonly color: string;
}

export const SERVICE_USAGE_MOCK: readonly ServiceUsageItem[] = [
  { serviceName: "방문요양", enrolled: 3560, color: "bg-blue-500" },
  { serviceName: "주간보호", enrolled: 1280, color: "bg-emerald-500" },
  { serviceName: "돌봄 SOS", enrolled: 890, color: "bg-purple-500" },
  { serviceName: "전화상담", enrolled: 2100, color: "bg-amber-500" },
  { serviceName: "활동지원", enrolled: 420, color: "bg-rose-500" },
] as const;

export const DUPLICATE_SUPPORT_WARNINGS = {
  count: 38,
  caption: "동일·유사 목적 서비스 중복 의심 건수 (목업)",
} as const;

/** AI 분석 변화 추이 */
export interface AiTrendItem {
  readonly title: string;
  readonly description: string;
  readonly tone: "danger" | "warning" | "success";
  readonly stat: string;
}

export const AI_TREND_DATA: readonly AiTrendItem[] = [
  {
    title: "위험등급 상향",
    description: "지난 7일 기준 등급 변동",
    tone: "danger",
    stat: "+14명",
  },
  {
    title: "신규 위험 진입",
    description: "어제 대비 활동 급감·상담 키워드 복합",
    tone: "warning",
    stat: "+6명",
  },
  {
    title: "조치 완료율",
    description: "24h 내 완료 · 평균 2.4시간",
    tone: "success",
    stat: "78%",
  },
] as const;

/** AI 분석 변화 추이 (텍스트 카드) — 레거시 호환 */
export const AI_TREND_LINES = [
  "위험등급 상향: 지난 7일 +14명 (관심→주의 9, 주의→위험 5)",
  "신규 위험 진입: 어제 대비 +6명 (활동 급감·상담 키워드 복합)",
  "조치 완료율: 24h 내 78% · 평균 조치 소요 2.4시간",
] as const;

export const MAP_PLACEHOLDER_CAPTION =
  "지도 기반 위험 밀집도 (목업) — 선택 동과 연동해 대상자 현황을 재조회할 수 있습니다.";

/** 기기 상태 요약 */
export interface DeviceStatus {
  readonly label: string;
  readonly count: number;
  readonly color: string;
}

export const DEVICE_STATUS: readonly DeviceStatus[] = [
  { label: "온라인", count: 11840, color: "bg-emerald-500" },
  { label: "오프라인", count: 21, color: "bg-zinc-400" },
  { label: "미수신", count: 14, color: "bg-amber-500" },
  { label: "배터리 임계", count: 31, color: "bg-rose-500" },
] as const;
