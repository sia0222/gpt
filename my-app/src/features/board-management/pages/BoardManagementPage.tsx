import { useState, useId } from "react";
import { PageHeader, PageHeaderAction, PlusIcon, ManagementKpiRow } from "@/features/admin-shell";

// ──── MOCK DATA ────
type BoardCategory = "notice" | "faq" | "gallery";
type BoardStatus = "published" | "scheduled" | "draft";

interface BoardPost {
  id: string;
  category: BoardCategory;
  title: string;
  author: string;
  createdAt: string;
  status: BoardStatus;
  views: number;
  hasAttachment: boolean;
}

const INITIAL_POSTS: BoardPost[] = [
  { id: "b-001", category: "notice", title: "2026년 하반기 독거노인 난방비 지원사업 안내", author: "김복지", createdAt: "2026-04-01", status: "published", views: 245, hasAttachment: true },
  { id: "b-002", category: "notice", title: "결식 우려 아동 급식카드 가맹점 모집 공고", author: "이담당", createdAt: "2026-03-29", status: "published", views: 102, hasAttachment: false },
  { id: "b-003", category: "faq", title: "[자주묻는질문] 맞춤형 돌봄 서비스 신청은 어떻게 하나요?", author: "박지원", createdAt: "2026-03-20", status: "published", views: 984, hasAttachment: false },
  { id: "b-004", category: "notice", title: "복지지킴이 우수 사례 시상식 개최 안내", author: "시스템관리자", createdAt: "2026-04-05", status: "scheduled", views: 0, hasAttachment: true },
  { id: "b-005", category: "gallery", title: "3월 은빛 경로당 생신잔치 및 레크리에이션 사진첩", author: "최운영", createdAt: "2026-04-01", status: "draft", views: 0, hasAttachment: true },
];

