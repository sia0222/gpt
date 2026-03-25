/** 목록 전용 위험 등급 (숫자 클수록 긴급 — 정렬에 사용) */
export type SubjectRiskLevel = "normal" | "watch" | "high" | "critical";

export interface SubjectListItem {
  readonly id: string;
  readonly name: string;
  readonly district: string;
  readonly status: string;
  /** 표시용 연령 */
  readonly age: number;
  /** 현재 위험 평가 */
  readonly riskLevel: SubjectRiskLevel;
  /** 위험 요약 한 줄 */
  readonly riskSummary: string;
  /** 활성 알림·이슈(목록에서 1~2개 노출) */
  readonly activeAlerts: readonly string[];
  /** 마지막 센서/활동 시각 표시용 */
  readonly lastSignalAt: string;
  /** 온라인 기기 / 전체 */
  readonly devicesOnline: string;
  readonly deviceHint: string;
  readonly primaryService: string;
  readonly caseManager: string;
}

export const SUBJECT_RISK_ORDER: Record<SubjectRiskLevel, number> = {
  critical: 0,
  high: 1,
  watch: 2,
  normal: 3,
};

export type AlertTimelineLevel = "info" | "warn" | "critical";

export interface SubjectDetail {
  readonly id: string;
  readonly age: number;
  readonly phone: string;
  readonly address: string;
  readonly guardian: string;
  /** 돌봄·요양 등급 등 (목업) */
  readonly careGrade: string;
  readonly serviceStartDate: string;
  readonly devices: readonly { name: string; status: string; battery: string }[];
  readonly realtime: readonly { label: string; value: string; level: "normal" | "warn" }[];
  readonly healthcareLogs: readonly { date: string; note: string }[];
  readonly services: readonly { type: string; manager: string; nextVisit: string }[];
  readonly memos: readonly string[];
  /** 최근 알림·조치 타임라인 */
  readonly alertTimeline: readonly { time: string; message: string; level: AlertTimelineLevel }[];
  /** 첨부 문서 목록 (목업) */
  readonly attachments: readonly { fileName: string; kind: string; uploadedAt: string }[];
}

export type SubjectDetailView = SubjectListItem & SubjectDetail;

export const SUBJECT_LIST_MOCK: readonly SubjectListItem[] = [
  {
    id: "s1",
    name: "홍길동",
    district: "○○동",
    status: "이용중",
    age: 78,
    riskLevel: "watch",
    riskSummary: "실내 CO2 임계 근접",
    activeAlerts: ["CO2 985ppm (권고 900ppm)", "CO2 센서 배터리 41%"],
    lastSignalAt: "11:42",
    devicesOnline: "4/4",
    deviceHint: "CO2 센서 주의",
    primaryService: "방문요양",
    caseManager: "박간호",
  },
  {
    id: "s2",
    name: "김영희",
    district: "△△동",
    status: "주의",
    age: 82,
    riskLevel: "high",
    riskSummary: "심박 이상 · 당일 재확인 필요",
    activeAlerts: ["심박 108 bpm (상한 초과)", "심박 밴드 배터리 29%"],
    lastSignalAt: "11:24",
    devicesOnline: "2/2",
    deviceHint: "밴드 배터리 임계",
    primaryService: "전화상담·응급연계",
    caseManager: "이상담",
  },
  {
    id: "s3",
    name: "이민수",
    district: "○○동",
    status: "이용중",
    age: 71,
    riskLevel: "normal",
    riskSummary: "특이사항 없음",
    activeAlerts: [],
    lastSignalAt: "11:38",
    devicesOnline: "3/3",
    deviceHint: "전부 정상",
    primaryService: "주간보호 연계",
    caseManager: "최복지",
  },
  {
    id: "s4",
    name: "최○○",
    district: "□□동",
    status: "일시중지",
    age: 69,
    riskLevel: "watch",
    riskSummary: "서비스 중단 · 단말 미수신 경과",
    activeAlerts: ["LTE 단말 2시간 미수신", "일시중지 기간 만료 임박(D-3)"],
    lastSignalAt: "09:12",
    devicesOnline: "0/2",
    deviceHint: "단말 오프라인",
    primaryService: "방문요양(중지)",
    caseManager: "박간호",
  },
  {
    id: "s5",
    name: "정○○",
    district: "△△동",
    status: "이용중",
    age: 76,
    riskLevel: "normal",
    riskSummary: "안정",
    activeAlerts: [],
    lastSignalAt: "11:05",
    devicesOnline: "2/2",
    deviceHint: "정상",
    primaryService: "돌봄 SOS",
    caseManager: "한매니저",
  },
  {
    id: "s6",
    name: "송○○",
    district: "□□동",
    status: "이용중",
    age: 85,
    riskLevel: "critical",
    riskSummary: "야간 미활동 + 응급콜 미응답",
    activeAlerts: ["거실 미활동 62분", "보호자·119 동시 연락 대기"],
    lastSignalAt: "11:51",
    devicesOnline: "3/5",
    deviceHint: "활동·문 센서 끊김",
    primaryService: "24h 모니터링",
    caseManager: "응급반장",
  },
] as const;

