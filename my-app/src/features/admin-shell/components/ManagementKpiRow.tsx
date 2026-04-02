

/* ── SVG 미니 스파크라인 ──────────────────────────── */
function Sparkline({ data, color }: { data: readonly number[]; color: string }) {
  const h = 32;
  const w = 80;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  const STROKE: Record<string, string> = {
    emerald: "#10b981",
    rose: "#f43f5e",
    amber: "#f59e0b",
    blue: "#3b82f6",
    zinc: "#71717a",
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-20" fill="none" aria-hidden>
      <polyline
        points={points}
        stroke={STROKE[color] ?? "#94a3b8"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── 스타일 토큰 ──────────────────────────────────── */
const CARD_STYLE: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
  zinc: { bg: "bg-zinc-50", text: "text-zinc-700", ring: "ring-zinc-200" },
};

/* ── 아이콘 컴포넌트 ───────────────────────────────── */
export function KpiIcon({ name, className }: { name: string; className?: string }) {
  if (name === "monitor") {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm4 12h6m-3-3v3" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === "alert") {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.168-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.457-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
      </svg>
    );
  }
  if (name === "people") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  if (name === "bell") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
    </svg>
  );
}

export interface ManagementKpiItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
  readonly sentiment?: "positive" | "negative" | "neutral";
  readonly color: "emerald" | "rose" | "amber" | "blue" | "zinc";
  readonly icon: string;
  readonly sparkline: number[];
}

export function ManagementKpiRow({ items, className }: { items: readonly ManagementKpiItem[]; className?: string }) {
  return (
    <div className={["grid gap-4 sm:grid-cols-2", className || "lg:grid-cols-4"].join(" ")}>
      {items.map((item) => {
        const style = CARD_STYLE[item.color];
        const isNeg = item.sentiment === "negative";
        
        return (
          <div key={item.id} className="kpi-card group relative flex flex-col gap-3 rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div className={["flex h-9 w-9 items-center justify-center rounded-xl", style.bg].join(" ")}>
                <KpiIcon name={item.icon} className={["h-[18px] w-[18px]", style.text].join(" ")} />
              </div>
              <Sparkline data={item.sparkline} color={item.color} />
            </div>
            <div>
              <p className="tabnum text-[32px] font-extrabold leading-none tracking-tight text-zinc-900">{item.value}</p>
              <p className="mt-1.5 text-[12px] font-medium text-zinc-500">{item.label}</p>
            </div>
            {item.delta && (
              <div className="flex items-center gap-1.5">
                <span className={[
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[12px] font-semibold",
                  isNeg ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600",
                ].join(" ")}>
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                    <path
                      d={isNeg ? "M6 3v6M3 6l3 3 3-3" : "M6 9V3M3 6l3-3 3 3"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item.delta}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
