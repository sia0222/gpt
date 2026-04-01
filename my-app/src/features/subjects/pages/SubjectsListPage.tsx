import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/features/admin-shell";
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
  danger: "위험",
  critical: "긴급",
  pending: "미조치",
  no_signal: "미수신",
};

export function SubjectsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const kpi = searchParams.get("kpi");
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");

  const stats = useMemo(() => {
    const total = SUBJECT_LIST_MOCK.length;
    const danger = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "critical" || r.riskLevel === "high").length;
    const watch = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "watch").length;
    const concern = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "concern").length;
    const normal = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "normal").length;
    return { total, danger, watch, concern, normal };
  }, []);

  const rows = useMemo(() => {
    let list: readonly SubjectListItem[] = SUBJECT_LIST_MOCK;
    if (kpi) {
      list = applyDashboardKpiFilter(list, kpi);
    } else if (riskFilter === "danger") {
      list = list.filter((r) => r.riskLevel === "critical" || r.riskLevel === "high");
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
        eyebrow="SUBJECT MANAGEMENT"
        title="통합 대상자 명부"
        description={<p className="text-[13px] text-zinc-600 leading-relaxed">디지털 관제망에 연결된 전체 돌봄 대상자의 상태를 요약하고, <strong>위험도 높은 가구(긴급, 주의)</strong>를 우선 식별할 수 있습니다.</p>}
        aside={
          <button type="button" className="h-10 rounded-xl px-5 text-[13px] font-extrabold text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 shadow-sm transition-all focus:ring-2 outline-none flex items-center justify-center gap-2 active:scale-95">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            신규 대상자 등록
          </button>
        }
        footer={
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 mt-2">
            <div className="rounded-xl border border-zinc-200/70 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">전체 대상자</p>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-zinc-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-rose-200/80 bg-rose-50/50 p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-rose-700">긴급 / 위험</p>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-rose-900">{stats.danger}</p>
            </div>
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">주의 관찰</p>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-amber-900">{stats.watch}</p>
            </div>
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-700">관심</p>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-blue-900">{stats.concern}</p>
            </div>
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-sm hidden sm:block">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">안정 (정상)</p>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-emerald-900">{stats.normal}</p>
            </div>
          </div>
        }
      />

      {kpi && (
        <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
               <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </span>
            <span className="text-[13px] text-blue-900 font-medium">대시보드 외부 연동 뷰: <strong className="font-extrabold ml-1">{KPI_LABEL[kpi] ?? kpi}</strong> 필터만 집중 모니터링 중입니다.</span>
          </div>
          <Link to="/subjects" className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-[12px] font-bold text-blue-700 shadow-sm transition hover:bg-blue-50 active:scale-95">필터 해제</Link>
        </div>
      )}

      <section className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm">
        {/* === 검색 및 필터 툴바 === */}
        <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 bg-zinc-50/50 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 flex-1">
             <h2 className="text-[15px] font-bold text-zinc-900 tracking-tight hidden lg:block mr-2 whitespace-nowrap">요집중 대상자 목록</h2>
             <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center flex-1">
                {/* 툴바 커스텀 버튼 */}
                <button type="button" className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-[12px] font-bold text-zinc-700 hover:bg-zinc-100 shadow-sm transition-all focus:ring-2 outline-none flex items-center justify-center gap-1.5 h-9 shrink-0 whitespace-nowrap">
                  <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  점검 일정 일괄수립
                </button>
                <div className="w-px h-5 bg-zinc-300 hidden sm:block"></div>
                {/* 검색 바 */}
                <div className="relative min-w-[240px] flex-1 lg:max-w-md">
                   <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" viewBox="0 0 16 16" fill="none">
                     <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                   </svg>
                   <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="이름, 지역, 담당, 서비스 검색" className="w-full h-9 rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-[13px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm" autoComplete="off" />
                </div>
             </div>
          </div>

          <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner border border-zinc-200/50 shrink-0">
             {(
               [["all", "전체 대상자"], ["danger", "긴급/위험"], ["watch", "주의 관찰 대상"]] as const
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

        {/* === 대상자 프리미엄 테이블 === */}
        <div className="">
           <table className="w-full text-left text-[13px]">
             <thead className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">
               <tr>
                 <th scope="col" className="px-5 py-4 w-[40px] whitespace-nowrap"><input type="checkbox" className="rounded border-zinc-300" aria-label="Select all" /></th>
                 <th scope="col" className="px-5 py-4 w-[110px]">위험 종합 지수</th>
                 <th scope="col" className="px-5 py-4 min-w-[120px]">대상자 정보</th>
                 <th scope="col" className="px-5 py-4 min-w-[90px]">거주 지역</th>
                 <th scope="col" className="px-5 py-4 min-w-[120px]">할당 서비스</th>
                 <th scope="col" className="px-5 py-4 min-w-[110px]">센서 관제 현황</th>
                 <th scope="col" className="px-5 py-4 min-w-[120px]">네트워크 신호</th>
                 <th scope="col" className="px-5 py-4 min-w-[200px]">활성 AI 알림 및 특이사항</th>
                 <th scope="col" className="px-5 py-4 w-[80px]">제공 상태</th>
                 <th scope="col" className="px-5 py-4 min-w-[100px]">전담 매니저</th>
                 <th scope="col" className="px-5 py-4 text-right w-[80px]"></th>
               </tr>
             </thead>
             <tbody className="divide-y divide-zinc-100 bg-white">
               {rows.length === 0 ? (
                 <tr><td colSpan={11} className="py-24 text-center text-[13px] font-medium text-zinc-500">조건에 일치하는 대상자가 없습니다.</td></tr>
               ) : (
                 rows.map((row) => {
                   const isDanger = row.riskLevel === "critical" || row.riskLevel === "high";
                   return (
                     <tr key={row.id} className={["group align-middle transition-colors cursor-pointer", isDanger ? "bg-rose-50/10 hover:bg-rose-50/40" : "hover:bg-zinc-50"].join(" ")}>
                       <td className="px-5 py-4"><input type="checkbox" className="rounded border-zinc-300" aria-label="Select row" /></td>
                       <td className="px-5 py-4">
                          <span className={["inline-flex items-center rounded-md px-2 py-1 text-[10px] font-extrabold uppercase border shadow-sm", riskBadgeClasses(row.riskLevel)].join(" ")}>{RISK_LABEL[row.riskLevel]}</span>
                       </td>
                       <td className="px-5 py-4">
                         <div className="flex gap-3 items-center">
                           <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-[12px] font-extrabold text-zinc-600 border border-zinc-200">{row.name.charAt(0)}</div>
                           <div>
                             <p className="text-[13px] font-bold text-zinc-900">{row.name}</p>
                             <p className="mt-0.5 text-[11px] text-zinc-500 font-mono tracking-tighter w-full max-w-[80px] truncate">{row.age}세 · {row.district.slice(0,3)}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-5 py-4 font-bold text-zinc-700">{row.district}</td>
                       <td className="px-5 py-4 text-[12px] font-semibold text-zinc-700">{row.primaryService}</td>
                       <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 font-mono">
                             <span className="text-[13px] font-extrabold text-zinc-800">{row.devicesOnline}</span>
                             <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded font-bold text-zinc-500 uppercase">{row.deviceHint}</span>
                          </div>
                       </td>
                       <td className="px-5 py-4 text-[12px] text-zinc-500 font-mono">
                         {row.lastSignalAt}
                       </td>
                       <td className="px-5 py-4">
                         {row.activeAlerts.length === 0 ? <span className="text-[11px] text-zinc-400 font-mono">특이사항 없음</span> : (
                           <div className={["flex flex-col gap-1 text-[11.5px] font-bold p-2.5 rounded-lg border", isDanger ? "bg-rose-50 text-rose-800 border-rose-200 shadow-sm" : "bg-amber-50 text-amber-800 border-amber-200"].join(" ")}>
                             {row.activeAlerts.slice(0, 2).map((a, i) => <p key={i} className="flex gap-1.5"><span className="shrink-0">•</span><span className="truncate">{a}</span></p>)}
                             {row.activeAlerts.length > 2 && <span className="text-[10px] pl-2 font-mono opacity-80">+ {row.activeAlerts.length - 2}건 추가 알림</span>}
                           </div>
                         )}
                       </td>
                       <td className="px-5 py-4">
                         <span className={["inline-flex rounded-md px-2 py-1 text-[10px] font-extrabold border uppercase", row.status === "이용중" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : row.status === "주의" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-zinc-100 text-zinc-600 border-zinc-200"].join(" ")}>{row.status}</span>
                       </td>
                       <td className="px-5 py-4">
                         <span className="text-[12px] font-bold text-zinc-700 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded shadow-sm">{row.caseManager}</span>
                       </td>
                       <td className="px-5 py-4 text-right align-middle whitespace-nowrap">
                         <Link to={`/subjects/${row.id}`} className="inline-flex h-8 items-center justify-center rounded-lg bg-white border border-zinc-200 px-4 text-[12px] font-extrabold text-blue-700 transition-all hover:bg-blue-50 hover:border-blue-200 shadow-sm outline-none focus:ring-2 active:scale-95" title="상세 진입">
                            상세 정보
                         </Link>
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
