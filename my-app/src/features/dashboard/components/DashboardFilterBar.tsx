/**
 * 필터 툴바 — 상단 칩/컨트롤 밀도
 */
export function DashboardFilterBar() {
  return (
    <section
      className="dash-card mb-6 flex flex-wrap items-end gap-3 p-4 sm:p-5"
      aria-label="대시보드 필터"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
          Filters
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[12px] font-medium text-zinc-600">
          오늘
        </span>
        <span className="hidden text-zinc-300 sm:inline">·</span>
        <span className="hidden text-[12px] text-zinc-500 sm:inline">지역 전체</span>
      </div>

      <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-500">
        기간
        <select
          className="min-w-[8rem] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px] text-zinc-900 shadow-sm outline-none ring-blue-500/20 focus:ring-2"
          defaultValue="today"
        >
          <option value="today">오늘</option>
          <option value="7d">최근 7일</option>
          <option value="30d">최근 30일</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-500">
        지역
        <select
          className="min-w-[8rem] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px] shadow-sm outline-none ring-blue-500/20 focus:ring-2"
          defaultValue="all"
        >
          <option value="all">전체</option>
          <option value="gangnam">강남구</option>
          <option value="songpa">송파구</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-500">
        담당 동
        <select
          className="min-w-[8rem] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px] shadow-sm outline-none ring-blue-500/20 focus:ring-2"
          defaultValue="all"
        >
          <option value="all">전체</option>
          <option value="d1">○○동</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-500">
        서비스
        <select
          className="min-w-[8rem] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px] shadow-sm outline-none ring-blue-500/20 focus:ring-2"
          defaultValue="all"
        >
          <option value="all">전체</option>
          <option value="hc">헬스케어</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-500">
        상태
        <select
          className="min-w-[8rem] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px] shadow-sm outline-none ring-blue-500/20 focus:ring-2"
          defaultValue="all"
        >
          <option value="all">전체</option>
          <option value="using">이용중</option>
          <option value="risk">위험</option>
        </select>
      </label>
      <button
        type="button"
        className="ml-auto rounded-lg bg-zinc-900 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-zinc-800"
      >
        조회
      </button>
    </section>
  );
}
