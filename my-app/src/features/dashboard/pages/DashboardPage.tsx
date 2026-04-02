import { DashboardBottomRows } from "@/features/dashboard/components/DashboardBottomRows";
import { DashboardFilterBar } from "@/features/dashboard/components/DashboardFilterBar";
import { DashboardKpiRow } from "@/features/dashboard/components/DashboardKpiRow";
import { DashboardMidRow } from "@/features/dashboard/components/DashboardMidRow";
import { PageHeader } from "@/features/admin-shell";
import { useAdminLastUpdated } from "@/features/admin-shell/services/useAdminClock";

/**
 * 통합 모니터링 대시보드 — 메인 페이지
 */
export function DashboardPage() {
  const updated = useAdminLastUpdated();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow="OVERVIEW · 통합 모니터링 대시보드"
        title="통합 모니터링 대시보드"
        aside={
          <div className="flex items-center gap-3">
            <p className="font-mono text-[11px] text-zinc-400">
              {updated}
            </p>
            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[12px] font-medium text-zinc-600 shadow-sm transition hover:bg-zinc-50 active:scale-[0.97]"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M2 8a6 6 0 0111.472-2.5M14 8a6 6 0 01-11.472 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M14 2v4h-4M2 14v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              새로고침
            </button>
          </div>
        }
      />

      <DashboardFilterBar />
      <DashboardKpiRow />
      <DashboardMidRow />
      <DashboardBottomRows />
    </div>
  );
}
