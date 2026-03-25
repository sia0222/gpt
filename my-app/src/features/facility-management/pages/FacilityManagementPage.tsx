import { PageHeader } from "@/features/admin-shell";
import { FACILITY_OCCUPANCY } from "@/features/shared";

export function FacilityManagementPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="운영 관리 · 시설"
        title="시설"
        description="시설별 가동률·환경 지표 등을 요약해 봅니다. (목업)"
      />
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">시설 가동률 및 CO2 평균</h2>
        <ul className="mt-3 space-y-2">
          {FACILITY_OCCUPANCY.map((row) => (
            <li key={row.name} className="grid grid-cols-[130px_1fr_1fr] items-center gap-3 text-xs">
              <span className="truncate text-slate-600">{row.name}</span>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${row.occupancy}%` }}
                />
              </div>
              <span className="text-right text-slate-700">
                가동률 {row.occupancy}% · CO2 {row.co2}ppm
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
