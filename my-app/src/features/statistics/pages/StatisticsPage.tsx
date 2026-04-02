import { useState, useId } from "react";
import { PageHeader, PageHeaderAction, PlusIcon, ManagementKpiRow } from "@/features/admin-shell";

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

    alert(`[${uploadedFile.name}] 파일 업로드 및 데이터 파이프라인 동기화가 시작되었습니다.`);
    if (selectedSource) {
      setSources((prev) =>
        prev.map((s) =>
          s.id === selectedSource.id
            ? { ...s, status: "syncing", lastUpdated: "2026-04-02", rowSize: s.rowSize + 92 }
            : s
        )
      );
    }
    setIsModalOpen(false);
  }

  const statusMap = {
    healthy: { label: "정상 연동", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    delayed: { label: "지연됨", color: "bg-amber-50 text-amber-700 border-amber-200" },
    error: { label: "동기화 오류", color: "bg-rose-50 text-rose-700 border-rose-200" },
    syncing: { label: "동기화 중", color: "bg-blue-50 text-blue-700 border-blue-200 animate-pulse" },
  };

  const healthyCount = sources.filter(s => s.status === "healthy" || s.status === "syncing").length;
  const delayedCount = sources.filter(s => s.status === "delayed").length;
  const errorCount = sources.filter(s => s.status === "error").length;

  return (
    <div className="flex flex-col h-full space-y-6">
      <PageHeader 
        eyebrow="OVERVIEW · 통합 통계 관리" 
        title="통합 통계 관리" 
        aside={
          <PageHeaderAction onClick={() => {}}>
            <PlusIcon />
            신규 데이터셋 등록
          </PageHeaderAction>
        }
      />

      <section aria-label="데이터 파이프라인 상태 지표">
        <ManagementKpiRow 
          className="md:grid-cols-3"
          items={[
            { id: "stat-healthy", label: "정상 가동 데이터셋", value: `${healthyCount} / ${sources.length} 종`, color: "emerald", icon: "monitor", sentiment: "positive", sparkline: [1, 2, 2, 3, 2, 3, healthyCount], delta: "98.2% 가동률" },
            { id: "stat-delayed", label: "업데이트 지연", value: `${delayedCount} 건`, color: "amber", icon: "alert", sentiment: "negative", sparkline: [0, 1, 0, 2, 1, 1, delayedCount], delta: "+1 (어제 대비)" },
            { id: "stat-error", label: "동기화 이상 탐지", value: `${errorCount} 건`, color: "rose", icon: "alert", sentiment: "negative", sparkline: [2, 1, 3, 2, 1, 0, errorCount], delta: "−100% 오류율" },
          ]} 
        />
      </section>

      {/* Main Table */}
      <section className="flex-1 rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden flex flex-col">
         <div className="flex items-center justify-between p-5 border-b border-zinc-100 bg-zinc-50/50">
            <h3 className="text-[14px] font-extrabold text-zinc-900 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm"></span>
              데이터 파이프라인 인벤토리
            </h3>
            <div className="flex gap-2">
               <button className="h-9 px-4 rounded-xl border border-zinc-200 bg-white text-[12px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm active:scale-95">CSV 대용량 다운로드</button>
            </div>
         </div>
         
         <div className="flex-1 overflow-x-auto min-h-0 bg-white">
            <table className="w-full text-left text-[13px] min-w-[1000px] border-collapse">
              <thead className="bg-zinc-50/80 text-[11px] font-extrabold text-zinc-500 uppercase tracking-widest border-b border-zinc-100 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="px-5 py-4 w-[60px] text-center">ID</th>
                  <th className="px-5 py-4 min-w-[320px]">데이터셋 명칭 및 주제 영역</th>
                  <th className="px-5 py-4 w-[120px]">동기화 주기</th>
                  <th className="px-5 py-4 w-[150px]">적재 누적 (Total Rows)</th>
                  <th className="px-5 py-4 w-[180px]">마지막 업데이트</th>
                  <th className="px-5 py-4 text-center w-[120px]">연동 상태</th>
                  <th className="px-5 py-4 text-center w-[150px]">관리 액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {sources.map(s => (
                  <tr key={s.id} className="hover:bg-zinc-50 group transition-all">
                    <td className="px-5 py-5 text-[11px] font-mono text-zinc-400 font-bold text-center">{s.id.toUpperCase()}</td>
                    <td className="px-5 py-5">
                      <p className="text-[15px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer">{s.name}</p>
                      <p className="text-[11px] text-zinc-400 mt-1 font-bold">Principal: {s.uploader}</p>
                    </td>
                    <td className="px-5 py-5">
                      <span className="bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-lg font-extrabold text-[11px] border border-zinc-200 shadow-sm">{s.cycle}</span>
                    </td>
                    <td className="px-5 py-5 font-mono font-extrabold text-zinc-600 tabular-nums">
                      {s.rowSize.toLocaleString()}
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-mono font-bold text-zinc-700">{s.lastUpdated}</span>
                        <span className={["text-[10px] font-bold mt-0.5", s.status === 'delayed' ? "text-rose-500" : "text-zinc-400"].join(" ")}>
                           Next Due: {s.nextDueDate}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-center">
                      <span className={["px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border shadow-sm", statusMap[s.status].color].join(" ")}>
                        {statusMap[s.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-center">
                      <button 
                        onClick={() => openUploadModal(s)}
                        className="h-9 px-3 bg-white border border-zinc-200 rounded-xl text-zinc-600 text-[11px] font-extrabold shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all outline-none active:scale-95"
                      >
                         데이터 수동 갱신
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </section>

      {/* Upload Modal */}
      {isModalOpen && selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div role="dialog" aria-labelledby={`${modalId}-title`} className="relative z-10 w-full max-w-lg rounded-3xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 p-6 bg-zinc-50/50">
              <h2 id={`${modalId}-title`} className="text-[17px] font-extrabold text-zinc-900 tracking-tight">
                원천 데이터셋 로컬 동기화
              </h2>
              <button type="button" className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 transition" onClick={() => setIsModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-8">
              <div className="mb-6 bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100 shadow-inner">
                 <p className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Target Pipeline</p>
                 <p className="text-[15px] font-extrabold text-zinc-900">{selectedSource.name}</p>
                 <p className="text-[11px] text-zinc-400 mt-2 font-bold flex items-center gap-1.5">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   지원 포맷: CSV (UTF-8 Header Only)
                 </p>
              </div>

              <div 
                className={["border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group", 
                  isDragging ? "border-blue-400 bg-blue-50/30 scale-[1.02]" : 
                  uploadedFile ? "border-emerald-400 bg-emerald-50/30" : 
                  "border-zinc-200 bg-zinc-50/30 hover:border-blue-300 hover:bg-white"
                ].join(" ")}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                 {uploadedFile ? (
                   <>
                     <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3 text-emerald-600 border border-emerald-200">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <p className="text-[14px] font-extrabold text-zinc-900">{uploadedFile.name}</p>
                     <p className="text-[11px] text-emerald-600 font-bold mt-1">{(uploadedFile.size / 1024).toFixed(1)} KB 준비완료</p>
                   </>
                 ) : (
                   <>
                     <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4 text-zinc-300 group-hover:text-blue-400 transition-colors border border-zinc-200">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                     </div>
                     <p className="text-[13px] font-extrabold text-zinc-700 group-hover:text-zinc-900 transition-colors">데이터 파일을 드래그하여 업로드</p>
                     <p className="text-[11px] text-zinc-400 mt-2 font-bold">또는 수동으로 탐색기 열기</p>
                     <label className="mt-6 px-6 h-10 border border-zinc-200 bg-white rounded-xl text-[12px] font-extrabold text-zinc-600 cursor-pointer shadow-sm hover:bg-zinc-50 flex items-center justify-center relative transition-colors active:scale-95">
                       파일 찾아보기
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) setUploadedFile(e.target.files[0]);
                       }}/>
                     </label>
                   </>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-1.5">
                   <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest ml-1">Target Period</label>
                   <select className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-[13px] font-bold text-zinc-800 outline-none focus:ring-4 focus:ring-blue-50 transition-all">
                     <option>2026년 전체</option>
                     <option>2026년 1분기</option>
                     <option>2026년 2분기</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest ml-1">Ingestion Mode</label>
                   <select className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-[13px] font-bold text-zinc-800 outline-none focus:ring-4 focus:ring-blue-50 transition-all">
                     <option>증분 업데이트 (Upsert)</option>
                     <option>전체 덮어쓰기 (Replace)</option>
                   </select>
                </div>
              </div>
              
              <div className="mt-10 flex gap-2 justify-end items-center border-t border-zinc-100 pt-6">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="h-11 px-6 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-[13px] hover:bg-zinc-50 active:scale-95 transition-all">취소</button>
                 <button type="submit" className={["h-11 px-8 rounded-xl font-extrabold text-[13px] shadow-lg transition-all active:scale-95", 
                   uploadedFile ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20" : "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none border border-zinc-200"
                 ].join(" ")}>
                   클라우드 파이프라인 전송 시작
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
