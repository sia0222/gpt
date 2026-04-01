import { useState, useId } from "react";
import { PageHeader } from "@/features/admin-shell";

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
    alert("좌표 매핑 정보가 성공적으로 저장되었습니다. 지도 서버에 반영됩니다.");
    setFacilities(prev => prev.map(f => f.id === selectedId ? { ...f, isMapped: true, lastUpdated: "오늘 막" } : f));
    setIsMapModalOpen(false);
  }

  const CAT_LABELS: Record<FacilityCategory, string> = {
    health: "보건/의료",
    elderly: "노인 복지",
    child: "아동/보육",
    general: "종합 복지관"
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <PageHeader
        eyebrow="포털 관리 · 시설"
        title="관내 시설 및 인프라 매핑 센터"
        description="관리 구역 내의 복지 거점 시설들을 등록하고 관제 지도(GIS)에 노출하기 위한 공간정보와 연락망을 관리합니다."
      />

      <div className="flex-1 flex gap-4 min-h-[600px] overflow-hidden">
        
        {/* === 좌측: 시설 인벤토리 목록 === */}
        <section className="w-[45%] flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden shrink-0">
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
             <div className="flex flex-col gap-3">
               <div className="flex justify-between items-center">
                 <h2 className="text-[15px] font-extrabold text-zinc-900 border-l-4 border-amber-500 pl-2">시설 인벤토리</h2>
                 <button onClick={() => setIsCreateModalOpen(true)} className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[11px] font-bold shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-1">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                   신규 등록
                 </button>
               </div>
               <div className="relative">
                 <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 <input 
                   type="text" 
                   value={searchStr} onChange={e => setSearchStr(e.target.value)}
                   placeholder="시설명 또는 도로명 주소 검색" 
                   className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-[13px] font-bold outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-shadow bg-white" 
                 />
               </div>
               <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
                 {(
                   [["all", "전체 보기"], ["health", "보건/의료"], ["elderly", "노인"], ["child", "아동/보육"], ["general", "종합관"]] as const
                 ).map(([key, label]) => (
                   <button
                     key={key} onClick={() => setFilterCat(key as any)}
                     className={[
                       "rounded-lg px-3 py-1.5 text-[11px] font-extrabold tracking-wide transition-all whitespace-nowrap",
                       filterCat === key ? "bg-amber-100 text-amber-800 shadow-sm border border-amber-200" : "bg-zinc-100 text-zinc-500 border border-transparent hover:bg-zinc-200",
                     ].join(" ")}
                   >{label}</button>
                 ))}
               </div>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-zinc-50/30 p-2 space-y-2">
            {filteredFacilities.map(f => (
              <div 
                key={f.id} 
                onClick={() => setSelectedId(f.id)}
                className={[
                  "p-4 rounded-xl border cursor-pointer transition-all",
                  selectedId === f.id ? "bg-white border-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.15)] ring-1 ring-amber-400" : "bg-white border-zinc-200 hover:border-amber-300 hover:shadow-sm"
                ].join(" ")}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-zinc-100 text-zinc-600 border border-zinc-200">
                    {CAT_LABELS[f.category]}
                  </span>
                  {f.isMapped ? (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      좌표 맵핑완료
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 animate-pulse">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      미지정 (좌표누락)
                    </span>
                  )}
                </div>
                <h3 className="text-[15px] font-black text-zinc-900 tracking-tight">{f.name}</h3>
                <p className="text-[12px] text-zinc-500 mt-1 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="truncate">{f.address}</span>
                </p>
                <div className="mt-3 flex justify-between items-center border-t border-zinc-100 pt-2 text-[11px] font-semibold text-zinc-400">
                  <span>책임자: {f.manager}</span>
                  <span>{f.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === 우측: 관제 렌더링 영역 (GIS) === */}
        <section className="flex-1 flex flex-col rounded-2xl border border-zinc-200/70 bg-white justify-between relative overflow-hidden shadow-sm">
           {selectedFacility ? (
             <>
               {/* 오버레이 상세 카드 */}
               <div className="absolute top-4 left-4 z-10 w-[300px] bg-white rounded-2xl border border-zinc-200 shadow-xl p-4">
                 <h4 className="text-[16px] font-black text-zinc-900 leading-tight mb-1">{selectedFacility.name}</h4>
                 <p className="text-[12px] font-bold text-zinc-600 mb-4">{CAT_LABELS[selectedFacility.category]}</p>
                 <div className="space-y-2 text-[12px]">
                   <p className="flex justify-between border-b border-zinc-100 pb-1"><span className="text-zinc-500">주소</span> <span className="text-zinc-900 font-bold truncate max-w-[150px]" title={selectedFacility.address}>{selectedFacility.address}</span></p>
                   <p className="flex justify-between border-b border-zinc-100 pb-1"><span className="text-zinc-500">전화번호</span> <span className="font-mono text-zinc-900">{selectedFacility.phone}</span></p>
                   <p className="flex justify-between border-b border-zinc-100 pb-1"><span className="text-zinc-500">최근 업데이트</span> <span className="font-mono text-zinc-900">{selectedFacility.lastUpdated}</span></p>
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-center">
                    <button onClick={() => setIsMapModalOpen(true)} className={["w-full py-2.5 rounded-xl font-bold text-[12px] transition-colors shadow-sm", selectedFacility.isMapped ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200" : "bg-amber-500 text-white hover:bg-amber-600 animate-pulse"].join(" ")}>
                      {selectedFacility.isMapped ? "좌표(핀 위치) 수정하기" : "지도에 좌표 매핑하기 (필수)"}
                    </button>
                 </div>
               </div>

               {/* 페이크 맵 백그라운드 구역 */}
               <div className="absolute inset-0 bg-[#e5e7eb] opacity-60" style={{ backgroundImage: "linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(90deg, #d1d5db 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
               
               <div className="absolute inset-0 flex items-center justify-center">
                 {selectedFacility.isMapped ? (
                    <div className="relative group cursor-pointer animate-in zoom-in duration-500">
                       <svg className="w-16 h-16 text-emerald-600 filter drop-shadow-[0_10px_10px_rgba(5,150,105,0.4)] transition-transform group-hover:-translate-y-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                       <div className="absolute w-[180px] -left-[80px] top-[70px] bg-zinc-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg text-center opacity-0 group-hover:opacity-100 transition-opacity">
                         {selectedFacility.name}
                       </div>
                    </div>
                 ) : (
                    <div className="bg-white/90 backdrop-blur border border-rose-200 p-6 rounded-2xl shadow-xl text-center max-w-sm">
                       <svg className="w-12 h-12 text-rose-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       <p className="text-[14px] font-black text-zinc-900 mb-1">지도 표시 불가</p>
                       <p className="text-[12px] font-medium text-zinc-600 leading-relaxed">이 시설은 시스템에 좌표가 등록되지 않았습니다.<br/>정상적인 관제를 위해 매핑을 완료해주세요.</p>
                    </div>
                 )}
               </div>

               {/* 맵 컨트롤/범례 페이크 UI */}
               <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-xl border border-zinc-200 p-3 shadow-lg flex flex-col gap-2">
                 <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 cursor-pointer text-zinc-600"><span className="text-xl leading-none">+</span></div>
                 <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center hover:bg-zinc-200 cursor-pointer text-zinc-600"><span className="text-2xl leading-none -mt-1">-</span></div>
               </div>
             </>
           ) : null}
        </section>
      </div>

      {/* Fake Map Pinning Modal */}
      {isMapModalOpen && selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMapModalOpen(false)} />
          <div role="dialog" aria-labelledby={`${modalId}-title`} className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between border-b border-zinc-100 p-5 bg-zinc-50/50">
              <h2 id={`${modalId}-title`} className="text-[16px] font-extrabold text-zinc-900">
                 지도 좌표 추출 및 매핑
              </h2>
              <button type="button" className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 transition" onClick={() => setIsMapModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveCoord} className="p-6 space-y-5">
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-center">
                 <p className="text-[12px] font-bold text-amber-800">선택된 타겟 대상</p>
                 <p className="text-[15px] font-black text-zinc-900 mt-1">{selectedFacility.name}</p>
                 <p className="text-[12px] font-mono text-zinc-500 mt-1">{selectedFacility.address}</p>
              </div>

              <div className="relative">
                <p className="text-[12px] font-extrabold text-zinc-700 mb-2">자동 도로명 주소 변환(Geocoding) 결과</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">위도 (Latitude)</label>
                    <input type="text" readOnly defaultValue="37.4782012" className="w-full bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2 text-[13px] font-mono font-bold text-zinc-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">경도 (Longitude)</label>
                    <input type="text" readOnly defaultValue="126.9515512" className="w-full bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2 text-[13px] font-mono font-bold text-zinc-600 focus:outline-none" />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                <p className="text-[12px] font-bold text-blue-800 leading-relaxed">
                  주소를 기반으로 한 자동 지오코딩이 완료되었습니다. 이 위치를 승인하면 중앙 관제 지도에 실시간 표출이 허용됩니다.
                </p>
              </div>

              <div className="mt-8 flex gap-3 justify-end items-center border-t border-zinc-100 pt-5">
                 <button type="button" onClick={() => setIsMapModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-[13px] hover:bg-zinc-50 transition-colors">취소</button>
                 <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-extrabold text-[13px] shadow-sm transition-colors bg-amber-500 hover:bg-amber-600">
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
          <div role="dialog" aria-labelledby={`${modalId}-create`} className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between border-b border-zinc-100 p-5 bg-zinc-50/50">
              <h2 id={`${modalId}-create`} className="text-[16px] font-extrabold text-zinc-900 flex items-center gap-2">
                 <span className="w-2 h-4 bg-amber-500 rounded-sm"></span>
                 신규 시설 인벤토리 등록
              </h2>
              <button type="button" className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 transition" onClick={() => setIsCreateModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={(e) => {
               e.preventDefault();
               alert("신규 위탁/관리 시설이 데이터베이스에 등록되었습니다. 이제 지도에 매핑을 진행할 수 있습니다. (페이크 UI 적용 성공)");
               setIsCreateModalOpen(false);
            }} className="p-6 space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">복지/의료 시설 공식 명칭 <span className="text-amber-500">*</span></label>
                  <input type="text" placeholder="예: 시립 도담 보건센터" required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">분류 체계 (카테고리)</label>
                  <select className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white">
                    <option>보건/의료 계열</option>
                    <option>노인 복지 계열</option>
                    <option>아동/청소년 보육계열</option>
                    <option>종합 복지 허브망</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">시설 관리책임자 (연락처)</label>
                  <input type="text" placeholder="예: 홍길동 (010-0000-0000)" className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">소재지 도로명 / 지번 주소 <span className="text-amber-500">*</span></label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="주소를 검색하거나 직접 입력하세요" required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 flex-1" />
                    <button type="button" className="px-4 py-2 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-xl font-bold text-[12px] whitespace-nowrap hover:bg-zinc-200 transition-colors">주소 찾기</button>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-start gap-3 mt-2">
                <svg className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-[11px] font-bold text-zinc-500 leading-relaxed">
                  등록 후 자동 지오코딩이 완료되기 전까지는 지도상에 미지정(누락) 배지로 표시됩니다.
                </p>
              </div>

              <div className="mt-8 flex gap-3 justify-end items-center border-t border-zinc-100 pt-5">
                 <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-[13px] hover:bg-zinc-50 transition-colors">등록 취소</button>
                 <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-extrabold text-[13px] shadow-sm transition-colors bg-zinc-900 hover:bg-zinc-800">
                   신규 인벤토리 등록
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
