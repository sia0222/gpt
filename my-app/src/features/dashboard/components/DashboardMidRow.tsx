import { useState } from "react";
import { Link } from "react-router-dom";
import {
  REALTIME_ALERTS,
  RISK_TOP_SUBJECTS,
  type RealtimeAlertItem,
  type RealtimeAlertKind,
} from "@/features/dashboard/services/dashboardMockData";

/* ── 알림 종류별 스타일 ───────────────────────────── */
const KIND: Record<RealtimeAlertKind, { dot: string; badge: string; badgeText: string }> = {
  heart:     { dot: "bg-rose-500",   badge: "bg-rose-50 border-rose-100",   badgeText: "text-rose-700" },
  activity:  { dot: "bg-amber-500",  badge: "bg-amber-50 border-amber-100",  badgeText: "text-amber-700" },
  sensor:    { dot: "bg-zinc-400",   badge: "bg-zinc-100 border-zinc-200",  badgeText: "text-zinc-600" },
  emergency: { dot: "bg-rose-600",    badge: "bg-rose-50 border-rose-200",    badgeText: "text-rose-700" },
  counsel:   { dot: "bg-purple-500", badge: "bg-purple-50 border-purple-100", badgeText: "text-purple-700" },
};

const GRADE: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200" },
  danger:   { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-100" },
  watch:    { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-100" },
  concern:  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-100" },
};

/* ── 조치 다이얼로그 ──────────────────────────────── */
function ActionDialog({
  alert,
  onClose,
}: {
  alert: RealtimeAlertItem;
  onClose: () => void;
}) {
  const s = KIND[alert.kind];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="닫기"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-200/60"
      >
        <div className="flex items-start gap-4">
          <div className={["flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border", s.badge].join(" ")}>
            <span className={["h-3 w-3 rounded-full shadow-sm", s.dot].join(" ")} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-zinc-900">{alert.label}</h2>
            <p className="mt-1 text-[13px] text-zinc-600 leading-snug">{alert.message}</p>
            <p className="mt-2 font-mono text-[11px] text-zinc-400">{alert.time}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
          >
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          {alert.subjectId && (
            <Link
              to={`/subjects/${alert.subjectId}`}
              className="h-9 rounded-xl border border-zinc-200 px-4 text-[12px] font-bold text-zinc-600 transition hover:bg-zinc-50 flex items-center"
              onClick={onClose}
            >
              대상자 상세
            </Link>
          )}
          <button
            type="button"
            className="h-9 rounded-xl bg-zinc-900 px-5 text-[12px] font-bold text-white transition hover:bg-zinc-800"
            onClick={onClose}
          >
            조치 완료
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ────────────────────────────────── */
export function DashboardMidRow() {
  const [dialogAlert, setDialogAlert] = useState<RealtimeAlertItem | null>(null);

  return (
    <>
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* ── 좌: 위험대상자 TOP ───────────────── */}
        <div className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-rose-500" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.314C12.438-3.248 23.534 4.736 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>
              <h2 className="text-[14px] font-bold text-zinc-900">위험대상자 TOP</h2>
              <span className="rounded-md bg-rose-50 border border-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                {RISK_TOP_SUBJECTS.length}
              </span>
            </div>
            <Link
              to="/subjects?kpi=danger"
              className="text-[11px] font-bold text-zinc-400 transition hover:text-zinc-600"
            >
              전체 보기 →
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-zinc-50">
            {RISK_TOP_SUBJECTS.map((row) => {
              const grade = GRADE[row.gradeLevel] ?? GRADE.concern;
              return (
                <Link
                  key={row.id}
                  to={`/subjects/${row.id}`}
                  className="group flex items-center gap-4 px-5 py-3.5 transition hover:bg-zinc-50/80"
                >
                  {/* 정보 (이름 우선) */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {row.name}
                      </span>
                      <span
                        className={[
                          "rounded-md border px-1.5 py-0.5 text-[11px] font-bold leading-tight shadow-sm",
                          grade.bg,
                          grade.text,
                          grade.border,
                        ].join(" ")}
                      >
                        {row.gradeLabel}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[12px] font-medium text-zinc-500 leading-snug">
                      {row.reason}
                    </p>
                  </div>

                  {/* 시각·담당자 */}
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-[12px] font-bold text-zinc-900">{row.occurredAt}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-zinc-400">{row.assignee}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── 우: 실시간 이벤트 피드 ────────────── */}
        <div className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm lg:col-span-7">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-blue-500" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 16a2 2 0 001.985-1.75H6.015A2 2 0 008 16zm.995-14.42a1 1 0 10-1.99 0A5 5 0 003 6.5c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.92z"/>
              </svg>
              <h2 className="text-[14px] font-bold text-zinc-900">실시간 이벤트</h2>
              {/* Live indicator */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
            </div>
            <span className="text-[11px] font-bold text-zinc-400">클릭 시 조치등록</span>
          </div>

          <div className="flex flex-col divide-y divide-zinc-50">
            {REALTIME_ALERTS.map((ev) => {
              const k = KIND[ev.kind];
              return (
                <button
                  key={ev.id}
                  type="button"
                  className="group flex items-start gap-4 px-5 py-3.5 text-left transition hover:bg-zinc-50/80"
                  onClick={() => setDialogAlert(ev)}
                >
                  <span className={["timeline-dot mt-2 h-2 w-2", k.dot].join(" ")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {ev.subjectName || "대상자 미지정"}
                      </span>
                      <span
                        className={[
                          "inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold leading-tight shadow-sm",
                          k.badge,
                          k.badgeText,
                        ].join(" ")}
                      >
                        {ev.label}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] font-medium text-zinc-500 leading-snug">
                      {ev.message}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[12px] font-bold text-zinc-900 mt-0.5">
                    {ev.time}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-zinc-100 px-5 py-3">
            <button
              type="button"
              className="w-full rounded-xl border border-zinc-200 py-2 text-[12px] font-bold text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-700"
            >
              이벤트 로그 전체 보기
            </button>
          </div>
        </div>
      </section>

      {dialogAlert && <ActionDialog alert={dialogAlert} onClose={() => setDialogAlert(null)} />}
    </>
  );
}