export function BoardManagementPage() {
  const modalId = useId();
  const [posts, setPosts] = useState<BoardPost[]>(INITIAL_POSTS);
  const [filterCat, setFilterCat] = useState<BoardCategory | "all">("all");
  
  // Fake Action Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  const filteredPosts = posts.filter(p => filterCat === "all" || p.category === filterCat);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    alert("새 게시글이 성공적으로 업로드 되었습니다.");
    setIsModalOpen(false);
    setPosts(prev => [{
      id: "b-999",
      category: "notice",
      title: "방금 등록된 신규 게시물",
      author: "시스템 권한",
      createdAt: new Date().toISOString().split("T")[0],
      status: "published",
      views: 0,
      hasAttachment: false
    }, ...prev]);
  }

  const CAT_LABELS: Record<BoardCategory, string> = {
    notice: "공지사항",
    faq: "자주묻는질문",
    gallery: "자료/사진첩",
  };

  const STATUS_MAP = {
    published: { label: "게시중", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    scheduled: { label: "예약됨", style: "bg-blue-50 text-blue-700 border-blue-200" },
    draft: { label: "임시저장", style: "bg-zinc-100 text-zinc-500 border-zinc-200" },
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <PageHeader 
        eyebrow="OVERVIEW · 게시판 관리" 
        title="게시판 관리" 
        aside={
          <PageHeaderAction onClick={() => setIsModalOpen(true)}>
            <PlusIcon />
            신규 게시물 작성
          </PageHeaderAction>
        }
      />

      <section aria-label="게시판 운영 지표">
        <ManagementKpiRow items={[
          { id: "board-total", label: "전체 게시물", value: posts.length.toLocaleString(), color: "zinc", icon: "bell", sparkline: [120, 125, 122, 130, 128, 132, posts.length], delta: "+12 (전주 대비)" },
          { id: "board-new", label: "금일 신규 등록", value: "3", color: "emerald", icon: "monitor", sentiment: "positive", sparkline: [1, 0, 2, 1, 4, 2, 3], delta: "+2 (전일 대비)" },
          { id: "board-views", label: "주간 총 조회수", value: "2.4K", color: "blue", icon: "people", sentiment: "positive", sparkline: [1800, 2100, 1950, 2300, 2200, 2450, 2400], delta: "+8.4%" },
          { id: "board-draft", label: "임시저장/대기", value: posts.filter(p => p.status === "draft").length.toString(), color: "amber", icon: "alert", sentiment: "neutral", sparkline: [1, 2, 1, 0, 2, 1, 1], delta: "0" }
        ]} />
      </section>

      <section className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm flex-1 overflow-hidden">
        {/* 툴바 */}
        <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 bg-zinc-50/50 lg:flex-row lg:items-center lg:justify-between shrink-0">
          <div className="flex items-center gap-3 flex-1">
             <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner border border-zinc-200/50 w-max shrink-0">
               {(
                 [["all", "전체"], ["notice", "공지사항"], ["faq", "FAQ"], ["gallery", "자료첩"]] as const
               ).map(([key, label]) => (
                 <button
                   key={key} onClick={() => setFilterCat(key as any)}
                   className={[
                     "rounded-lg px-4 py-1.5 text-[12px] font-extrabold tracking-tight transition-all whitespace-nowrap",
                     filterCat === key ? "bg-white text-zinc-900 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800",
                   ].join(" ")}
                 >{label}</button>
               ))}
               <div className="w-px h-4 bg-zinc-300 mx-2 self-center" />
               <button
                 onClick={() => setIsCreateBoardOpen(true)}
                 className="rounded-lg px-3 py-1.5 text-[12px] font-extrabold text-blue-600 hover:bg-blue-50 transition-all whitespace-nowrap flex items-center gap-1"
               >
                 <PlusIcon />
                 게시판 설계
               </button>
            </div>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <div className="flex-1 overflow-x-auto min-h-0">
          <table className="w-full text-left text-[13px] border-collapse min-w-[900px]">
            <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[12px] font-extrabold uppercase tracking-widest text-zinc-500 sticky top-0 z-10 backdrop-blur-sm">
               <tr>
                 <th className="px-5 py-4 w-[60px] text-center"><input type="checkbox" className="rounded border-zinc-300" /></th>
                 <th className="px-5 py-4 w-[110px]">구분</th>
                 <th className="px-5 py-4 min-w-[320px]">상세 제목</th>
                 <th className="px-5 py-4 w-[120px]">작성자</th>
                 <th className="px-5 py-4 text-center w-[120px]">작성일</th>
                 <th className="px-5 py-4 text-center w-[100px]">조회수</th>
                 <th className="px-5 py-4 w-[100px] text-center">전시 상태</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {filteredPosts.length === 0 ? (
                <tr><td colSpan={7} className="py-24 text-center text-zinc-400 font-extrabold">게시물이 없습니다.</td></tr>
              ) : (
                filteredPosts.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50/50 transition-all group">
                    <td className="px-5 py-4 text-center"><input type="checkbox" className="rounded border-zinc-300" /></td>
                    <td className="px-5 py-4">
                      <span className="text-[12px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded shadow-sm">{CAT_LABELS[p.category]}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer tracking-tight" title={p.title}>{p.title}</span>
                        {p.hasAttachment && (
                          <svg className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-zinc-600 font-bold whitespace-nowrap">{p.author}</td>
                    <td className="px-5 py-4 text-center font-mono text-[12px] font-bold text-zinc-400">{p.createdAt}</td>
                    <td className="px-5 py-4 text-center font-mono font-extrabold text-zinc-400 tabular-nums">{p.views.toLocaleString()}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={["px-2 py-0.5 rounded-lg text-[12px] font-extrabold tracking-tight border shadow-sm", STATUS_MAP[p.status].style].join(" ")}>
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

      {/* Write Action Fake Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div role="dialog" aria-labelledby={`${modalId}-title`} className="relative z-10 w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[85vh]">
             <div className="flex items-center justify-between border-b border-zinc-100 p-5 bg-zinc-50/50 shrink-0">
              <div>
                <h2 id={`${modalId}-title`} className="text-[17px] font-extrabold text-zinc-900 tracking-tight">신규 게시물 에디터</h2>
                <p className="text-[12px] text-zinc-500 font-bold">대민·내부 채널 통합 멀티 발행 가이드를 제공합니다.</p>
              </div>
              <button type="button" className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 transition" onClick={() => setIsModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="overflow-y-auto p-6 flex-1 space-y-6">
               {/* 1. 기본 설정 */}
               <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-5">
                 <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                   <label className="text-[13px] font-extrabold text-zinc-700">게시판 구분</label>
                   <select className="w-1/2 h-11 rounded-xl border border-zinc-200 bg-white px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-blue-100">
                     <option>공지사항</option>
                     <option>자주묻는질문 (FAQ)</option>
                     <option>자료/사진첩</option>
                   </select>
                 </div>
                 <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                   <label className="text-[13px] font-extrabold text-zinc-700">게시물 제목</label>
                   <input type="text" placeholder="제목을 입력하세요" required className="w-full h-11 rounded-xl border border-zinc-200 bg-white px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-blue-100 shadow-sm" />
                 </div>
               </div>

               {/* 2. 에디터 영역 */}
               <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col min-h-[360px]">
                 <div className="bg-zinc-50 border-b border-zinc-100 p-2.5 flex gap-2 items-center">
                    <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-200 text-zinc-800 font-serif font-black">B</button>
                    <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-200 text-zinc-800 font-serif font-bold italic">I</button>
                    <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-200 text-zinc-800 underline text-[13px] font-bold">U</button>
                    <div className="w-px h-4 bg-zinc-200 mx-1"></div>
                    <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-200 text-zinc-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </button>
                    <span className="text-[12px] text-zinc-400 ml-auto mr-2 font-bold uppercase tracking-widest">SaaS Rich-Text Editor Preview</span>
                 </div>
                 <textarea className="w-full flex-1 p-5 text-[13px] font-medium text-zinc-800 resize-none outline-none leading-relaxed" placeholder="본문 내용을 이곳에 작성하세요..."></textarea>
               </div>

               <div className="border-2 border-dashed border-zinc-200 bg-zinc-50/50 rounded-2xl p-8 text-center cursor-pointer hover:bg-zinc-50 hover:border-blue-300 transition-all group">
                 <svg className="w-8 h-8 mx-auto mb-2 text-zinc-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                 <span className="text-[13px] font-extrabold text-zinc-500 group-hover:text-zinc-700 transition-colors">파일 드롭 또는 클릭하여 첨부 (최대 10MB)</span>
               </div>
            </form>

            <div className="border-t border-zinc-100 p-5 bg-zinc-50/30 shrink-0 flex items-center justify-between">
               <div className="flex gap-4 items-center">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-blue-600 outline-none focus:ring-blue-500 shadow-sm" />
                    <span className="text-[13px] font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">임시 저장 (Draft)</span>
                 </label>
               </div>
               <div className="flex gap-2">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="h-11 px-6 rounded-xl border border-zinc-200 bg-white text-zinc-600 font-bold text-[13px] transition-all hover:bg-zinc-50 active:scale-95 shadow-sm">작성 취소</button>
                 <button type="submit" onClick={handleCreate} className="h-11 px-6 rounded-xl border border-transparent bg-blue-600 text-white font-extrabold text-[13px] shadow-lg hover:bg-blue-700 active:scale-95 transition-all shadow-blue-600/20">게시물 발행 완료</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 게시판 자체 추가 Modal */}
      {isCreateBoardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateBoardOpen(false)} />
          <div role="dialog" aria-labelledby={`${modalId}-board`} className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between border-b border-zinc-100 p-5 bg-zinc-50/50">
              <h2 id={`${modalId}-board`} className="text-[17px] font-extrabold text-zinc-900 flex items-center gap-2">
                 <span className="w-2 h-4 bg-blue-600 rounded-sm shadow-sm"></span>
                 신규 게시판 카테고리 설계
              </h2>
              <button type="button" className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 transition" onClick={() => setIsCreateBoardOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={(e) => {
               e.preventDefault();
               alert("신규 게시판 카테고리가 등록되었습니다.");
               setIsCreateBoardOpen(false);
            }} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-[12px] font-extrabold text-zinc-700">게시판 명칭 <span className="text-rose-500">*</span></label>
                <input type="text" placeholder="예: 직원 자유소통방, 업무 공유 게시판" required className="w-full h-11 rounded-xl border border-zinc-200 px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-blue-100 shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-[12px] font-extrabold text-zinc-700">접근 권한 설정</label>
                <select className="w-full h-11 rounded-xl border border-zinc-200 px-4 text-[13px] font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-blue-100 shadow-sm bg-white">
                  <option>전체 공개 (대민 사이트 노출 포함)</option>
                  <option>내부 관리부서 전용</option>
                  <option>특정 직렬/직급 전용</option>
                </select>
              </div>
              <div className="flex items-center gap-3 bg-zinc-50/50 p-4 rounded-xl border border-zinc-200 shadow-inner cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 shadow-sm" id="reply-check" />
                <label htmlFor="reply-check" className="text-[12px] font-bold text-zinc-600 group-hover:text-zinc-900 cursor-pointer transition-colors">댓글 및 토론 스레드 활성화</label>
              </div>

              <div className="mt-8 flex gap-2 justify-end items-center border-t border-zinc-100 pt-5">
                 <button type="button" onClick={() => setIsCreateBoardOpen(false)} className="h-11 px-5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-[13px] hover:bg-zinc-50 active:scale-95 transition-all">취소</button>
                 <button type="submit" className="h-11 px-6 rounded-xl bg-blue-600 text-white font-extrabold text-[13px] shadow-lg hover:bg-blue-700 active:scale-95 transition-all shadow-blue-600/20">
                   카테고리 생성
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
