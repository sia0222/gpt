import { useState, useId } from "react";
import { PageHeader } from "@/features/admin-shell";

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
      setReplyText(""); // 리셋
    }
    // 마크 읽음 처리
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
    resolved: "답변/종결",
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <PageHeader eyebrow="OVERVIEW · 대민 제보 관제 센터" title="대민 제보 관제 센터" />
      
      {/* 헬프데스크 (Inbox) 컨테이너 */}
      <div className="flex-1 flex rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden min-h-[600px]">
        
        {/* === 좌측: 목록 (Inbox List) === */}
        <section className="w-[35%] flex flex-col border-r border-zinc-200/70 bg-zinc-50/50 shrink-0">
          <div className="p-4 border-b border-zinc-200 bg-white">
            <div className="flex bg-zinc-100/80 p-1 rounded-xl shadow-inner w-full mb-2">
               <button 
                 onClick={() => setFilter("all")} 
                 className={["flex-1 py-1.5 rounded-lg text-[12px] font-extrabold transition-all", filter === "all" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"].join(" ")}
               >전체</button>
               <button 
                 onClick={() => setFilter("new")} 
                 className={["flex-1 py-1.5 rounded-lg text-[12px] font-extrabold transition-all", filter === "new" ? "bg-rose-50 text-rose-600 shadow-sm border border-rose-100" : "text-zinc-500 hover:text-zinc-800"].join(" ")}
               >접수 대기</button>
               <button 
                 onClick={() => setFilter("resolved")} 
                 className={["flex-1 py-1.5 rounded-lg text-[12px] font-extrabold transition-all", filter === "resolved" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-800"].join(" ")}
               >답변 종결</button>
            </div>
            <p className="text-[11px] font-bold text-zinc-400 pl-1 mt-3 tracking-wide">
               총 {filteredReports.length} 건 탐색됨
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredReports.length === 0 ? (
               <div className="p-10 text-center text-[13px] text-zinc-400 font-medium">조회된 접수 내역이 없습니다.</div>
            ) : (
              <ul className="divide-y divide-zinc-200/70">
                {filteredReports.map(r => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(r.id)}
                      className={[
                        "w-full text-left p-4 hover:bg-zinc-100 transition-colors focus:outline-none focus:bg-zinc-100",
                        selectedId === r.id ? "bg-white border-l-4 border-l-blue-500 shadow-sm ring-1 ring-zinc-200" : "border-l-4 border-l-transparent"
                      ].join(" ")}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={["px-2 py-0.5 rounded text-[10px] font-extrabold tracking-widest", r.status === "new" ? "bg-rose-100 text-rose-700" : "bg-zinc-200 text-zinc-600"].join(" ")}>
                          {STATUS_LABELS[r.status]}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">{r.createdAt.split(" ")[0]}</span>
                      </div>
                      
                      {/* 상세 제보 내용 Snippet */}
                      <h4 className={["text-[13px] leading-snug line-clamp-2 mt-2", r.read && r.status !== 'new' ? "font-bold text-zinc-600" : "font-extrabold text-zinc-900"].join(" ")}>
                         "{r.description}"
                      </h4>
                      
                      <div className="mt-3 flex items-center justify-between text-[11px] font-semibold">
                         <span className="text-zinc-500 font-mono tracking-tighter shrink-0">{r.id}</span>
                         {r.status === "new" && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* === 우측: 티켓 처리 패널 (Inbox Detail & Action) === */}
        <section className="flex-1 bg-zinc-50/30 flex flex-col relative min-w-0">
          {selectedReport ? (
            <>
              {/* 상단 툴바 */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-200 bg-white shrink-0 shadow-sm z-10">
                <div>
                  <h2 className="text-[18px] font-black text-zinc-900 tracking-tight">
                    위기가구 접수건 상세
                  </h2>
                  <p className="text-[12px] font-mono font-bold text-zinc-400 mt-1 flex items-center gap-2">
                    {selectedReport.id} <span className="text-zinc-300">|</span> {selectedReport.createdAt}
                  </p>
                </div>
                <div>
                   <span className={["px-4 py-1.5 rounded-full text-[12px] font-extrabold shadow-sm border", selectedReport.status === "new" ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-zinc-100 text-zinc-500 border-zinc-200"].join(" ")}>
                      {STATUS_LABELS[selectedReport.status]}
                   </span>
                </div>
              </div>
              
              {/* 메인 내용 스크롤 */}
              <div className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-3xl mx-auto space-y-6">
                   
                   {/* 1. 제보 원문 (Read-Only) */}
                   <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                      <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-center justify-between">
                         <h3 className="text-[14px] font-extrabold text-rose-900 flex items-center gap-2">
                           <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                           대민 사이트 제보 메세지 원문
                         </h3>
                      </div>
                      <div className="p-6">
                        <p className="text-[16px] leading-loose text-zinc-800 whitespace-pre-wrap font-medium">
                          {selectedReport.description}
                        </p>
                      </div>
                      <div className="bg-zinc-50 border-t border-zinc-100 p-4 flex items-center justify-between">
                         <span className="text-[12px] font-extrabold text-zinc-500 uppercase tracking-widest">신고자 연락처</span>
                         <span className="text-[15px] font-black font-mono text-zinc-900">{selectedReport.reporterPhone}</span>
                      </div>
                   </div>

                   {/* 화살표 아이콘 플로우 */}
                   <div className="flex justify-center -my-3 relative z-10">
                      <div className="bg-white border text-zinc-400 border-zinc-200 rounded-full p-1.5 shadow-sm">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                      </div>
                   </div>

                   {/* 2. 관리자 Action & Reply Area */}
                   {selectedReport.status === "new" ? (
                      <div className="bg-blue-50/30 rounded-2xl border-2 border-blue-200 p-1 shadow-sm relative">
                         <form onSubmit={handleReplySubmit} className="bg-white rounded-[14px] p-6">
                           <h3 className="text-[15px] font-black text-blue-900 flex items-center gap-2 mb-2">
                             답변 발송 및 종결 처리
                           </h3>
                           <p className="text-[12px] font-medium text-blue-700/80 leading-relaxed mb-5">
                             아래에 작성하신 내용은 신고자(`{selectedReport.reporterPhone}`) 번호로 알림톡 전송 처리되며 해당 제보건은 지체없이 종결(Resolved) 전환됩니다. 관리상 부서 협의 등은 작성란에 간략히 남겨주세요.
                           </p>

                           <textarea
                             required
                             rows={5}
                             placeholder="ex) 현장 점검반 파견 후 긴급 지원을 실시했습니다. 제보 감사드립니다."
                             className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-[14px] font-medium text-zinc-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none shadow-inner"
                             value={replyText}
                             onChange={e => setReplyText(e.target.value)}
                           ></textarea>

                           <div className="mt-5 flex justify-end">
                             <button type="submit" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-[14px] shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 tracking-wide">
                               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                               관리자 답변 발송 및 종결
                             </button>
                           </div>
                         </form>
                      </div>
                   ) : (
                      <div className="bg-zinc-100 rounded-2xl border border-zinc-200 p-6 opacity-90 shadow-inner">
                         <h3 className="text-[14px] font-extrabold text-zinc-500 flex items-center gap-2 mb-4 uppercase tracking-wider">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                           종결된 조치 내용
                         </h3>
                         <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                           <p className="text-[15px] font-semibold leading-relaxed text-zinc-900 whitespace-pre-wrap">
                             {selectedReport.adminReply}
                           </p>
                         </div>
                      </div>
                   )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8">
               <svg className="w-16 h-16 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
               <p className="text-[14px] font-bold">목록에서 제보를 선택하시면 원문을 읽고 관리 조치를 취할 수 있습니다.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
