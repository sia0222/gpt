import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, PageHeaderAction, PlusIcon, ManagementKpiRow } from "@/features/admin-shell";
import {
  SUBJECT_LIST_MOCK,
  SUBJECT_RISK_ORDER,
  type SubjectListItem,
} from "@/features/subjects/services/subjectWorkspaceMock";
import { applyDashboardKpiFilter } from "@/features/subjects/utils/dashboardKpiSubjectFilter";
import { RISK_LABEL, riskBadgeClasses } from "@/features/subjects/utils/subjectRiskUi";

type RiskFilter = "all" | "danger" | "watch";

function filterByQuery(rows: readonly SubjectListItem[], q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return rows;
  return rows.filter(
    (r) =>
      r.name.toLowerCase().includes(s) ||
      r.district.toLowerCase().includes(s) ||
      r.caseManager.toLowerCase().includes(s) ||
      r.primaryService.toLowerCase().includes(s) ||
      r.riskSummary.toLowerCase().includes(s),
  );
}

const KPI_LABEL: Record<string, string> = {
  total: "전체 대상자",
  normal: "정상",
  concern: "관심",
  watch: "주의",
  danger: "긴급",
  critical: "긴급",
  pending: "미조치",
  no_signal: "미수신",
};

// ── 뱃지 공통 ─────────────────────────────────────────────────
const BADGE_BASE = "inline-block rounded px-2 py-0.5 text-[12px] font-extrabold leading-tight shadow-sm";

