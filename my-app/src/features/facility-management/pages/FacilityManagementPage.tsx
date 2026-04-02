import { useState, useId } from "react";
import { PageHeader, PageHeaderAction, PlusIcon, ManagementKpiRow } from "@/features/admin-shell";

// ──── MOCK DATA ────
type FacilityCategory = "health" | "elderly" | "child" | "general";

interface Facility {
  id: string;
  name: string;
  category: FacilityCategory;
  address: string;
  phone: string;
  manager: string;
  isMapped: boolean; // 지도에 좌표가 찍혀있는지 여부
  lastUpdated: string;
}

const INITIAL_FACILITIES: Facility[] = [
  { id: "F-001", name: "관악 보건지소", category: "health", address: "관악구 남부순환로 1234", phone: "02-111-2222", manager: "김보건", isMapped: true, lastUpdated: "2026-03-10" },
  { id: "F-002", name: "은빛 사랑 경로당 종합센터", category: "elderly", address: "관악구 봉천로 55-2", phone: "02-333-4444", manager: "이노인", isMapped: true, lastUpdated: "2026-02-15" },
  { id: "F-003", name: "동작 사랑채 아동돌봄센터", category: "child", address: "동작구 상도로 99-3", phone: "02-555-6666", manager: "최아동", isMapped: false, lastUpdated: "2026-04-01" },
  { id: "F-004", name: "남부 종합 사회복지관", category: "general", address: "동작구 여의대방로 22길", phone: "02-777-8888", manager: "박복지", isMapped: true, lastUpdated: "2025-11-20" },
  { id: "F-005", name: "서초 치매안심센터", category: "health", address: "서초구 반포대로 100", phone: "02-999-0000", manager: "정치매", isMapped: false, lastUpdated: "2026-03-31" },
];

