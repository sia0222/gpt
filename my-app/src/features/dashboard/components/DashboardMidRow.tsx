import { Link } from "react-router-dom";
import {
  ALERT_SUMMARY,
  COLLECTION_TREND,
  DEVICE_DISTRIBUTION,
  PRIORITY_SUBJECTS,
  STATUS_DISTRIBUTION,
} from "@/features/dashboard/services/dashboardMockData";

function MiniSparkline() {
  const max = Math.max(...COLLECTION_TREND);
  const min = Math.min(...COLLECTION_TREND);
  return (
    <div
      className="mt-3 flex h-14 items-end gap-0.5"
      role="img"
      aria-label="최근 수집 추이 목업 차트"
    >
      {COLLECTION_TREND.map((v, i) => {
        const h = max === min ? 50 : Math.round(((v - min) / (max - min)) * 100);
        return (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-blue-200/80 to-blue-500/90"
            style={{ height: `${Math.max(12, h)}%` }}
          />
        );
      })}
    </div>
  );
}

export function DashboardMidRow() {
  return (
    <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="dash-card p-4 sm:p-5 lg:col-span-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[13px] font-semibold text-zinc-900">우선 조치 대상자</h2>
          <Link
            to="/subjects"
            className="text-[12px] font-medium text-blue-600 hover:text-blue-700"
          >
            전체
          </Link>
        </div>
        <ol className="mt-4 space-y-2">
          {PRIORITY_SUBJECTS.map((row, i) => (
            <li key={row.id}>
              <Link
                to="/subjects"
                className="flex gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-zinc-100 hover:bg-zinc-50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-[12px] font-bold text-zinc-500">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-zinc-900">{row.name}</p>
                  <p className="truncate text-[12px] text-zinc-500">
                    {row.status} · {row.detail}
                  </p>
                  <p className="text-[11px] text-zinc-400">{row.assignee}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <div className="dash-card p-4 sm:p-5 lg:col-span-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[13px] font-semibold text-zinc-900">실시간 관제 요약</h2>
          <Link to="/monitoring" className="text-[12px] font-medium text-blue-600 hover:text-blue-700">
            통합 관제
          </Link>
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              대상자 상태
            </p>
            <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-zinc-100">
              {STATUS_DISTRIBUTION.map((s) => (
                <div
                  key={s.label}
                  className={s.color}
                  style={{ width: `${s.pct}%` }}
                  title={`${s.label} ${s.pct}%`}
                />
              ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-600">
              {STATUS_DISTRIBUTION.map((s) => (
                <li key={s.label} className="inline-flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${s.color}`} />
                  {s.label} {s.pct}%
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              기기 유형
            </p>
            <ul className="mt-2 space-y-2">
              {DEVICE_DISTRIBUTION.map((d) => (
                <li key={d.label} className="flex items-center gap-2 text-[12px]">
                  <span className="w-[4.5rem] truncate text-zinc-600">{d.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-zinc-500 to-zinc-700"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] tabular-nums text-zinc-500">
                    {d.pct}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-zinc-50/80 p-3 ring-1 ring-zinc-100/80">
          <p className="text-[11px] font-medium text-zinc-500">최근 1시간 수집 추이 (목업)</p>
          <MiniSparkline />
        </div>
        <Link
          to="/subjects"
          className="mt-3 inline-flex text-[12px] font-medium text-blue-600 hover:text-blue-700"
        >
          대상자 상세로 →
        </Link>
      </div>

      <div className="dash-card p-4 sm:p-5 lg:col-span-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[13px] font-semibold text-zinc-900">알림 · 장애</h2>
          <Link to="/monitoring" className="text-[12px] font-medium text-blue-600 hover:text-blue-700">
            로그
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          <div className="rounded-xl bg-gradient-to-br from-rose-50 to-white px-3 py-3 ring-1 ring-rose-100/80">
            <p className="text-[12px] font-semibold text-rose-900">긴급 {ALERT_SUMMARY.critical}건</p>
            <p className="text-[11px] text-rose-700/90">즉시 확인 권장</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white px-3 py-3 ring-1 ring-amber-100/80">
            <p className="text-[12px] font-semibold text-amber-900">주의 {ALERT_SUMMARY.warning}건</p>
            <p className="text-[11px] text-amber-800/90">배치 처리 가능</p>
          </div>
        </div>
        <p className="mt-4 text-[11px] font-medium text-zinc-400">최근 장애</p>
        <ul className="mt-1 space-y-1 text-[12px] text-zinc-600">
          {ALERT_SUMMARY.incidents.map((t) => (
            <li key={t} className="border-l-2 border-zinc-200 pl-2">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