export function SubjectsListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const kpi = searchParams.get("kpi");
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");

  const stats = useMemo(() => {
    const total = SUBJECT_LIST_MOCK.length;
    const danger = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "critical").length;
    const watch  = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "watch").length;
    const concern = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "concern").length;
    const normal = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "normal").length;
    return { total, danger, watch, concern, normal };
  }, []);

  const rows = useMemo(() => {
    let list: readonly SubjectListItem[] = SUBJECT_LIST_MOCK;
    if (kpi) {
      list = applyDashboardKpiFilter(list, kpi);
    } else if (riskFilter === "danger") {
      list = list.filter((r) => r.riskLevel === "critical");
    } else if (riskFilter === "watch") {
      list = list.filter((r) => r.riskLevel === "watch");
    }
    list = filterByQuery(list, query);
    return list.slice().sort((a, b) => {
      const ra = SUBJECT_RISK_ORDER[a.riskLevel];
      const rb = SUBJECT_RISK_ORDER[b.riskLevel];
      if (ra !== rb) return ra - rb;
      return a.name.localeCompare(b.name, "ko");
    });
  }, [query, riskFilter, kpi]);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader
        eyebrow="OVERVIEW · 대상자 관리"
        title="통합 대상자 명부"
        aside={
          <PageHeaderAction onClick={() => alert("신규 대상자 등록")}>
            <PlusIcon />
            등록
          </PageHeaderAction>
        }
      />

      <section aria-label="대상자 현황 지표">
        <ManagementKpiRow items={[
          { id: "total", label: "전체 대상자", value: stats.total.toLocaleString(), color: "zinc", icon: "people", sparkline: [stats.total - 5, stats.total - 2, stats.total - 3, stats.total - 1, stats.total, stats.total + 1, stats.total], delta: "+2.4% (전주 대비)" },
          { id: "danger", label: "긴급 관리", value: stats.danger.toLocaleString(), color: "rose", icon: "alert", sentiment: "negative", sparkline: [1, 3, 2, 4, 3, 5, stats.danger], delta: "+1 (금일)" },
          { id: "watch", label: "주의 대상", value: stats.watch.toLocaleString(), color: "amber", icon: "alert", sentiment: "neutral", sparkline: [stats.watch + 2, stats.watch + 1, stats.watch + 3, stats.watch, stats.watch + 2, stats.watch + 1, stats.watch], delta: "−1 (금일)" },
          { id: "concern", label: "관심 대상", value: stats.concern.toLocaleString(), color: "blue", icon: "monitor", sentiment: "positive", sparkline: [stats.concern - 10, stats.concern - 5, stats.concern - 8, stats.concern - 3, stats.concern - 1, stats.concern + 2, stats.concern], delta: "+4.2%" }
        ]} />
      </section>

      {kpi && (
        <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-white px-5 py-4 shadow-sm ring-1 ring-blue-50">
          <div className="flex items-center gap-3">
             <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-200">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
             </span>
             <span className="text-[13px] text-blue-900 font-bold">대시보드 필터 적용: <strong className="font-black ml-1 text-blue-600">{KPI_LABEL[kpi] ?? kpi}</strong> 대상자만 표시 중입니다.</span>
          </div>
          <Link to="/subjects" className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[12px] font-bold text-zinc-600 shadow-sm transition hover:bg-zinc-50 active:scale-95">필터 해제</Link>
        </div>
      )}

      <section className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden">
        {/* 검색 및 필터 툴바 */}
        <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 bg-zinc-50/50 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 flex-1">
             <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center flex-1">
                <div className="relative min-w-[280px] flex-1 lg:max-w-md">
                   <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" viewBox="0 0 16 16" fill="none">
                     <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                   </svg>
                   <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="이름, 지역, 담당, 서비스 검색" className="w-full h-10 rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-[13px] font-bold text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 shadow-sm" autoComplete="off" />
                </div>
                <button type="button" className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-[12px] font-bold text-zinc-600 hover:bg-zinc-50 shadow-sm transition-all focus:ring-2 outline-none flex items-center justify-center gap-1.5 h-10 shrink-0 whitespace-nowrap">
                   <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   점검 일정 일괄수립
                </button>
             </div>
          </div>

          <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner border border-zinc-200/50 shrink-0">
             {(
               [["all", "전체"], ["danger", "긴급"], ["watch", "주의"]] as const
             ).map(([key, label]) => (
               <button
                 key={key} type="button" onClick={() => { setRiskFilter(key as RiskFilter); setSearchParams({}); }}
                 className={[
                   "rounded-lg px-4 py-1.5 text-[12px] font-extrabold tracking-wide transition-all whitespace-nowrap",
                   riskFilter === key && !kpi ? "bg-white text-zinc-900 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800",
                 ].join(" ")}
               >{label}</button>
             ))}
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[12px] font-extrabold uppercase tracking-widest text-zinc-500">
              <tr>
                <th scope="col" className="px-5 py-4 w-[60px]"><input type="checkbox" className="rounded border-zinc-300" aria-label="Select all" /></th>
                <th scope="col" className="px-5 py-4 w-[100px]">위험등급</th>
                <th scope="col" className="px-5 py-4 min-w-[140px]">대상자명</th>
                <th scope="col" className="px-5 py-4 w-[100px]">읍면동</th>
                <th scope="col" className="px-5 py-4 w-[110px]">생년월일</th>
                <th scope="col" className="px-5 py-4 min-w-[200px]">주소</th>
                <th scope="col" className="px-5 py-4 w-[160px]">연락처 (핸드폰/집)</th>
                <th scope="col" className="px-5 py-4 min-w-[240px]">알림 및 특이사항</th>
                <th scope="col" className="px-5 py-4 w-[48px]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {rows.length === 0 ? (
                <tr><td colSpan={9} className="py-24 text-center text-[13px] font-extrabold text-zinc-400">조건에 일치하는 대상자가 없습니다.</td></tr>
              ) : (
                rows.map((row) => {
                  return (
                    <tr
                      key={row.id}
                      onClick={() => navigate(`/subjects/${row.id}`)}
                      className="group align-middle transition-all cursor-pointer hover:bg-zinc-50/50"
                    >
                      {/* 체크박스 */}
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-zinc-300" aria-label="Select row" />
                      </td>

                      {/* 위험등급 */}
                      <td className="px-5 py-4">
                        <span className={[BADGE_BASE, riskBadgeClasses(row.riskLevel)].join(" ")}>
                          {RISK_LABEL[row.riskLevel]}
                        </span>
                      </td>

                      {/* 대상자명 (강조) */}
                      <td className="px-5 py-4">
                        <p className="text-[15px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{row.name}</p>
                      </td>

                      {/* 읍면동 */}
                      <td className="px-5 py-4 text-[13px] text-zinc-600 font-bold">{row.district}</td>

                      {/* 생년월일 */}
                      <td className="px-5 py-4 text-[13px] text-zinc-500 tabular-nums font-medium">{row.birthDate}</td>

                      {/* 주소 */}
                      <td className="px-5 py-4 text-[13px] text-zinc-500 max-w-[200px]">
                        <span className="block truncate font-medium" title={row.address}>{row.address}</span>
                      </td>

                      {/* 연락처 */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                           <p className="text-[13px] text-zinc-800 font-bold tabular-nums">{row.phone}</p>
                           {row.homePhone !== "—" && <p className="text-[12px] text-zinc-400 tabular-nums font-semibold">{row.homePhone}</p>}
                        </div>
                      </td>

                      {/* 알림 및 특이사항 */}
                      <td className="px-5 py-4">
                        {row.activeAlerts.length === 0 ? (
                          <span className="text-[12px] font-bold text-zinc-300">특이사항 없음</span>
                        ) : (
                          <div className={[
                            "flex flex-col gap-1 text-[12px] font-extrabold px-3 py-2 rounded-xl border shadow-sm",
                            row.riskLevel === "critical"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200",
                          ].join(" ")}>
                            {row.activeAlerts.slice(0, 2).map((a, i) => (
                              <p key={i} className="flex gap-2 items-center truncate">
                                <span className="w-1 h-1 rounded-full bg-current opacity-40 shrink-0" />
                                <span className="truncate">{a}</span>
                              </p>
                            ))}
                            {row.activeAlerts.length > 2 && (
                              <span className="text-[12px] opacity-60 ml-3">+{row.activeAlerts.length - 2}건 추가 탐지</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* 꺽쇠 */}
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-zinc-300 transition-all hover:bg-zinc-100 hover:text-zinc-900 group-hover:scale-110">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </section>
    </div>
  );
}
