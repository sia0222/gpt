import { useState, useId } from "react";
import { PageHeader, PageHeaderAction, PlusIcon, ManagementKpiRow } from "@/features/admin-shell";

// ──── MOCK DATA ────
type PolicyStatus = "active" | "planned" | "expired";

interface WelfarePolicy {
  id: string;
  name: string;
  department: string;
  targetGroup: string;
  startDate: string;
  endDate: string;
  budgetStatus: number; // 0 to 100 percentage
  status: PolicyStatus;
}

const INITIAL_POLICIES: WelfarePolicy[] = [
  { id: "P-26-001", name: "동절기 취약계층 난방비 집중 지원", department: "생활보장과", targetGroup: "독거노인, 기초수급자", startDate: "2025-11-01", endDate: "2026-03-31", budgetStatus: 92, status: "active" },
  { id: "P-26-002", name: "단기 가사/방문요양 돌봄 바우처", department: "노인장애인복지과", targetGroup: "치매안심센터 등록자", startDate: "2026-01-01", endDate: "2026-12-31", budgetStatus: 45, status: "active" },
  { id: "P-26-003", name: "미성년 소년소녀가장 자립지원금", department: "아동청소년과", targetGroup: "만 15세 이상 18세 미만", startDate: "2026-04-15", endDate: "2027-04-14", budgetStatus: 0, status: "planned" },
  { id: "P-25-019", name: "한시적 폭우 피해 복구 긴급급여", department: "안전총괄과", targetGroup: "관내 침수 피해 가구", startDate: "2025-07-01", endDate: "2025-10-31", budgetStatus: 100, status: "expired" },
];

