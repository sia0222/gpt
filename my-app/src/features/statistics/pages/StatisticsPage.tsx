import { useState, useId } from "react";
import { PageHeader } from "@/features/admin-shell";

// ──── MOCK DATA ────
type SyncStatus = "healthy" | "delayed" | "error" | "syncing";

interface DataSource {
  id: string;
  name: string;
  cycle: string;
  lastUpdated: string;
  nextDueDate: string;
  uploader: string;
  status: SyncStatus;
  rowSize: number;
}

const INITIAL_PIPELINE_DATA: DataSource[] = [
  {
    id: "ds-1",
    name: "관내 고독사 및 위기가구 발생 현황",
    cycle: "분기별",
    lastUpdated: "2026-03-31",
    nextDueDate: "2026-06-30",
    uploader: "사회복지과 김운영",
    status: "healthy",
    rowSize: 1420,
  },
  {
    id: "ds-2",
    name: "거점 복지센터 일일 이용객 집계표",
    cycle: "월간",
    lastUpdated: "2026-02-28",
    nextDueDate: "2026-03-31",
    uploader: "시설관리공단 시스템",
    status: "delayed",
    rowSize: 45012,
  },
  {
    id: "ds-3",
    name: "행정동별 복지 예산 증감 및 집행 내역",
    cycle: "연간",
    lastUpdated: "2025-12-31",
    nextDueDate: "2026-12-31",
    uploader: "재무과 자동연동",
    status: "healthy",
    rowSize: 210,
  },
  {
    id: "ds-4",
    name: "노인 의료비 지출 및 장기요양등급 현황",
    cycle: "반기별",
    lastUpdated: "2026-03-15",
    nextDueDate: "2026-09-15",
    uploader: "국민건강보험 오픈API",
    status: "error",
    rowSize: 0,
  },
  {
    id: "ds-5",
    name: "스마트 기기(IoT/밴드) 오작동 로그",
    cycle: "일간",
    lastUpdated: "2026-04-01 03:00",
    nextDueDate: "2026-04-02 03:00",
    uploader: "IoT 관제망",
    status: "healthy",
    rowSize: 153,
  },
];

