import { useState, useId } from "react";
import { PageHeader } from "@/features/admin-shell";

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

  const filteredPolicies = policies.filter(p => 
    p.name.includes(filterStr) || p.department.includes(filterStr)
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
    active: { label: "시행중 (운영)", style: "bg-blue-50 text-blue-700 border-blue-200 shadow-sm" },
    planned: { label: "시행 예정", style: "bg-indigo-50 text-indigo-600 border-indigo-200" },
    expired: { label: "기간 만료 (종료)", style: "bg-zinc-100 text-zinc-500 border-zinc-200 opacity-70" },
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <PageHeader
        eyebrow="포털 관리 · 정책"
        title="복지 정책 거버넌스 관리"
        description="지자체 및 국가에서 하달되는 각종 복지 정책의 세부 지침과 예산 현황, 적용 대상(메타데이터)을 중앙에서 매핑하고 관리합니다."
      />

      <section className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm flex-1 min-h-[500px]">
        {/* 툴바 */}
        <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 bg-zinc-50/50 lg:flex-row lg:items-center lg:justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
               <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input 
                 type="text" 
                 placeholder="정책명 또는 주관부서 검색" 
                 value={filterStr}
                 onChange={e => setFilterStr(e.target.value)}
                 className="pl-9 pr-4 py-2 w-[300px] border border-zinc-200 rounded-xl text-[13px] font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" 
               />
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setIsModalOpen(true)} className="rounded-xl bg-blue-600 border border-transparent px-4 py-2 text-[12px] font-extrabold text-white shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-1.5 whitespace-nowrap">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
               신규 국책/지자체 정책 바인딩
             </button>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <div className="flex-1 overflow-x-auto min-h-0 bg-white">
          <table className="w-full text-left text-[13px] min-w-[1000px]">
            <thead className="border-b border-zinc-200 bg-white text-[11px] font-black uppercase tracking-widest text-zinc-400 sticky top-0 shadow-sm z-10">
               <tr>
                 <th className="px-5 py-4 w-[60px] text-center"><input type="checkbox" className="rounded border-zinc-300" /></th>
                 <th className="px-5 py-4 min-w-[110px]">정책 고유망(ID)</th>
                 <th className="px-5 py-4 min-w-[250px]">정책 및 근거 명칭</th>
                 <th className="px-5 py-4 min-w-[160px]">적용 핵심 대상군 (Tags)</th>
                 <th className="px-5 py-4 text-center w-[120px]">주관/시행부서</th>
                 <th className="px-5 py-4 text-center min-w-[160px]">시행 기간 (근거 효력)</th>
                 <th className="px-5 py-4 text-center w-[200px]">예산 소진률 상태</th>
                 <th className="px-5 py-4 text-center w-[120px]">현재 가동 상태</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {filteredPolicies.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-5 py-4 text-center"><input type="checkbox" className="rounded border-zinc-300" /></td>
                  <td className="px-5 py-4"><span className="text-[11px] font-mono font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">{p.id}</span></td>
                  <td className="px-5 py-4">
                    <span className="font-exrabold text-[14px] cursor-pointer group-hover:text-blue-600 transition-colors truncate max-w-[300px] inline-block font-black tracking-tight" title={p.name}>{p.name}</span>
                  </td>
                  <td className="px-5 py-4 leading-relaxed">
                     {p.targetGroup.split(',').map((tag, i) => (
                       <span key={i} className="inline-block px-1.5 py-0.5 mr-1 mb-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded text-[10px] font-extrabold">{tag.trim()}</span>
                     ))}
                  </td>
                  <td className="px-5 py-4 text-center text-[12px] font-bold text-zinc-500">{p.department}</td>
                  <td className="px-5 py-4 text-center font-mono text-[11px] font-bold text-zinc-600">
                    <div className="flex items-center justify-center gap-1.5">
                       <span>{p.startDate}</span>
                       <span className="text-zinc-300">~</span>
                       <span>{p.endDate}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex flex-col gap-1 items-center max-w-[140px] mx-auto">
                       <div className="w-full bg-zinc-100 rounded-full h-2.5 shadow-inner overflow-hidden border border-zinc-200/50">
                          <div className={["h-full rounded-full transition-all duration-1000", p.budgetStatus > 80 ? "bg-rose-500" : p.budgetStatus > 40 ? "bg-amber-400" : "bg-blue-500"].join(" ")} style={{ width: `${p.budgetStatus}%` }}></div>
                       </div>
                       <span className="text-[10px] font-mono font-bold text-zinc-400 ml-auto">{p.budgetStatus}% (소진)</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={["px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-widest uppercase border", STATUS_MAP[p.status].style].join(" ")}>
                      {STATUS_MAP[p.status].label}
                    </span>
                  </td>
                </tr>
              ))}
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
              <h2 id={`${modalId}-title`} className="text-[16px] font-extrabold text-zinc-900 flex items-center gap-2">
                <span className="bg-blue-600 w-2 h-4 rounded-sm block"></span>
                신규 정책 메타데이터 바인딩
              </h2>
              <button type="button" className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 transition" onClick={() => setIsModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreatePolicy} className="overflow-y-auto p-6 max-h-[70vh]">
               <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6">
                 <p className="text-[12px] font-bold text-blue-800 flex items-start gap-2">
                   <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   이곳에서 등록된 정책은 [서비스 관리] 메뉴의 서비스 생성 시 근거법령 및 기반 자원으로 연동됩니다. (예: 난방비 지원 사업 등록 시 대상자 추출 로직 공유)
                 </p>
               </div>

               <div className="space-y-5">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">정책 공식 명칭 <span className="text-rose-500">*</span></label>
                     <input type="text" placeholder="ex) 동절기 홀몸어르신 난방비 긴급지원" required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm" />
                   </div>
                   <div>
                     <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">시행 / 주관 부서명</label>
                     <select className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm bg-white">
                       <option>생활보장과</option>
                       <option>노인장애인팀</option>
                       <option>보건소 연계부서</option>
                       <option>국비/도비 하달사업</option>
                     </select>
                   </div>
                 </div>

                 <div>
                   <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">적용 대상 (수급 자격 태그)</label>
                   <input type="text" placeholder="엔터나 쉼표(,)로 태그를 구분해주세요. ex) 독거노인, 기초수급자" className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm" />
                   <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-full">+ 한부모가정</span>
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-full">+ 치매안심센터 등록자</span>
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-full">+ 위기가구 신고건 대상</span>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200/60">
                   <div>
                     <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">시행 시작 일자</label>
                     <input type="date" required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-mono shadow-sm" />
                   </div>
                   <div>
                     <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">종료 일자 (기한)</label>
                     <input type="date" className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-mono shadow-sm" />
                     <p className="text-[10px] text-amber-600 font-bold mt-1 ml-1">* 상시 사업인 경우 비워두세요.</p>
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">관련 법령 및 근거 문서 첨부 (PDF, HWP, DOCX)</label>
                   <div className="border border-dashed border-zinc-300 rounded-xl p-6 flex items-center justify-center text-center cursor-pointer hover:bg-zinc-50 transition-colors">
                     <p className="text-[12px] font-bold text-zinc-500">클릭하여 파일 업로드 또는 드래그 앤 드롭</p>
                   </div>
                 </div>
               </div>

               <div className="border-t border-zinc-200 mt-6 pt-5 flex items-center justify-between">
                 <p className="text-[11px] font-bold text-zinc-400">* 모든 필드는 서비스 인벤토리 설정 시 상속됩니다.</p>
                 <div className="flex gap-2">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-bold text-[13px] transition-all hover:bg-zinc-50 shadow-sm">취소</button>
                   <button type="submit" className="px-6 py-2.5 rounded-xl border border-transparent bg-indigo-600 text-white font-extrabold text-[13px] transition-all shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 active:scale-95">정책 DB 발행/등록</button>
                 </div>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
