import { Link } from "react-router-dom";
import type { KpiSentiment } from "@/features/dashboard/services/dashboardMockData";
import { KPI_ROW } from "@/features/dashboard/services/dashboardMockData";

const ACCENT: Record<string, string> = {
  total: "from-blue-500/90 to-indigo-500/90",
  active: "from-emerald-500/90 to-teal-500/90",
  risk: "from-rose-500/90 to-orange-500/90",
  offline: "from-amber-500/90 to-yellow-500/90",
  alerts: "from-violet-500/90 to-purple-500/90",
  publish: "from-sky-500/90 to-cyan-500/90",
};

function DeltaBadge({ delta, sentiment }: { delta: string; sentiment: KpiSentiment }) {
  const cls =
    sentiment === "positive"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
      : sentiment === "negative"
        ? "bg-rose-50 text-rose-800 ring-rose-100"
        : "bg-zinc-100 text-zinc-600 ring-zinc-200";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        cls,
      ].join(" ")}
    >
      {delta} <span className="sr-only">전 기간 대비</span>
    </span>
  );
}

export function DashboardKpiRow() {
  return (
    <section aria-label="핵심 지표 요약">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {KPI_ROW.map((k) => (
          <li key={k.key}>
            <Link
              to="/subjects"
              className="dash-card group relative block h-full overflow-hidden p-4 transition hover:shadow-md hover:ring-1 hover:ring-zinc-200/80"
            >
              <div
                className={[
                  "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r opacity-90",
                  ACCENT[k.key] ?? "from-zinc-400 to-zinc-500",
                ].join(" ")}
                aria-hidden
              />
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12px] font-medium text-zinc-500">{k.label}</p>
                <DeltaBadge delta={k.delta} sentiment={k.sentiment} />
              </div>
              <p className="mt-3 text-[26px] font-semibold tabular-nums tracking-tight text-zinc-900">
                {k.value}
              </p>
              <p className="mt-1 text-[11px] text-zinc-400">{k.hint}</p>
              <span className="mt-3 inline-flex text-[12px] font-medium text-blue-600 opacity-0 transition group-hover:opacity-100">
                자세히 →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