export function FacilityManagementPage() {
  const modalId = useId();
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [selectedId, setSelectedId] = useState<string>(facilities[0].id);
  const [filterCat, setFilterCat] = useState<FacilityCategory | "all">("all");
  const [searchStr, setSearchStr] = useState("");
  
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredFacilities = facilities.filter(f => 
    (filterCat === "all" || f.category === filterCat) &&
    (f.name.includes(searchStr) || f.address.includes(searchStr))
  );

  const selectedFacility = facilities.find(f => f.id === selectedId) || facilities[0];

  function handleSaveCoord(e: React.FormEvent) {
    e.preventDefault();
    alert("좌표 매핑 정보가 성공적으로 저장되었습니다.");
    setFacilities(prev => prev.map(f => f.id === selectedId ? { ...f, isMapped: true, lastUpdated: "2026-04-02" } : f));
    setIsMapModalOpen(false);
  }

  const CAT_LABELS: Record<FacilityCategory, string> = {
    health: "보건/의료",
    elderly: "노인 복지",
    child: "아동/보육",
    general: "종합 복지관"
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <PageHeader 
        eyebrow="OVERVIEW · 시설 및 자원 매핑" 
        title="시설 및 자원 매핑" 
        aside={
          <PageHeaderAction onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon />
            신규 시설 등록
          </PageHeaderAction>
        }
      />

      <section aria-label="주요 시설 및 자원 지표">
        <ManagementKpiRow items={[
          { id: "fac-total", label: "전체 시설 인벤토리", value: facilities.length.toString(), color: "zinc", icon: "bell", sparkline: [18, 20, 22, 21, 23, 24, facilities.length], delta: "+1 (신규)" },
          { id: "fac-mapped", label: "GIS 매핑 완료", value: facilities.filter(f => f.isMapped).length.toString(), color: "emerald", icon: "monitor", sentiment: "positive", sparkline: [14, 15, 16, 17, 18, 18, 19], delta: "80% 등록률" },
          { id: "fac-unmapped", label: "좌표 미지정 시설", value: facilities.filter(f => !f.isMapped).length.toString(), color: "rose", icon: "alert", sentiment: "negative", sparkline: [4, 5, 6, 4, 5, 6, 5], delta: "+1 (확인필요)" },
          { id: "fac-recent", label: "최근 30일 업데이트", value: "2", color: "blue", icon: "people", sentiment: "positive", sparkline: [0, 1, 0, 2, 1, 3, 2], delta: "+12%" }
        ]} />
      </section>

      <div className="flex-1 flex gap-6 min-h-[600px] overflow-hidden">
        
        {/* === 좌측: 시설 인벤토리 목록 === */}
        <section className="w-[420px] flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden shrink-0">
          <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
             <div className="flex flex-col gap-4">
               <div>
                  <h2 className="text-[13px] font-extrabold text-zinc-900 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-zinc-900 rounded-sm"></span>
                    시설 인벤토리 리스트
                  </h2>
               </div>
               <div className="relative">
                 <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 <input 
                   type="search" 
                   value={searchStr} onChange={e => setSearchStr(e.target.value)}
                   placeholder="시설명 또는 도로명 주소 검색" 
                   className="w-full h-11 pl-10 pr-4 border border-zinc-200 rounded-xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-zinc-100 focus:border-zinc-400 transition-all bg-white shadow-sm" 
                 />
               </div>
               <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner border border-zinc-200/50 shrink-0 w-max">
                 {(
                   [["all", "전체"], ["health", "보건/의료"], ["elderly", "노인"], ["child", "아동"], ["general", "종합"]] as const
                 ).map(([key, label]) => (
                   <button
                     key={key} onClick={() => setFilterCat(key as any)}
                     className={[
                       "rounded-lg px-4 py-1.5 text-[12px] font-extrabold tracking-wide transition-all whitespace-nowrap",
                       filterCat === key ? "bg-white text-zinc-900 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800",
                     ].join(" ")}
                   >{label}</button>
                 ))}
               </div>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-zinc-50/30 p-3 space-y-3">
            {filteredFacilities.length === 0 ? (
               <div className="py-20 text-center text-zinc-400 font-extrabold">검색 결과가 없습니다.</div>
            ) : (
              filteredFacilities.map(f => (
                <div 
                  key={f.id} 
                  onClick={() => setSelectedId(f.id)}
                  className={[
                    "p-4 rounded-2xl border cursor-pointer transition-all relative group",
                    selectedId === f.id ? "bg-white border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400" : "bg-white border-zinc-200 hover:border-amber-300 hover:shadow-md"
                  ].join(" ")}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded-lg text-[12px] font-extrabold bg-zinc-100 text-zinc-500 border border-zinc-200">
                      {CAT_LABELS[f.category]}
                    </span>
                    {f.isMapped ? (
                      <span className="flex items-center gap-1 text-[12px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                        매핑완료
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[12px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100 animate-pulse">
                        <div className="w-1 h-1 rounded-full bg-rose-500"></div>
                        미지정
                      </span>
                    )}
                  </div>
                  <h3 className="text-[15px] font-bold text-zinc-900 tracking-tight group-hover:text-amber-600 transition-colors">{f.name}</h3>
                  <p className="text-[12px] text-zinc-400 mt-1 flex items-start gap-1.5">
                    <svg className="w-3.5 h-3.5 mt-0.5 text-zinc-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="leading-tight">{f.address}</span>
                  </p>
                  <div className="mt-4 flex justify-between items-center border-t border-zinc-50 pt-3 text-[12px] font-bold text-zinc-400">
                    <div className="flex items-center gap-3">
                       <span className="text-zinc-500"><span className="text-zinc-300 font-medium mr-1">책임</span>{f.manager}</span>
                       <span className="text-zinc-500"><span className="text-zinc-300 font-medium mr-1">연락</span>{f.phone}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* === 우측: 관제 렌더링 영역 (GIS) === */}
        <section className="flex-1 flex flex-col rounded-2xl border border-zinc-200/70 bg-zinc-50 justify-between relative overflow-hidden shadow-sm">
           {selectedFacility ? (
             <>
               {/* 오버레이 상세 카드 */}
               <div className="absolute top-6 left-6 z-10 w-[320px] bg-white rounded-2xl border border-zinc-200 shadow-2xl p-5 animate-in slide-in-from-left-4 duration-300">
                 <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-4 bg-amber-500 rounded-sm"></span>
                    <h4 className="text-[15px] font-extrabold text-zinc-900 tracking-tight leading-tight">{selectedFacility.name}</h4>
                 </div>
                 <p className="text-[12px] font-bold text-zinc-400 mb-5">{CAT_LABELS[selectedFacility.category]}</p>
                 
                 <div className="space-y-3 text-[12px]">
                   <div className="flex justify-between items-start gap-4">
                      <span className="text-zinc-400 font-bold shrink-0">공식 주소</span> 
                      <span className="text-zinc-700 font-bold text-right leading-tight">{selectedFacility.address}</span>
                   </div>
                   <div className="flex justify-between items-center border-t border-zinc-50 pt-2">
                      <span className="text-zinc-400 font-bold">대표 번호</span> 
                      <span className="font-mono text-zinc-800 font-bold">{selectedFacility.phone}</span>
                   </div>
                   <div className="flex justify-between items-center border-t border-zinc-50 pt-2">
                      <span className="text-zinc-400 font-bold">인벤토리 갱신</span> 
                      <span className="font-mono text-zinc-800 font-bold">{selectedFacility.lastUpdated}</span>
                   </div>
                 </div>
                 
                 <div className="mt-6">
                    <button 
                      onClick={() => setIsMapModalOpen(true)} 
                      className={["w-full h-11 rounded-xl font-extrabold text-[13px] transition-all shadow-lg active:scale-95", 
                        selectedFacility.isMapped 
                          ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/10" 
                          : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20 animate-pulse"
                      ].join(" ")}
                    >
                      {selectedFacility.isMapped ? "좌표 핀 위치 수정하기" : "지도 좌표 매핑하기 (필수)"}
                    </button>
                 </div>
               </div>

               {/* 페이크 맵 백그라운드 구역 */}
               <div className="absolute inset-0 bg-[#f8fafc]" style={{ backgroundImage: "radial-gradient(#e2e8f0 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }}></div>
               
               <div className="absolute inset-0 flex items-center justify-center">
                 {selectedFacility.isMapped ? (
                    <div className="relative group cursor-pointer animate-in zoom-in duration-500">
                       {/* 맵 핀 애니메이션 */}
                       <div className="absolute -inset-4 bg-amber-500/20 rounded-full animate-ping"></div>
                       <svg className="w-14 h-14 text-amber-500 filter drop-shadow-[0_8px_15px_rgba(245,158,11,0.4)] transition-transform group-hover:-translate-y-2 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                       </svg>
                       <div className="absolute w-max -left-1/2 translate-x-1/2 -bottom-10 bg-zinc-900 text-white text-[12px] font-extrabold py-1.5 px-4 rounded-xl text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                         {selectedFacility.name}
                       </div>
                    </div>
                 ) : (
                    <div className="bg-white/80 backdrop-blur-md border border-rose-100 p-8 rounded-3xl shadow-2xl text-center max-w-sm animate-in fade-in zoom-in duration-300">
                       <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
                          <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       </div>
                       <p className="text-[15px] font-extrabold text-zinc-900 mb-2">지리정보 매핑 전 단계</p>
                       <p className="text-[12px] font-bold text-zinc-500 leading-relaxed">해당 시설의 물리적 주소 좌표가 누락되어 관제 지도에 표출할 수 없습니다.<br/>좌표 매핑을 진행해주세요.</p>
                    </div>
                 )}
               </div>

               {/* 맵 컨트롤/범례 페이크 UI */}
               <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur rounded-2xl border border-zinc-200 p-2 shadow-2xl flex flex-col gap-1">
                 <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-zinc-50 cursor-pointer text-zinc-600 transition-colors shadow-sm font-bold text-lg">+</button>
                 <div className="w-full h-px bg-zinc-100 mx-auto w-6"></div>
                 <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-zinc-50 cursor-pointer text-zinc-600 transition-colors shadow-sm font-bold text-lg">-</button>
               </div>
             </>
           ) : null}
        </section>
      </div>

      {/* Fake Map Pinning Modal */}
      {isMapModalOpen && selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMapModalOpen(false)} />
          <div role="dialog" aria-labelledby={`${modalId}-title`} className="relative z-10 w-full max-w-lg rounded-3xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between border-b border-zinc-100 p-6 bg-zinc-50/50">
              <h2 id={`${modalId}-title`} className="text-[17px] font-extrabold text-zinc-900 tracking-tight">
                 GIS 좌표 추출 및 매핑 엔진
              </h2>
              <button type="button" className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 transition" onClick={() => setIsMapModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveCoord} className="p-8 space-y-6">
              <div className="bg-amber-50/30 p-5 rounded-2xl border border-amber-100 text-center shadow-inner">
                 <p className="text-[12px] font-extrabold text-amber-600 uppercase tracking-widest">Target Facility</p>
                 <p className="text-[15px] font-extrabold text-zinc-900 mt-1">{selectedFacility.name}</p>
                 <p className="text-[12px] font-bold text-zinc-400 mt-1">{selectedFacility.address}</p>
              </div>

              <div className="space-y-4">
                <p className="text-[13px] font-extrabold text-zinc-800">Geocoding Engine Result (v2.0)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-extrabold text-zinc-400 block ml-1">위도 (LAT)</label>
                    <input type="text" readOnly defaultValue="37.4782012" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[13px] font-mono font-extrabold text-zinc-600 outline-none shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-extrabold text-zinc-400 block ml-1">경도 (LNG)</label>
                    <input type="text" readOnly defaultValue="126.9515512" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[13px] font-mono font-extrabold text-zinc-600 outline-none shadow-sm" />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                <p className="text-[12px] font-bold text-blue-800 leading-relaxed">
                  도로명 주소를 시스템에서 역추적하여 정밀 좌표를 확보했습니다. 승인 시 관내 자원 지도에 즉시 가시화됩니다.
                </p>
              </div>

              <div className="mt-8 flex gap-3 justify-end items-center border-t border-zinc-100 pt-6">
                 <button type="button" onClick={() => setIsMapModalOpen(false)} className="h-11 px-6 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-[13px] hover:bg-zinc-50 active:scale-95 transition-all">취소</button>
                 <button type="submit" className="h-11 px-8 rounded-xl text-white font-extrabold text-[13px] shadow-lg transition-all bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 active:scale-95">
                   위치 승인 및 매핑 반영
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 신규 시설 추가 Fake Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateModalOpen(false)} />
          <div role="dialog" aria-labelledby={`${modalId}-create`} className="relative z-10 w-full max-w-lg rounded-3xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between border-b border-zinc-100 p-6 bg-zinc-50/50">
              <h2 id={`${modalId}-create`} className="text-[17px] font-extrabold text-zinc-900 flex items-center gap-2">
                 <span className="w-2 h-4 bg-amber-500 rounded-sm shadow-sm"></span>
                 신규 시설 인벤토리 등록
              </h2>
              <button type="button" className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 transition" onClick={() => setIsCreateModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={(e) => {
               e.preventDefault();
               alert("신규 위탁/관리 시설이 데이터베이스에 등록되었습니다.");
               setIsCreateModalOpen(false);
            }} className="p-8 space-y-6">
              
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 space-y-2">
                  <label className="block text-[12px] font-extrabold text-zinc-700">시설 공식 명칭 <span className="text-rose-500">*</span></label>
                  <input type="text" placeholder="예: 시립 도담 보건센터" required className="w-full h-11 rounded-xl border border-zinc-200 px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-500 shadow-sm transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[12px] font-extrabold text-zinc-700">심볼/카테고리</label>
                  <select className="w-full h-11 rounded-xl border border-zinc-200 px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-500 shadow-sm bg-white transition-all">
                    <option>보건/의료 계열</option>
                    <option>노인 복지 계열</option>
                    <option>아동/청소년 보육계열</option>
                    <option>종합 복지 허브망</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[12px] font-extrabold text-zinc-700">담당자 연락처</label>
                  <input type="text" placeholder="010-0000-0000" className="w-full h-11 rounded-xl border border-zinc-200 px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-500 shadow-sm transition-all" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="block text-[12px] font-extrabold text-zinc-700">소재지(도로명 주소) <span className="text-rose-500">*</span></label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="주소를 입력하세요" required className="w-full h-11 rounded-xl border border-zinc-200 px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-500 shadow-sm flex-1 transition-all" />
                    <button type="button" className="h-11 px-4 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-xl font-bold text-[12px] whitespace-nowrap hover:bg-zinc-200 transition-all shadow-sm">주소 검색</button>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 flex items-start gap-4 mt-2">
                <svg className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-[12px] font-bold text-zinc-400 leading-relaxed">
                  신규 등록 시 즉시 인벤토리에 추가되며, 지도 표출을 위해서는 추가적인 [좌표 매핑] 작업이 수행되어야 합니다.
                </p>
              </div>

              <div className="mt-8 flex gap-2 justify-end items-center border-t border-zinc-100 pt-6">
                 <button type="button" onClick={() => setIsCreateModalOpen(false)} className="h-11 px-6 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-[13px] hover:bg-zinc-50 transition-all active:scale-95">취소</button>
                 <button type="submit" className="h-11 px-8 rounded-xl text-white font-extrabold text-[13px] shadow-lg transition-all bg-zinc-900 hover:bg-zinc-800 shadow-zinc-900/10 active:scale-95">
                   DB 인벤토리 등록
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
