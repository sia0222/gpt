import { Link } from "react-router-dom";
import { PageHeader } from "@/features/admin-shell";

const ABNORMAL = [
  { name: "홍길동", issue: "심박 이상", time: "11:24" },
  { name: "김영희", issue: "미수신 25m", time: "11:05" },
] as const;

/**
 * 통합 관제 — 전역 이상 요약 (page-composition-guide §3.3, API 없음)
 */
export function MonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="OVERVIEW · 통합 관제" title="통합 관제" />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">이상 대상자 목록</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {ABNORMAL.map((r) => (
              <li key={r.name} className="flex items-center justify-between py-2 text-sm">
                <span>
                  {r.name} · <span className="text-slate-500">{r.issue}</span>
                </span>
                <span className="text-xs text-slate-400">{r.time}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/subjects"
            className="mt-3 inline-block text-xs font-medium text-slate-700 underline-offset-2 hover:underline"
          >
            대상자 작업공간으로 →
          </Link>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">기기 상태 요약</h2>
          <p className="mt-2 text-sm text-slate-600">
            온라인 98.2% · 오프라인 21대 · 미수신 14대 · 배터리 임계 31대 (목업)
          </p>
          <h3 className="mt-4 text-xs font-semibold text-slate-500">장애/점검 이력</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
            <li>LTE 지연 — 복구 완료</li>
            <li>센서 펌웨어 점검 예정</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