export function PolicyManagementPage() {
  const modalId = useId();
  const [policies, setPolicies] = useState<WelfarePolicy[]>(INITIAL_POLICIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStr, setFilterStr] = useState("");
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | "all">("all");

  const filteredPolicies = policies.filter(p => 
    (statusFilter === "all" || p.status === statusFilter) &&
    (p.name.includes(filterStr) || p.department.includes(filterStr))
  );

  function handleCreatePolicy(e: React.FormEvent) {
    e.preventDefault();
    alert("새 복지 정책 메타데이터가 등록되었습니다. [서비스 관리] 메뉴로 데이터가 매핑됩니다.");
    setIsModalOpen(false);
    setPolicies(prev => [{
      id: "P-26-009",
      name: "초기 치매 환자 안심 팔찌 무상보급",
      department: "노인장애인복지과",
      targetGroup: "만 65세 이상, 치매 판정자",
      startDate: "2026-05-01",
      endDate: "2026-12-31",
      budgetStatus: 0,
      status: "planned",
    }, ...prev]);
  }

  const STATUS_MAP = {
    active: { label: "시행중", style: "bg-blue-50 text-blue-700 border-blue-200 shadow-sm" },
    planned: { label: "시행 예정", style: "bg-purple-50 text-purple-700 border-purple-200" },
    expired: { label: "기간 만료", style: "bg-zinc-100 text-zinc-500 border-zinc-200 opacity-70" },
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <PageHeader 
        eyebrow="OVERVIEW · 복지 정책 센터" 
        title="복지 정책 센터" 
        aside={
          <PageHeaderAction onClick={() => setIsModalOpen(true)}>
            <PlusIcon />
            신규 정책 바인딩
          </PageHeaderAction>
        }
      />

      <section aria-label="복지 정책 운영 지표">
        <ManagementKpiRow items={[
          { id: "policy-total", label: "전체 관리 정책", value: policies.length.toString(), color: "zinc", icon: "bell", sparkline: [12, 14, 13, 15, 14, 16, policies.length], delta: "+2 (분기)" },
          { id: "policy-active", label: "현재 시행 중", value: policies.filter(p => p.status === "active").length.toString(), color: "blue", icon: "monitor", sentiment: "positive", sparkline: [2, 3, 2, 4, 3, 4, 3], delta: "안정적" },
          { id: "policy-budget", label: "평균 예산 소진율", value: "72%", color: "amber", icon: "alert", sentiment: "neutral", sparkline: [40, 55, 62, 68, 70, 75, 72], delta: "+5.4% (전월대비)" },
          { id: "policy-planned", label: "시행 예정 정책", value: policies.filter(p => p.status === "planned").length.toString(), color: "emerald", icon: "people", sentiment: "positive", sparkline: [0, 1, 0, 0, 1, 2, 1], delta: "신규 편성" }
        ]} />
      </section>

      <section className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm flex-1 overflow-hidden">
        {/* 툴바 */}
        <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 bg-zinc-50/50 lg:flex-row lg:items-center lg:justify-between shrink-0">
          <div className="flex items-center gap-6 flex-1">
              <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner border border-zinc-200/50 shrink-0 w-max">
                {(
                  [["all", "전체"], ["active", "시행중"], ["planned", "예정"], ["expired", "만료"]] as const
                ).map(([key, label]) => (
                  <button
                    key={key} onClick={() => setStatusFilter(key as any)}
                    className={[
                      "rounded-lg px-4 py-1.5 text-[12px] font-extrabold tracking-wide transition-all whitespace-nowrap",
                      statusFilter === key ? "bg-white text-zinc-900 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800",
                    ].join(" ")}
                  >{label}</button>
                ))}
              </div>
             <div className="relative min-w-[320px] lg:max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  type="search" 
                  placeholder="정책명 또는 주관부서 검색" 
                  value={filterStr}
                  onChange={e => setFilterStr(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-white border border-zinc-200 rounded-xl text-[13px] font-bold text-zinc-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all shadow-sm" 
                />
             </div>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <div className="flex-1 overflow-x-auto min-h-0">
          <table className="w-full text-left text-[13px] border-collapse min-w-[1000px]">
            <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[12px] font-extrabold uppercase tracking-widest text-zinc-500 sticky top-0 z-10 backdrop-blur-sm">
               <tr>
                 <th className="px-5 py-4 w-[60px] text-center"><input type="checkbox" className="rounded border-zinc-300" /></th>
                 <th className="px-5 py-4 min-w-[110px]">정책 ID</th>
                 <th className="px-5 py-4 min-w-[280px]">정책 및 근거 명칭</th>
                 <th className="px-5 py-4 min-w-[180px]">핵심 대상군</th>
                 <th className="px-5 py-4 w-[140px]">주관 부서</th>
                 <th className="px-5 py-4 min-w-[180px] text-center">시행 기간</th>
                 <th className="px-5 py-4 w-[180px] text-center">예산 소진률</th>
                 <th className="px-5 py-4 w-[120px] text-center">동작 상태</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {filteredPolicies.length === 0 ? (
                <tr><td colSpan={8} className="py-24 text-center text-zinc-400 font-extrabold">검색된 정책이 없습니다.</td></tr>
              ) : (
                filteredPolicies.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50/50 transition-all group">
                    <td className="px-5 py-4 text-center"><input type="checkbox" className="rounded border-zinc-300" /></td>
                    <td className="px-5 py-4"><span className="text-[12px] font-mono font-bold text-zinc-400 bg-zinc-100/50 px-2 py-0.5 rounded border border-zinc-200">{p.id}</span></td>
                    <td className="px-5 py-4">
                      <span className="text-[15px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer tracking-tight" title={p.name}>{p.name}</span>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex flex-wrap gap-1">
                        {p.targetGroup.split(',').map((tag, i) => (
                          <span key={i} className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-md text-[12px] font-extrabold shadow-sm">{tag.trim()}</span>
                        ))}
                       </div>
                    </td>
                    <td className="px-5 py-4 text-[12px] font-bold text-zinc-500 whitespace-nowrap">{p.department}</td>
                    <td className="px-5 py-4 text-center font-mono text-[12px] font-bold text-zinc-600">
                      <div className="flex items-center justify-center gap-1.5">
                         <span>{p.startDate}</span>
                         <span className="text-zinc-300 font-normal">~</span>
                         <span>{p.endDate}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 px-4">
                         <div className="w-full bg-zinc-100 rounded-full h-1.5 shadow-inner overflow-hidden ring-1 ring-zinc-200/50">
                            <div className={["h-full rounded-full transition-all duration-1000", p.budgetStatus > 80 ? "bg-rose-500" : p.budgetStatus > 40 ? "bg-amber-500" : "bg-blue-500"].join(" ")} style={{ width: `${p.budgetStatus}%` }}></div>
                         </div>
                         <span className="text-[12px] font-mono font-bold text-zinc-400 ml-auto tabular-nums">{p.budgetStatus}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={["px-2.5 py-1 rounded-lg text-[12px] font-extrabold tracking-tight border", STATUS_MAP[p.status].style].join(" ")}>
                        {STATUS_MAP[p.status].label}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upload Action Fake Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div role="dialog" aria-labelledby={`${modalId}-title`} className="relative z-10 w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between border-b border-zinc-100 p-5 bg-zinc-50/50 shrink-0">
              <h2 id={`${modalId}-title`} className="text-[15px] font-extrabold text-zinc-900 flex items-center gap-2">
                <span className="bg-blue-600 w-2 h-4 rounded-sm block shadow-sm"></span>
                신규 정책 메타데이터 바인딩
              </h2>
              <button type="button" className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 transition" onClick={() => setIsModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreatePolicy} className="overflow-y-auto p-6 max-h-[70vh]">
               <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 shadow-sm">
                 <p className="text-[12px] font-bold text-blue-800 flex items-start gap-2 leading-relaxed">
                   <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   이곳에서 등록된 정책은 [서비스 관리] 메뉴의 서비스 생성 시 근거법령 및 기반 자원으로 연동됩니다. (예: 난방비 지원 사업 등록 시 대상자 추출 로직 공유)
                 </p>
               </div>

               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="block text-[12px] font-extrabold text-zinc-700">정책 공식 명칭 <span className="text-rose-500">*</span></label>
                     <input type="text" placeholder="ex) 동절기 홀몸어르신 난방비 긴급지원" required className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all" />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-[12px] font-extrabold text-zinc-700">시행 / 주관 부서명</label>
                     <select className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-sm bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] appearance-none bg-[length:24px] bg-[right_10px_center] bg-no-repeat transition-all">
                       <option>생활보장과</option>
                       <option>노인장애인팀</option>
                       <option>보건소 연계부서</option>
                       <option>국비/도비 하달사업</option>
                     </select>
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="block text-[12px] font-extrabold text-zinc-700">적용 대상 (수급 자격 태그)</label>
                   <input type="text" placeholder="엔터나 쉼표(,)로 태그를 구분해주세요. ex) 독거노인, 기초수급자" className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all" />
                   <div className="flex gap-2 mt-2">
                      <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 text-zinc-500 text-[12px] font-extrabold rounded-lg shadow-sm">+ 한부모가정</span>
                      <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 text-zinc-500 text-[12px] font-extrabold rounded-lg shadow-sm">+ 치매안심센터 등록자</span>
                      <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 text-zinc-500 text-[12px] font-extrabold rounded-lg shadow-sm">+ 위기가구 신고건 대상</span>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 p-5 rounded-2xl border border-zinc-200/60 shadow-inner">
                   <div className="space-y-2">
                     <label className="block text-[12px] font-extrabold text-zinc-700">시행 시작 일자</label>
                     <input type="date" required className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-mono shadow-sm transition-all" />
                   </div>
                   <div className="space-y-2">
                     <label className="block text-[12px] font-extrabold text-zinc-700">종료 일자 (기한)</label>
                     <input type="date" className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-mono shadow-sm transition-all" />
                     <p className="text-[12px] text-amber-600 font-extrabold mt-1 ml-1 leading-tight">* 상시 사업인 경우 비워두세요.</p>
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <label className="block text-[12px] font-extrabold text-zinc-700">관련 법령 및 근거 문서 첨부 (PDF, HWP, DOCX)</label>
                   <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-50 hover:border-blue-300 transition-all group">
                     <svg className="w-8 h-8 text-zinc-300 group-hover:text-blue-400 mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                     <p className="text-[12px] font-extrabold text-zinc-500 group-hover:text-zinc-700 transition-colors">클릭하여 파일 업로드 또는 드래그 앤 드롭</p>
                     <p className="text-[12px] text-zinc-400 mt-1 font-bold">최대 용량 20MB</p>
                   </div>
                 </div>
               </div>

               <div className="border-t border-zinc-100 mt-8 pt-5 flex items-center justify-between">
                 <p className="text-[12px] font-extrabold text-zinc-400">* 모든 필드는 서비스 인벤토리 설정 시 상속됩니다.</p>
                 <div className="flex gap-2">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="h-11 px-6 rounded-xl border border-zinc-200 bg-white text-zinc-600 font-bold text-[13px] transition-all hover:bg-zinc-50 active:scale-95 shadow-sm">취소</button>
                   <button type="submit" className="h-11 px-6 rounded-xl border border-transparent bg-blue-600 text-white font-extrabold text-[13px] transition-all shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 active:scale-95 shadow-blue-600/20">정책 DB 발행/등록</button>
                 </div>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
