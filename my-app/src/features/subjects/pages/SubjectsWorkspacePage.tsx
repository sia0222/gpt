import { SubjectDetailTabs } from "@/features/subjects/components/SubjectDetailTabs";
import { useSubjectWorkspaceUi } from "@/features/subjects/services/useSubjectWorkspaceUi";

/**
 * 대상자 관리 작업SPACE — 목록 + 상세 (page-composition-guide §3.2)
 */
export function SubjectsWorkspacePage() {
  const { list, selected, select } = useSubjectWorkspaceUi();

  return (
    <div className="mx-auto flex w-full flex-col gap-5 lg:h-[calc(100vh-8rem)] lg:flex-row lg:gap-0 lg:overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm">
      <section
        className="flex w-full flex-col lg:w-80 lg:border-r border-zinc-100 shrink-0"
        aria-label="대상자 검색 및 목록"
      >
        <div className="border-b border-zinc-100 p-5 bg-zinc-50/50">
          <label className="sr-only" htmlFor="subject-search">
            대상자 검색
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              viewBox="0 0 16 16" fill="none"
            >
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              id="subject-search"
              type="search"
              placeholder="이름, 연락처 검색 (UI만)"
              className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 py-2 text-[13px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-zinc-600">
            <span className="rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-zinc-200">지역: 전체</span>
            <span className="rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-zinc-200">상태: 전체</span>
          </div>
        </div>
        <div className="border-b border-zinc-50 px-5 py-2.5 text-[11px] font-medium text-zinc-500 bg-white">
          상태: 이용중 3 · 주의 1 · 정지 1 (목업)
        </div>
        <ul className="flex-1 overflow-auto divide-y divide-zinc-50">
          {list.map((row) => {
            const isSel = selected?.id === row.id;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => select(row)}
                  className={[
                    "flex w-full flex-col items-start gap-1 p-4 text-left transition-colors",
                    isSel ? "bg-blue-50/50 relative" : "hover:bg-zinc-50/80 bg-white",
                  ].join(" ")}
                >
                  {isSel && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
                  <span className={["text-[14px] font-bold", isSel ? "text-blue-900" : "text-zinc-900"].join(" ")}>
                    {row.name}
                  </span>
                  <span className={["text-[12px]", isSel ? "text-blue-700 font-medium" : "text-zinc-500"].join(" ")}>
                    {row.district} · {row.status}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white"
        aria-label="대상자 상세 작업 영역"
      >
        <div className="border-b border-zinc-100 p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">대상자 작업공간</p>
            {selected ? (
              <>
                <h1 className="text-[20px] font-extrabold text-zinc-900">{selected.name}</h1>
                <p className="text-[13px] font-medium text-zinc-500 mt-0.5">
                  {selected.district} · {selected.status}
                </p>
              </>
            ) : (
              <h1 className="text-[20px] font-bold text-zinc-300">선택된 대상자 없음</h1>
            )}
          </div>
          {selected && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="h-9 rounded-lg border border-zinc-200 bg-white px-4 text-[12px] font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                상담 등록
              </button>
              <button
                type="button"
                className="h-9 rounded-lg bg-zinc-800 px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-zinc-700 active:scale-[0.98]"
              >
                조치 이력
              </button>
            </div>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-6 bg-zinc-50/30">
          {selected ? (
            <SubjectDetailTabs />
          ) : (
            <div className="flex h-full items-center justify-center text-[13px] text-zinc-400">
              좌측 목록에서 대상자를 선택해주세요.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
