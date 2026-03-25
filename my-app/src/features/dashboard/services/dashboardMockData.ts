/** 대시보드 목업 데이터 (API 없음) */

export type KpiSentiment = "positive" | "negative" | "neutral";

export const KPI_ROW = [
  { key: "total", label: "전체 대상자", value: "12,480", hint: "등록 기준", delta: "+0.8%", sentiment: "positive" as const },
  { key: "active", label: "서비스 이용중", value: "9,845", hint: "이용중", delta: "+1.2%", sentiment: "positive" as const },
  { key: "risk", label: "위험 대상자", value: "38명", hint: "주의·위험", delta: "−3", sentiment: "positive" as const },
  { key: "offline", label: "오프라인 기기", value: "21대", hint: "미수신 포함", delta: "+2", sentiment: "negative" as const },
  { key: "alerts", label: "미처리 알림", value: "17건", hint: "처리 대기", delta: "−5", sentiment: "positive" as const },
  { key: "publish", label: "오늘 게시예정 콘텐츠", value: "4건", hint: "대민포털", delta: "±0", sentiment: "neutral" as const },
] as const;

export const PRIORITY_SUBJECTS = [
  {
    id: "1",
    name: "홍길동",
    status: "위험",
    detail: "심박 이상",
    assignee: "동 담당자 A",
  },
  {
    id: "2",
    name: "김영희",
    status: "미수신",
    detail: "25분 경과",
    assignee: "동 담당자 B",
  },
  {
    id: "3",
    name: "이민수",
    status: "배터리 부족",
    detail: "8%",
    assignee: "동 담당자 A",
  },
] as const;

export const STATUS_DISTRIBUTION = [
  { label: "정상", pct: 72, color: "bg-emerald-500" },
  { label: "주의", pct: 21, color: "bg-amber-500" },
  { label: "위험", pct: 7, color: "bg-rose-500" },
] as const;

export const DEVICE_DISTRIBUTION = [
  { label: "웨어러블", pct: 35 },
  { label: "환경센서", pct: 28 },
  { label: "응급호출", pct: 18 },
  { label: "측정기기", pct: 19 },
] as const;

/** 스파크라인용 정규화 높이 (0–100) */
export const COLLECTION_TREND = [42, 48, 45, 52, 58, 55, 61, 64, 60, 68, 72, 70] as const;

export const ALERT_SUMMARY = {
  critical: 5,
  warning: 12,
  incidents: ["LTE 백홀 지연 (08:12)", "센서 펌웨어 점검 (어제)"],
} as const;

export const SUBJECT_OPS_LINES = [
  "상태별 대상자: 정상 9,020 · 주의 2,650 · 위험 38",
  "서비스 이용: 활성 9,845 · 일시중지 312 · 종료 2,103",
  "지역별 상위: 강남구 · 송파구 · 마포구",
] as const;

export const HEALTHCARE_LINES = [
  "측정 이상치(24h): 혈압 14 · 심박 9 · 체온 3",
  "최근 7일 추이: 전주 대비 이상치 −6%",
  "조치 완료 평균: 2.4시간 · 미조치 6건",
] as const;

export const DEVICE_OPS_LINES = [
  "기기 유형별 연결: 웨어 4,380 · 센서 3,510 · 기타",
  "배터리 임계 이하: 31대",
  "오프라인/점검: 21대 / 4대",
] as const;

export const CONTENT_OPS_LINES = [
  "게시 예정 4건 · 종료 예정 2건",
  "배너/팝업 노출 중 3건",
  "지도 카테고리 변경 요청 1건",
] as const;

export const STATS_OPS_LINES = [
  "최근 업로드: 인구통계_2026Q1.xlsx",
  "검수 대기: 2건",
  "게시 중 버전: v1.3.2",
] as const;

export const RECENT_ACTIVITY = [
  { time: "10:42", actor: "박종운", action: "대상자 상태 → 일시중지", target: "최○○" },
  { time: "10:18", actor: "이나래", action: "공지사항 게시", target: "서비스 점검 안내" },
  { time: "09:55", actor: "김운영", action: "통계 파일 업로드", target: "월간 리포트" },
] as const;
