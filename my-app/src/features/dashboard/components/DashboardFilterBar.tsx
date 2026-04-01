/**
 * 대시보드 검색·필터 — 콤팩트 인라인 스타일
 */
export function DashboardFilterBar() {
  const selectClass =
    "h-8 rounded-lg border border-zinc-200 bg-white px-2.5 text-[12px] text-zinc-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <section
      className="flex flex-wrap items-center gap-2.5 rounded-xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm"
      aria-label="대시보드 필터"
    >
      {/* 검색 */}
      <div className="relative min-w-[180px] flex-1 basis-[180px]">
        <svg
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
          viewBox="0 0 16 16" fill="none" aria-hidden
        >
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          id="dash-search"
          type="search"
          placeholder="이름 · 주소 검색"
          className="h-8 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 pl-8 pr-3 text-[12px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          autoComplete="off"
        />
      </div>

      {/* 구분선 */}
      <div className="hidden h-5 w-px bg-zinc-200 sm:block" aria-hidden />

      {/* 필터 셀렉트 */}
      {([
        { label: "지역", opts: ["전체", "강남구", "송파구"] },
        { label: "담당자", opts: ["전체", "박간호", "이상담"] },
        { label: "위험등급", opts: ["전체", "정상", "관심", "주의", "위험", "긴급"] },
        { label: "연령", opts: ["전체", "65–74", "75–84", "85+"] },
      ] as const).map(({ label, opts }) => (
        <select key={label} className={selectClass} defaultValue="전체" aria-label={label}>
          {opts.map((o) => (
            <option key={o}>{label === "지역" || label === "담당자" ? o : `${label} ${o}`}</option>
          ))}
        </select>
      ))}

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-[12px] font-medium text-zinc-500 transition hover:bg-zinc-50 active:scale-[0.97]"
        >
          초기화
        </button>
        <button
          type="button"
          className="h-8 rounded-lg bg-zinc-800 px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-zinc-700 active:scale-[0.97]"
        >
          조회
        </button>
      </div>
    </section>
  );
}
