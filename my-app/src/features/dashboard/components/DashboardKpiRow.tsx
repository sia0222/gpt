import { Link } from "react-router-dom";
import {
  SCORECARDS,
  type ScoreCardData,
} from "@/features/dashboard/services/dashboardMockData";

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
  };

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-8 w-20"
      fill="none"
      aria-hidden
    >
      <polyline
        points={points}
        stroke={STROKE[color] ?? "#94a3b8"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ── 스코어카드 컨테이너 ──────────────────────────── */
const CARD_STYLE: Record<string, { accent: string; bg: string; text: string; ring: string }> = {
  emerald: {
    accent: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  rose: {
    accent: "bg-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
  },
  amber: {
    accent: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  blue: {
    accent: "bg-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
  },
};

/* ── SVG 아이콘 ──────────────────────────────────── */
function IconMonitor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm4 12h6m-3-3v3" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function IconAlert({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.168-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.457-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
      <path fillRule="evenodd" d="M10 1a.75.75 0 01.65.378l6.524 11.4A.75.75 0 0116.524 14H3.475a.75.75 0 01-.65-1.222l6.524-11.4A.75.75 0 0110 1zM5.12 12.5h9.76L10 3.94 5.12 12.5z" clipRule="evenodd"/>
      <path d="M10 2.5l-7 5v4.5c0 3.5 3 6 7 7.5 4-1.5 7-4 7-7.5V7.5l-7-5z" fill="currentColor" opacity="0.15"/>
      <path d="M10 2.5l-7 5v4.5c0 3.5 3 6 7 7.5 4-1.5 7-4 7-7.5V7.5l-7-5z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
    </svg>
  );
}

const SCORE_ICONS = [IconMonitor, IconAlert, IconShield, IconCheck];

function ScoreCard({ card, index }: { card: ScoreCardData; index: number }) {
  const style = CARD_STYLE[card.color] ?? CARD_STYLE.blue;
  const Icon = SCORE_ICONS[index] ?? IconCheck;
  const isNeg = card.sentiment === "negative";

  return (
    <div className="kpi-card group relative flex flex-col gap-3 rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      {/* 상단 아이콘 + 스파크라인 */}
      <div className="flex items-start justify-between">
        <div className={["flex h-9 w-9 items-center justify-center rounded-xl", style.bg].join(" ")}>
          <Icon className={["h-[18px] w-[18px]", style.text].join(" ")} />
        </div>
        <Sparkline data={card.sparkline} color={card.color} />
      </div>

      {/* 수치 */}
      <div>
        <p className="tabnum text-[28px] font-extrabold leading-none tracking-tight text-zinc-900">
          {card.value}
        </p>
        <p className="mt-1.5 text-[12px] font-medium text-zinc-500">{card.label}</p>
      </div>

      {/* 델타 */}
      <div className="flex items-center gap-1.5">
        <span className={[
          "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
          isNeg ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600",
        ].join(" ")}>
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d={isNeg ? "M6 3v6M3 6l3 3 3-3" : "M6 9V3M3 6l3-3 3 3"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {card.delta}
        </span>
      </div>
    </div>
  );
}

export function DashboardKpiRow() {
  return (
    <section aria-label="핵심 지표 스코어카드">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SCORECARDS.map((card, i) => (
          <ScoreCard key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* 서브 지표 (상세 수치 행) */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {([
          { key: "total",     label: "전체",   value: "12,480", color: "bg-zinc-400" },
          { key: "normal",    label: "정상",   value: "9,020",  color: "bg-emerald-400" },
          { key: "concern",   label: "관심",   value: "1,842",  color: "bg-sky-400" },
          { key: "watch",     label: "주의",   value: "1,580",  color: "bg-amber-400" },
          { key: "danger",    label: "위험",   value: "312",    color: "bg-rose-400" },
          { key: "critical",  label: "긴급",   value: "24",     color: "bg-red-500" },
          { key: "pending",   label: "미조치", value: "47",     color: "bg-violet-400" },
          { key: "no_signal", label: "미수신", value: "156",    color: "bg-slate-400" },
        ] as const).map((item) => (
          <Link
            key={item.key}
            to={`/subjects?kpi=${item.key}`}
            className="group flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-white px-3 py-2.5 transition-all hover:border-zinc-200 hover:shadow-sm"
          >
            <span className={["h-2 w-2 rounded-full shrink-0", item.color].join(" ")} />
            <span className="text-[11px] font-medium text-zinc-500 truncate">{item.label}</span>
            <span className="tabnum ml-auto text-[13px] font-bold text-zinc-800">{item.value}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