export const SUBJECT_DETAIL_MOCK: Readonly<Record<string, SubjectDetail>> = {
  s1: {
    id: "s1",
    age: 78,
    phone: "010-1234-5678",
    address: "○○구 ○○동 101-2",
    guardian: "홍보호 (아들)",
    careGrade: "장기요양 3등급",
    serviceStartDate: "2024-06-01",
    devices: [
      { name: "활동 센서", status: "정상", battery: "88%" },
      { name: "심박 밴드", status: "정상", battery: "63%" },
      { name: "CO2 센서", status: "주의", battery: "41%" },
      { name: "문열림 센서", status: "정상", battery: "72%" },
    ],
    realtime: [
      { label: "심박", value: "76 bpm", level: "normal" },
      { label: "실내 온도", value: "24.1 C", level: "normal" },
      { label: "실내 CO2", value: "985 ppm", level: "warn" },
      { label: "움직임", value: "최근 3분 내 감지", level: "normal" },
    ],
    healthcareLogs: [
      { date: "2026-03-24", note: "정기 건강 상담 완료" },
      { date: "2026-03-20", note: "야간 미활동 알림 확인 후 정상" },
    ],
    services: [{ type: "방문 돌봄", manager: "박간호", nextVisit: "2026-03-27 14:00" }],
    memos: ["환기 알림 기준 900ppm으로 설정", "야간 22시 이후 알림 민감도 상향"],
    alertTimeline: [
      { time: "11:40", message: "CO2 985ppm 알림 발생", level: "warn" },
      { time: "09:15", message: "아침 활동 패턴 정상", level: "info" },
      { time: "전일", message: "CO2 센서 배터리 저전압 경고", level: "warn" },
    ],
    attachments: [
      { fileName: "지역센터_방문기록_202603.pdf", kind: "방문기록", uploadedAt: "2026-03-24" },
      { fileName: "가족동의서_스캔.jpg", kind: "동의서", uploadedAt: "2024-06-01" },
    ],
  },
  s2: {
    id: "s2",
    age: 82,
    phone: "010-2345-6789",
    address: "△△구 △△동 32-11",
    guardian: "김보호 (딸)",
    careGrade: "장기요양 2등급",
    serviceStartDate: "2023-11-10",
    devices: [
      { name: "활동 센서", status: "정상", battery: "91%" },
      { name: "심박 밴드", status: "주의", battery: "29%" },
    ],
    realtime: [
      { label: "심박", value: "108 bpm", level: "warn" },
      { label: "실내 온도", value: "22.8 C", level: "normal" },
      { label: "실내 CO2", value: "844 ppm", level: "normal" },
    ],
    healthcareLogs: [{ date: "2026-03-25", note: "심박 이상 경보 후 유선 확인" }],
    services: [{ type: "전화 상담", manager: "이상담", nextVisit: "2026-03-26 10:30" }],
    memos: ["심박 밴드 배터리 교체 필요"],
    alertTimeline: [
      { time: "11:24", message: "심박 108bpm 임계 초과 경보", level: "critical" },
      { time: "10:50", message: "보호자 유선 통화 완료", level: "info" },
    ],
    attachments: [{ fileName: "응급대응_체크리스트.pdf", kind: "내부양식", uploadedAt: "2026-03-25" }],
  },
  s3: {
    id: "s3",
    age: 71,
    phone: "010-3322-1100",
    address: "○○구 ○○동 78-3",
    guardian: "이○○ (배우자)",
    careGrade: "일반 돌봄 (등급 외)",
    serviceStartDate: "2025-09-01",
    devices: [
      { name: "활동 센서", status: "정상", battery: "77%" },
      { name: "낙상 패드", status: "정상", battery: "내장전원" },
      { name: "SOS 단말", status: "정상", battery: "92%" },
    ],
    realtime: [
      { label: "심박", value: "72 bpm", level: "normal" },
      { label: "실내 온도", value: "23.2 C", level: "normal" },
    ],
    healthcareLogs: [{ date: "2026-03-18", note: "주간보호 이용 만족도 조사 응답" }],
    services: [{ type: "주간보호 연계", manager: "최복지", nextVisit: "2026-03-28 09:00" }],
    memos: [],
    alertTimeline: [{ time: "11:38", message: "정기 데이터 수신 정상", level: "info" }],
    attachments: [],
  },
  s4: {
    id: "s4",
    age: 69,
    phone: "010-5544-8899",
    address: "□□구 □□동 2단지 1204호",
    guardian: "미등록",
    careGrade: "일시중지 (재개 검토)",
    serviceStartDate: "2024-01-15",
    devices: [
      { name: "LTE 허브", status: "오프라인", battery: "전원" },
      { name: "활동 센서", status: "미수신", battery: "—" },
    ],
    realtime: [],
    healthcareLogs: [{ date: "2026-03-10", note: "일시중지 사유: 병원 입원" }],
    services: [{ type: "방문요양(중지)", manager: "박간호", nextVisit: "재개 시 협의" }],
    memos: ["중지 만료 D-3 알림 발송 예정"],
    alertTimeline: [
      { time: "09:12", message: "LTE 단말 2시간 미수신", level: "warn" },
      { time: "08:40", message: "일시중지 기간 알림 배치", level: "info" },
    ],
    attachments: [{ fileName: "휴지신청서_최OO.pdf", kind: "행정", uploadedAt: "2026-03-05" }],
  },
  s5: {
    id: "s5",
    age: 76,
    phone: "010-6677-4455",
    address: "△△구 △△동 55-1",
    guardian: "정○○ (자녀)",
    careGrade: "돌봄 SOS 가입",
    serviceStartDate: "2025-02-20",
    devices: [
      { name: "SOS 디바이스", status: "정상", battery: "81%" },
      { name: "활동 센서", status: "정상", battery: "65%" },
    ],
    realtime: [
      { label: "배터리 허브", value: "충분", level: "normal" },
      { label: "최근 SOS", value: "없음 (90일)", level: "normal" },
    ],
    healthcareLogs: [{ date: "2026-02-28", note: "분기별 안부 확인 콜" }],
    services: [{ type: "돌봄 SOS", manager: "한매니저", nextVisit: "2026-04-01 점검콜" }],
    memos: [],
    alertTimeline: [{ time: "11:05", message: "일상 패턴 이상 없음", level: "info" }],
    attachments: [],
  },
  s6: {
    id: "s6",
    age: 85,
    phone: "010-9988-7766",
    address: "□□구 □□동 5단지 302호",
    guardian: "송보호 (손녀)",
    careGrade: "24h 모니터링 대상",
    serviceStartDate: "2024-08-01",
    devices: [
      { name: "활동 센서", status: "주의", battery: "55%" },
      { name: "문열림", status: "끊김", battery: "—" },
      { name: "낙상 감지", status: "정상", battery: "71%" },
    ],
    realtime: [
      { label: "거실 미활동", value: "62분", level: "warn" },
      { label: "응급콜", value: "미응답 1회", level: "warn" },
      { label: "실내 CO2", value: "720 ppm", level: "normal" },
    ],
    healthcareLogs: [{ date: "2026-03-25", note: "야간 미활동 알림 → 현장 확인 예약" }],
    services: [{ type: "24h 모니터링", manager: "응급반장", nextVisit: "즉시" }],
    memos: ["보호자 연락 두절 시 119 연동 단계 진행 중"],
    alertTimeline: [
      { time: "11:51", message: "거실 미활동 62분 · 응급 프로토콜 가동", level: "critical" },
      { time: "11:48", message: "보호자 호출 2회 무응답", level: "critical" },
      { time: "11:45", message: "현장 확인 조 배정", level: "warn" },
    ],
    attachments: [{ fileName: "응급_상황일지_20260325.pdf", kind: "응급", uploadedAt: "2026-03-25" }],
  },
};

export function getSubjectDetailMock(subjectId: string): SubjectDetailView | null {
  const listItem = SUBJECT_LIST_MOCK.find((row) => row.id === subjectId);
  if (!listItem) {
    return null;
  }
  const detail = SUBJECT_DETAIL_MOCK[subjectId];
  if (detail) {
    return { ...listItem, ...detail };
  }
  return {
    ...listItem,
    phone: "010-0000-0000",
    address: `${listItem.district} 상세주소 미등록`,
    guardian: "보호자 미등록",
    careGrade: "미등록",
    serviceStartDate: "—",
    devices: [],
    realtime: [],
    healthcareLogs: [],
    services: [],
    memos: [],
    alertTimeline: [],
    attachments: [],
  };
}
