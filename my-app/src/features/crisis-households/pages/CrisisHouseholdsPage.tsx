import { useState } from "react";
import { PageHeader, ManagementKpiRow } from "@/features/admin-shell";

// ──── MOCK DATA ────
type Status = "new" | "resolved";

interface CrisisReport {
  id: string;
  description: string; // 상세 제보 내용
  reporterPhone: string; // 신고자 연락처
  status: Status;
  adminReply: string | null; // 관리자 답변
  createdAt: string;
  read: boolean;
}

const INITIAL_MOCK_REPORTS: CrisisReport[] = [
  {
    id: "CR-260401-001",
    description: "은천동 골목 끝 반지하 집에 혼자 사시는 할아버지가 며칠째 안 보이십니다. 우편물도 쌓여있고 이상한 냄새가 나는 것 같아서 빠른 확인이 필요합니다.",
    reporterPhone: "010-1234-5678",
    status: "new",
    adminReply: null,
    createdAt: "2026-04-01 13:05",
    read: false,
  },
  {
    id: "CR-260401-002",
    description: "관악구청 맞은편 버스정류장에서 어떤 분이 어제부터 계속 앉아계십니다. 날씨가 추운데 짐도 없고 멍하게 계셔서 복지 지원이 필요해 보입니다.",
    reporterPhone: "010-9999-1111",
    status: "new",
    adminReply: null,
    createdAt: "2026-04-01 11:20",
    read: false,
  },
  {
    id: "CR-260331-001",
    description: "옆집 청년이 일자리를 잃고 몇 달째 은둔 중인 것 같습니다. 며칠 전 복도에서 마주쳤는데 영양 상태가 너무 안 좋아 보였어요. 익명으로 제보합니다. (신림본동 파크빌 302호 방향)",
    reporterPhone: "비공개 (알 수 없음)",
    status: "resolved",
    adminReply: "제보에 감사드립니다. 담당 직원이 즉시 현장에 출동하여 본인 의사 확인 및 1차 긴급 구호식품을 전달했습니다. 청년 통합지원센터 워크넷과 연계하여 지속 관리하도록 조치 완료했습니다.",
    createdAt: "2026-03-31 18:45",
    read: true,
  },
  {
    id: "CR-260330-001",
    description: "동네 공원에 매일 술에 취해 계시는 분이 있는데, 최근 기침을 심하게 하시고 피를 토하는 걸 봤습니다. 병원 이송이나 응급 개입이 시급해 보입니다.",
    reporterPhone: "010-2222-3333",
    status: "resolved",
    adminReply: "시민님의 따뜻한 관심에 감사드립니다. 제보해주신 공원 일대를 보건소 응급지원팀과 순찰하여 대상자를 발견, 즉시 인근 병원으로 이송하여 치료를 시작했습니다.",
    createdAt: "2026-03-30 14:10",
    read: true,
  },
];