export function StatisticsPage() {
  const modalId = useId();
  const [sources, setSources] = useState<DataSource[]>(INITIAL_PIPELINE_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

  // Drag state for fake UI
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  function openUploadModal(source: DataSource) {
    setSelectedSource(source);
    setUploadedFile(null);
    setIsModalOpen(true);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  }

  function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadedFile) {
      alert("파일을 먼저 업로드(선택)해주세요.");
      return;
    }

    // Fake UI Update Action
    alert(`[${uploadedFile.name}] 파일 업로드 및 데이터 파이프라인 동기화가 시작되었습니다.`);
    if (selectedSource) {
      setSources((prev) =>
        prev.map((s) =>
          s.id === selectedSource.id
            ? { ...s, status: "syncing", lastUpdated: "지금 막", rowSize: s.rowSize + 92 }
            : s
        )
      );
    }
    setIsModalOpen(false);
  }

  const statusMap = {
    healthy: { label: "정상 연동", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    delayed: { label: "지연 (업데이트 필요)", color: "bg-amber-50 text-amber-700 border-amber-200" },
    error: { label: "동기화 오류", color: "bg-rose-50 text-rose-700 border-rose-200" },
    syncing: { label: "처리중...", color: "bg-blue-50 text-blue-700 border-blue-200 animate-pulse" },
  };

  const healthyCount = sources.filter(s => s.status === "healthy" || s.status === "syncing").length;
  const delayedCount = sources.filter(s => s.status === "delayed").length;
  const errorCount = sources.filter(s => s.status === "error").length;

  return (
    <div className="flex flex-col h-full space-y-5">
      <PageHeader eyebrow="OVERVIEW · 통합 통계 관리" title="통합 통계 관리" />

      {/* KPI 3 Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-col justify-center">
          <p className="text-[12px] font-extrabold text-zinc-400 tracking-widest uppercase mb-1 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>정상 가동 데이터셋</p>
          <div className="flex items-end gap-2"><span className="text-[32px] font-black text-zinc-900 leading-none tabnum">{healthyCount}</span><span className="text-[14px] font-bold text-zinc-500 pb-0.5">/ {sources.length} 종</span></div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm flex flex-col justify-center">
          <p className="text-[12px] font-extrabold text-amber-600 tracking-widest uppercase mb-1 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>업데이트 지연 (기한도과)</p>
          <div className="flex items-end gap-2"><span className="text-[32px] font-black text-amber-700 leading-none tabnum">{delayedCount}</span><span className="text-[14px] font-bold text-amber-500 pb-0.5">건 제재 건</span></div>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5 shadow-sm flex flex-col justify-center">
          <p className="text-[12px] font-extrabold text-rose-600 tracking-widest uppercase mb-1 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span>동기화 / 결측치 오류</p>
          <div className="flex items-end gap-2"><span className="text-[32px] font-black text-rose-700 leading-none tabnum">{errorCount}</span><span className="text-[14px] font-bold text-rose-500 pb-0.5">건 이상 탐지</span></div>
        </div>
      </div>

      {/* Main Data Lists */}
      <div className="flex-1 rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden flex flex-col">
         <div className="flex items-center justify-between p-5 border-b border-zinc-100 bg-zinc-50/50">
           <div>
             <h3 className="text-[16px] font-extrabold text-zinc-900">데이터셋(Data-set) 파이프라인 매핑</h3>
           </div>
           <div>
             <button className="px-4 py-2 bg-white text-zinc-700 border border-zinc-300 rounded-xl text-[12px] font-bold shadow-sm hover:bg-zinc-50 whitespace-nowrap">+ 신규 데이터셋 등록</button>
           </div>
         </div>
         <div className="flex-1 overflow-x-auto min-h-0 bg-white">
            <table className="w-full text-left text-[13px] min-w-[900px]">
              <thead className="bg-zinc-50/80 text-[11px] font-extrabold text-zinc-500 uppercase tracking-widest border-b border-zinc-100">
                <tr>
                  <th className="px-5 py-4 w-[60px]">ID</th>
                  <th className="px-5 py-4 min-w-[280px]">데이터셋 명칭 (주제 영역)</th>
                  <th className="px-5 py-4">동기화 주기</th>
                  <th className="px-5 py-4">적재 누적(ROW)</th>
                  <th className="px-5 py-4 min-w-[120px]">마지막 업데이트</th>
                  <th className="px-5 py-4 text-center">건강도(Status)</th>
                  <th className="px-5 py-4 text-center">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {sources.map(s => (
                  <tr key={s.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-5 py-4 text-[11px] font-mono text-zinc-400 font-bold">{s.id.toUpperCase()}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{s.name}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">관리 주체: {s.uploader}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-extrabold text-[11px]">{s.cycle}</span>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-zinc-700">
                      {s.rowSize.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-[11px] text-zinc-500 font-mono">
                      {s.lastUpdated}<br/><span className={["opacity-70", s.status === 'delayed' ? "text-amber-600 font-bold" : ""].join(" ")}>(차기: {s.nextDueDate})</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={["px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase border shadow-sm whitespace-nowrap", statusMap[s.status].color].join(" ")}>
                        {statusMap[s.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <button 
                        onClick={() => openUploadModal(s)}
                        className="px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-600 text-[11px] font-bold shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all outline-none focus:ring-2 focus:ring-blue-100"
                      >
                         수동 업로드 (CSV)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>

      {/* Fake Modal UI */}
      {isModalOpen && selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div role="dialog" aria-labelledby={`${modalId}-title`} className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 p-5 bg-zinc-50/50">
              <h2 id={`${modalId}-title`} className="text-[15px] font-extrabold text-zinc-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                원천 데이터셋 로컬 업로드
              </h2>
              <button type="button" className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 transition" onClick={() => setIsModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6">
              <div className="mb-4 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                 <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest mb-1">대상 타겟 테이블</p>
                 <p className="text-[14px] font-black text-zinc-900">{selectedSource.name}</p>
                 <p className="text-[11px] text-zinc-400 mt-1">업로드 포맷 한정: 순수 CSV 또는 XLSX 헤더포함 양식</p>
              </div>

              {/* 드래그 존 (Dropzone Fake UI) */}
              <div 
                className={["mt-4 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer", isDragging ? "border-blue-400 bg-blue-50/50" : uploadedFile ? "border-emerald-300 bg-emerald-50/30" : "border-zinc-300 bg-zinc-50/50 hover:bg-zinc-100"].join(" ")}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => {
                   // 브라우저 기본 파일선택기 페이크 (클릭 무시)
                }}
              >
                 {uploadedFile ? (
                   <>
                     <svg className="w-10 h-10 text-emerald-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     <p className="text-[13px] font-bold text-emerald-700">{uploadedFile.name}</p>
                     <p className="text-[11px] text-emerald-600/70 mt-1">{(uploadedFile.size / 1024).toFixed(1)} KB (준비완료)</p>
                   </>
                 ) : (
                   <>
                     <svg className="w-10 h-10 text-zinc-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                     <p className="text-[13px] font-bold text-zinc-700">이곳에 파일을 드래그 & 드롭 하세요</p>
                     <p className="text-[11px] text-zinc-400 mt-1">또는 박스를 클릭하여 수동 탐색기 열기</p>
                     <label className="mt-4 px-4 py-2 border border-zinc-200 bg-white rounded-lg text-[11px] font-bold text-zinc-600 cursor-pointer shadow-sm hover:border-zinc-300 relative">
                       파일 찾아보기
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) setUploadedFile(e.target.files[0]);
                       }}/>
                     </label>
                   </>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                   <label className="block text-[11px] font-bold text-zinc-500 mb-1.5 uppercase">반영 회차 (연도)</label>
                   <select className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-bold text-zinc-800 outline-none">
                     <option>2026</option>
                     <option>2025</option>
                   </select>
                </div>
                <div>
                   <label className="block text-[11px] font-bold text-zinc-500 mb-1.5 uppercase">세부 범위</label>
                   <select className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-bold text-zinc-800 outline-none">
                     <option>1분기</option>
                     <option>2분기</option>
                     <option>3분기</option>
                     <option>4분기</option>
                   </select>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3 justify-end items-center border-t border-zinc-100 pt-5">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-[13px] hover:bg-zinc-50 transition-colors">취소</button>
                 <button type="submit" className={["px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-colors", uploadedFile ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-zinc-100 text-zinc-400 cursor-not-allowed"].join(" ")}>
                   클라우드 파이프라인 전송
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
