import { SubjectDetailTabs } from "@/features/subjects/components/SubjectDetailTabs";
import { useSubjectWorkspaceUi } from "@/features/subjects/services/useSubjectWorkspaceUi";

/**
 * 대상자 관리 작업SPACE — 목록 + 상세 (page-composition-guide §3.2)
 */
export function SubjectsWorkspacePage() {
  const { list, selected, select } = useSubjectWorkspaceUi();

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:h-[calc(100vh-8rem)] lg:flex-row lg:gap-0 lg:overflow-hidden">
      <section
        className="flex w-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm lg:w-80 lg:rounded-r-none lg:border-r-0"
        aria-label="대상자 검색 및 목록"
      >
        <div className="border-b border-slate-200 p-4">
          <label className="sr-only" htmlFor="subject-search">
            대상자 검색
          </label>
          <input
            id="subject-search"
            type="search"
            placeholder="이름, 연락처 검색 (UI만)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">지역: 전체</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">상태: 전체</span>
          </div>
        </div>
        <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
          상태 요약: 이용중 3 · 주의 1 · 일시중지 1 (목업)
        </div>
        <ul className="flex-1 overflow-auto">
          {list.map((row) => {
            const isSel = selected?.id === row.id;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => select(row)}
                  className={[
                    "flex w-full flex-col items-start gap-0.5 border-b border-slate-100 px-4 py-3 text-left text-sm transition",
                    isSel ? "bg-slate-900 text-white" : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span className="font-semibold">{row.name}</span>
                  <span className={isSel ? "text-slate-200" : "text-slate-500"}>
                    {row.district} · {row.status}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:rounded-l-none"
        aria-label="대상자 상세 작업 영역"
      >
        <div className="border-b border-slate-200 p-4">
          <h1 className="text-lg font-bold text-slate-900">대상자 작업공간</h1>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">선택된 대상자</p>
              <p className="text-xl font-semibold text-slate-900">{selected?.name ?? "—"}</p>
              <p className="text-xs text-slate-500">
                {selected?.district} · {selected?.status}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-200"
              >
                상담 등록 (UI)
              </button>
              <button
                type="button"
                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                조치 이력 (UI)
              </button>
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <SubjectDetailTabs />
        </div>
      </section>
    </div>
  );
}
