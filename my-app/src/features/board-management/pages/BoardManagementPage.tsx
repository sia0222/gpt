import { useState, useId } from "react";
import { PageHeader } from "@/features/admin-shell";

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
    alert("새 게시글이 성공적으로 업로드 되었습니다. (업로드 페이크 UI 로직)");
    setIsModalOpen(false);
    // 상태 업데이트 모의
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
    <div className="flex flex-col h-full space-y-4">
      <PageHeader
        eyebrow="포털 관리 · 게시판"
        title="포털 콘텐츠 보드 관리"
        description="이용자 및 유관기관에 노출되는 공지사항, FAQ, 자료실 콘텐츠를 작성하고 관리하는 시스템(CMS)입니다."
      />

      <section className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm flex-1 min-h-[500px]">
        {/* 툴바 */}
        <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 bg-zinc-50/50 lg:flex-row lg:items-center lg:justify-between shrink-0">
          <div className="flex items-center gap-3 flex-1">
             <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner border border-zinc-200/50 w-max shrink-0">
               {(
                 [["all", "전체 보기"], ["notice", "공지사항"], ["faq", "자주묻는질문"], ["gallery", "관련 자료첩"]] as const
               ).map(([key, label]) => (
                 <button
                   key={key} onClick={() => setFilterCat(key as any)}
                   className={[
                     "rounded-lg px-4 py-1.5 text-[12px] font-extrabold tracking-wide transition-all whitespace-nowrap",
                     filterCat === key ? "bg-white text-zinc-900 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800",
                   ].join(" ")}
                 >{label}</button>
               ))}
               <button
                 onClick={() => setIsCreateBoardOpen(true)}
                 className="rounded-lg px-3 py-1.5 text-[12px] font-extrabold tracking-wide text-blue-600 bg-blue-50/50 hover:bg-blue-100 transition-all whitespace-nowrap border border-blue-200 shadow-sm flex items-center gap-1 ml-2"
               >
                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                 새 게시판 등록
               </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setIsModalOpen(true)} className="rounded-xl bg-zinc-900 border border-transparent px-4 py-2 text-[12px] font-bold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-95 flex items-center gap-1.5 whitespace-nowrap">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
               신규 게시물 작성
             </button>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <div className="flex-1 overflow-x-auto min-h-0 bg-white">
          <table className="w-full text-left text-[13px] min-w-[900px]">
            <thead className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">
               <tr>
                 <th className="px-5 py-4 w-[60px] text-center"><input type="checkbox" className="rounded border-zinc-300" /></th>
                 <th className="px-5 py-4 w-[110px]">게시판 구분</th>
                 <th className="px-5 py-4 min-w-[300px]">상세 제목</th>
                 <th className="px-5 py-4 text-center w-[120px]">작성자</th>
                 <th className="px-5 py-4 text-center w-[120px]">작성일</th>
                 <th className="px-5 py-4 text-center w-[100px]">조회수</th>
                 <th className="px-5 py-4 text-center w-[100px]">노출 상태</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {filteredPosts.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-5 py-4 text-center"><input type="checkbox" className="rounded border-zinc-300" /></td>
                  <td className="px-5 py-4"><span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded shadow-sm">{CAT_LABELS[p.category]}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold cursor-pointer group-hover:text-blue-600 transition-colors truncate max-w-[400px]" title={p.title}>{p.title}</span>
                      {p.hasAttachment && <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-zinc-600 font-medium">{p.author}</td>
                  <td className="px-5 py-4 text-center font-mono text-[11px] text-zinc-500">{p.createdAt}</td>
                  <td className="px-5 py-4 text-center font-mono font-extrabold text-zinc-500">{p.views.toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={["px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase border shadow-sm", STATUS_MAP[p.status].style].join(" ")}>
                      {STATUS_MAP[p.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Write Action Fake Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div role="dialog" aria-labelledby={`${modalId}-title`} className="relative z-10 w-full max-w-3xl rounded-2xl border border-zinc-200 bg-zinc-50 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[85vh]">
             <div className="flex items-center justify-between border-b border-zinc-200 p-5 bg-white shrink-0">
              <div>
                <h2 id={`${modalId}-title`} className="text-[18px] font-extrabold text-zinc-900">신규 게시물 에디터</h2>
                <p className="text-[12px] text-zinc-500 font-medium">WYSIWYG 툴 및 다중 파일 첨부 패널 시뮬레이션</p>
              </div>
              <button type="button" className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 transition" onClick={() => setIsModalOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="overflow-y-auto p-6 flex-1 space-y-6">
               {/* 1. 기본 설정 */}
               <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-5">
                 <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                   <label className="text-[13px] font-extrabold text-zinc-700">게시판 구분</label>
                   <select className="w-1/2 rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-mediumtext-zinc-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400">
                     <option>공지사항</option>
                     <option>자주묻는질문</option>
                     <option>관련 자료첩</option>
                   </select>
                 </div>
                 <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                   <label className="text-[13px] font-extrabold text-zinc-700">게시물 제목</label>
                   <input type="text" placeholder="제목을 입력하세요" required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[14px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
                 </div>
               </div>

               {/* 2. 에디터 영역 */}
               <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col min-h-[300px]">
                 <div className="bg-zinc-100 border-b border-zinc-200 p-2 flex gap-2 items-center">
                    <button type="button" className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 font-serif font-black">B</button>
                    <button type="button" className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 font-serif font-bold italic">I</button>
                    <button type="button" className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 underline text-[14px] font-bold">U</button>
                    <div className="w-px h-5 bg-zinc-300 mx-1"></div>
                    <button type="button" className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </button>
                    <span className="text-[11px] text-zinc-400 ml-auto mr-3">Rich Text Editor 렌더링 영역</span>
                 </div>
                 <textarea className="w-full flex-1 p-4 text-[14px] text-zinc-800 resize-none outline-none" placeholder="본문 내용을 이곳에 작성하세요..."></textarea>
               </div>

               <div className="border-2 border-dashed border-zinc-300 bg-zinc-50 rounded-xl p-6 text-center text-zinc-500 cursor-pointer hover:bg-zinc-100 transition-colors">
                 <svg className="w-8 h-8 mx-auto mb-2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                 <span className="text-[12px] font-bold">첨부파일(이미지, PDF 등)을 이곳으로 드래그 하세요</span>
                 <p className="text-[10px] text-zinc-400 mt-1">파일당 최대 10MB 첨부 가능</p>
               </div>
            </form>

            <div className="border-t border-zinc-200 p-5 bg-white shrink-0 flex items-center justify-between">
               <div className="flex gap-4 items-center">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-blue-600 outline-none focus:ring-blue-500" />
                    <span className="text-[13px] font-extrabold text-zinc-700">임시 저장 처리</span>
                 </label>
               </div>
               <div className="flex gap-2">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-bold text-[13px] transition-colors hover:bg-zinc-50">작성 취소</button>
                 <button type="submit" onClick={handleCreate} className="px-5 py-2.5 rounded-xl border border-transparent bg-blue-600 text-white font-bold text-[13px] transition-colors shadow-sm hover:bg-blue-700">게시물 업로드 반영</button>
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
              <h2 id={`${modalId}-board`} className="text-[16px] font-extrabold text-zinc-900 flex items-center gap-2">
                 <span className="w-2 h-4 bg-blue-600 rounded-sm"></span>
                 신규 게시판(카테고리) 추가
              </h2>
              <button type="button" className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 transition" onClick={() => setIsCreateBoardOpen(false)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={(e) => {
               e.preventDefault();
               alert("신규 게시판 카테고리가 등록되었습니다.");
               setIsCreateBoardOpen(false);
            }} className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">게시판 명칭 <span className="text-blue-500">*</span></label>
                <input type="text" placeholder="예: 직원 자유소통방, 업무 공유 게시판" required className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-extrabold text-zinc-700 mb-2">접근 권한 설정</label>
                <select className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500">
                  <option>전체 공개 (대민사이트 노출 포함)</option>
                  <option>내부 관리자 전용</option>
                  <option>특정 부서 전용</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-xl border border-zinc-200/60 mt-2 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-300 text-blue-600" id="reply-check" />
                <label htmlFor="reply-check" className="text-[12px] font-bold text-zinc-700 w-full cursor-pointer">댓글 및 대댓글 활성화 허용</label>
              </div>

              <div className="mt-8 flex gap-3 justify-end items-center border-t border-zinc-100 pt-5">
                 <button type="button" onClick={() => setIsCreateBoardOpen(false)} className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-[13px] hover:bg-zinc-50 transition-colors">취소</button>
                 <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-[13px] shadow-sm transition-colors hover:bg-blue-700">
                   등록 생성 완료
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
