import { DashboardBottomRows } from "@/features/dashboard/components/DashboardBottomRows";
import { DashboardFilterBar } from "@/features/dashboard/components/DashboardFilterBar";
import { DashboardKpiRow } from "@/features/dashboard/components/DashboardKpiRow";
import { DashboardMidRow } from "@/features/dashboard/components/DashboardMidRow";
import { PageHeader } from "@/features/admin-shell";
import { useAdminLastUpdated } from "@/features/admin-shell/services/useAdminClock";

/**
 * 통합 대시보드 — 스튜디오/애널리틱스형 레이아웃
 */
export function DashboardPage() {
  const updated = useAdminLastUpdated();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="운영 현황"
        description="대상자·기기·알림·콘텐츠 지표를 한 화면에서 확인합니다. 데이터는 UI 목업입니다."
        aside={
          <p className="text-[0.8125rem] text-dash-subtle">
            기준 시각 <time dateTime={updated}>{updated}</time>
          </p>
        }
      />

      <DashboardFilterBar />
      <DashboardKpiRow />
      <DashboardMidRow />
      <DashboardBottomRows />
    </div>
  );
}