export function CrisisHouseholdsPage() {
  const [reports, setReports] = useState<CrisisReport[]>(INITIAL_MOCK_REPORTS);
  const [selectedId, setSelectedId] = useState<string | null>(reports[0].id);
  const [filter, setFilter] = useState<Status | "all">("all");
  
  // Reply Form State
  const [replyText, setReplyText] = useState("");

  const selectedReport = reports.find(r => r.id === selectedId);
  const filteredReports = reports.filter(r => filter === "all" || r.status === filter);

  function handleSelect(id: string) {
    if (selectedId !== id) {
      setSelectedId(id);
      setReplyText("");
    }
    setReports(prev => prev.map(r => r.id === id ? { ...r, read: true } : r));
  }

  function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !replyText.trim()) return;

    alert("제보자에게 답변 문자가 발송되었으며 접수건이 종결 처리되었습니다.");
    
    setReports(prev => prev.map(r => 
      r.id === selectedId 
        ? { ...r, status: "resolved", adminReply: replyText } 
        : r
    ));
    setReplyText("");
  }

  const STATUS_LABELS: Record<Status, string> = {
    new: "신규 접수",
    resolved: "조치 완료",
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <PageHeader 
        eyebrow="OVERVIEW · 위기가구 제보 관제" 
        title="위기가구 제보 및 조치" 
      />

      <section aria-label="위기가구 제보 상태 지표">
        <ManagementKpiRow items={[
          { id: "crisis-total", label: "전체 제보 접수", value: reports.length.toString(), color: "zinc", icon: "bell", sparkline: [12, 15, 10, 18, 14, 20, reports.length], delta: "+2 (주간)" },
          { id: "crisis-pending", label: "조치 대기 중", value: reports.filter(r => r.status === "new").length.toString(), color: "rose", icon: "alert", sentiment: "negative", sparkline: [1, 3, 2, 4, 3, 5, 2], delta: "-1 (금일)" },
          { id: "crisis-resolved", label: "지난 24h 조치완료", value: "82%", color: "emerald", icon: "monitor", sentiment: "positive", sparkline: [60, 75, 80, 78, 85, 90, 82], delta: "+4.2%p" },
          { id: "crisis-score", label: "지역 위기 대응 지수", value: "94.5", color: "blue", icon: "people", sentiment: "positive", sparkline: [88, 90, 92, 91, 93, 95, 94], delta: "+0.5" }
        ]} />
      </section>
      
      <div className="flex-1 flex rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden min-h-[650px]">
        
        {/* === 좌측: 인박스 슬라이드 === */}
        <section className="w-[380px] flex flex-col border-r border-zinc-100 bg-zinc-50/30 shrink-0">
          <div className="p-5 border-b border-zinc-100 bg-white">
            <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner border border-zinc-200/50 w-full mb-4 shrink-0">
               <button 
                 onClick={() => setFilter("all")} 
                 className={["flex-1 py-1.5 rounded-lg text-[12px] font-extrabold tracking-wide transition-all whitespace-nowrap", filter === "all" ? "bg-white text-zinc-900 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800"].join(" ")}
               >전체</button>
               <button 
                 onClick={() => setFilter("new")} 
                 className={["flex-1 py-1.5 rounded-lg text-[12px] font-extrabold tracking-wide transition-all whitespace-nowrap", filter === "new" ? "bg-white text-rose-600 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800"].join(" ")}
               >대기중</button>
               <button 
                 onClick={() => setFilter("resolved")} 
                 className={["flex-1 py-1.5 rounded-lg text-[12px] font-extrabold tracking-wide transition-all whitespace-nowrap", filter === "resolved" ? "bg-white text-emerald-600 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800"].join(" ")}
               >조치완료</button>
            </div>
            <div className="flex items-center justify-between px-1">
               <p className="text-[12px] font-extrabold text-zinc-400 uppercase tracking-widest">Inbound Reports</p>
               <span className="text-[12px] font-bold text-zinc-500">{filteredReports.length}건</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {filteredReports.length === 0 ? (
               <div className="p-12 text-center text-[13px] text-zinc-400 font-extrabold italic">내역이 없습니다.</div>
            ) : (
              filteredReports.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelect(r.id)}
                  className={[
                    "w-full text-left p-5 transition-all focus:outline-none relative group",
                    selectedId === r.id ? "bg-white shadow-[inset_0_0_20px_rgba(37,99,235,0.03)]" : "hover:bg-white/50"
                  ].join(" ")}
                >
                  {selectedId === r.id && <div className="absolute inset-y-0 left-0 w-1 bg-blue-600"></div>}
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className={["px-2 py-0.5 rounded text-[12px] font-extrabold tracking-tight border", 
                      r.status === "new" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-zinc-100 text-zinc-500 border-zinc-200"
                    ].join(" ")}>
                      {STATUS_LABELS[r.status]}
                    </span>
                    <span className="text-[12px] font-mono font-bold text-zinc-300">{r.createdAt.split(" ")[0]}</span>
                  </div>
                  
                  <h4 className={["text-[13px] leading-relaxed line-clamp-2", 
                    !r.read && r.status === 'new' ? "font-extrabold text-zinc-900" : "font-bold text-zinc-500"
                  ].join(" ")}>
                     {r.description}
                  </h4>
                  
                  <div className="mt-4 flex items-center justify-between">
                     <span className="text-[12px] font-mono font-bold text-zinc-300 tracking-tight">{r.id}</span>
                     {!r.read && <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)] animate-pulse"></div>}
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* === 우측: 티켓 뷰어 및 처리 패널 === */}
        <section className="flex-1 bg-white flex flex-col relative min-w-0">
          {selectedReport ? (
            <>
              {/* 상단 툴바 */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 shrink-0">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-extrabold text-blue-600 uppercase tracking-widest">Case Management</span>
                      <span className="text-zinc-200">/</span>
                      <span className="text-[12px] font-mono font-bold text-zinc-400">{selectedReport.id}</span>
                   </div>
                   <h2 className="text-[22px] font-black text-zinc-900 tracking-tight leading-tight">
                     제보 상세 및 조치 이력
                   </h2>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right mr-2">
                      <p className="text-[12px] font-bold text-zinc-400 uppercase">Received Date</p>
                      <p className="text-[13px] font-mono font-bold text-zinc-900">{selectedReport.createdAt}</p>
                   </div>
                   <span className={["px-4 py-2 rounded-xl text-[12px] font-extrabold shadow-sm border", 
                     selectedReport.status === "new" ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                   ].join(" ")}>
                      {STATUS_LABELS[selectedReport.status]}
                   </span>
                </div>
              </div>
              
              {/* 메인 뷰포트 */}
              <div className="flex-1 overflow-y-auto p-10 bg-zinc-50/30">
                <div className="max-w-4xl mx-auto space-y-8">
                   
                   {/* 1. 제보 섹션 */}
                   <div className="relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-rose-200 rounded-full"></div>
                      <div className="bg-white rounded-3xl border border-zinc-200/60 shadow-xl shadow-zinc-200/20 overflow-hidden">
                        <div className="bg-rose-50/50 border-b border-rose-50 p-6 flex items-center justify-between">
                           <h3 className="text-[12px] font-extrabold text-rose-600 flex items-center gap-2 uppercase tracking-wide">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                             Citizen Report Message
                           </h3>
                           <div className="flex items-center gap-2">
                              <span className="text-[12px] font-bold text-zinc-400 mr-2">Reporter Check:</span>
                              <span className="text-[15px] font-mono font-bold text-zinc-900 bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200">{selectedReport.reporterPhone}</span>
                           </div>
                        </div>
                        <div className="p-8">
                          <p className="text-[17px] leading-[1.8] text-zinc-800 font-medium tracking-tight">
                            "{selectedReport.description}"
                          </p>
                        </div>
                      </div>
                   </div>

                   {/* 커넥터 애니메이션 */}
                   <div className="flex justify-center -my-4 relative z-10">
                      <div className="bg-white border-2 border-zinc-100 text-zinc-300 rounded-full p-2 shadow-lg">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                      </div>
                   </div>

                   {/* 2. 관리자 조치 섹션 */}
                   <div className="relative">
                      {selectedReport.status === "new" ? (
                         <>
                           <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-200 rounded-full"></div>
                           <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-2xl shadow-blue-600/5 transition-all overflow-hidden p-1">
                              <form onSubmit={handleReplySubmit} className="p-7">
                                <div className="flex items-center gap-2 mb-2">
                                   <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                                   <label className="text-[15px] font-black text-blue-900">현장 출동 및 긴급 조치 결과 작성</label>
                                </div>
                                <p className="text-[12px] font-bold text-blue-600/60 leading-relaxed mb-6 pl-3">
                                  작성하신 결과는 저장 즉시 제보자에게 SMS 통보되며, 시스템상 '조치 완료' 단계로 자동 전환됩니다.
                                </p>

                                <textarea
                                  required
                                  rows={6}
                                  placeholder="ex) 담당 사회복지사가 방문하여 1차 상담을 완료했습니다. 현재 구청 긴급복지 지원 프로세스 가동 중입니다."
                                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-[13px] font-bold text-zinc-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all resize-none shadow-inner leading-relaxed"
                                  value={replyText}
                                  onChange={e => setReplyText(e.target.value)}
                                ></textarea>

                                <div className="mt-6 flex justify-end">
                                  <button type="submit" className="h-12 px-8 rounded-2xl bg-blue-600 text-white font-black text-[13px] shadow-xl shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3 tracking-wide">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    조치 결과 발송 및 종결
                                  </button>
                                </div>
                              </form>
                           </div>
                         </>
                      ) : (
                         <>
                           <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-200 rounded-full"></div>
                           <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden">
                              <div className="p-6 border-b border-zinc-50 bg-emerald-50/30 flex items-center gap-2">
                                 <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                 <h3 className="text-[13px] font-extrabold text-emerald-700 uppercase tracking-widest">Resolution Log</h3>
                              </div>
                              <div className="p-8">
                                <p className="text-[15px] font-bold leading-relaxed text-zinc-900 bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-inner">
                                  {selectedReport.adminReply}
                                </p>
                              </div>
                           </div>
                         </>
                      )}
                   </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-300 p-12 bg-white">
               <div className="w-20 h-20 rounded-full border-4 border-zinc-50 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </div>
               <p className="text-[13px] font-extrabold text-zinc-400">조치를 시작할 제보건을 왼쪽 목록에서 선택해주세요.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
