import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CONTENT_OPS_LINES,
  DEVICE_OPS_LINES,
  HEALTHCARE_LINES,
  RECENT_ACTIVITY,
  STATS_OPS_LINES,
  SUBJECT_OPS_LINES,
} from "@/features/dashboard/services/dashboardMockData";

interface PanelProps {
  readonly title: string;
  readonly lines: readonly string[];
  readonly foot?: ReactNode;
}

function LinesPanel({ title, lines, foot }: PanelProps) {
  return (
    <div className="dash-card flex flex-col p-5">
      <h2 className="text-[13px] font-semibold text-zinc-900">{title}</h2>
      <ul className="mt-4 flex-1 space-y-2.5 text-[13px] text-zinc-600">
        {lines.map((line) => (
          <li
            key={line}
            className="border-l-2 border-blue-100 pl-3 leading-snug"
          >
            {line}
          </li>
        ))}
      </ul>
      {foot ? <div className="mt-4 border-t border-zinc-100 pt-3">{foot}</div> : null}
    </div>
  );
}

export function DashboardBottomRows() {
  return (
    <>
      <section
        className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        aria-label="운영 요약"
      >
        <LinesPanel
          title="대상자 운영 현황"
          lines={SUBJECT_OPS_LINES}
          foot={
            <Link
              to="/subjects"
              className="text-[12px] font-medium text-blue-600 hover:text-blue-700"
            >
              작업공간 열기 →
            </Link>
          }
        />
        <LinesPanel
          title="헬스케어 데이터 현황"
          lines={HEALTHCARE_LINES}
          foot={
            <span className="text-[11px] text-zinc-400">
              대상자 맥락 지표 요약 (목업)
            </span>
          }
        />
        <LinesPanel
          title="기기 운영 현황"
          lines={DEVICE_OPS_LINES}
          foot={
            <Link
              to="/monitoring"
              className="text-[12px] font-medium text-blue-600 hover:text-blue-700"
            >
              기기 관제 →
            </Link>
          }
        />
      </section>

      <section
        className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        aria-label="콘텐츠·통계·이력"
      >
        <LinesPanel
          title="콘텐츠 운영 현황"
          lines={CONTENT_OPS_LINES}
          foot={
            <Link
              to="/content"
              className="text-[12px] font-medium text-blue-600 hover:text-blue-700"
            >
              콘텐츠 관리 →
            </Link>
          }
        />
        <LinesPanel
          title="통계 운영 현황"
          lines={STATS_OPS_LINES}
          foot={
            <Link
              to="/statistics"
              className="text-[12px] font-medium text-blue-600 hover:text-blue-700"
            >
              통계 관리 →
            </Link>
          }
        />
        <div className="dash-card flex flex-col p-5">
          <h2 className="text-[13px] font-semibold text-zinc-900">최근 작업 이력</h2>
          <ul className="mt-4 divide-y divide-zinc-100">
            {RECENT_ACTIVITY.map((row) => (
              <li key={`${row.time}-${row.action}`} className="py-3 first:pt-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] tabular-nums text-zinc-400">{row.time}</span>
                </div>
                <p className="text-[13px] text-zinc-800">
                  <span className="font-semibold">{row.actor}</span>
                  <span className="text-zinc-600"> · {row.action}</span>
                </p>
                <p className="text-[12px] text-zinc-500">{row.target}</p>
              </li>
            ))}
          </ul>
          <Link
            to="/operations"
            className="mt-auto border-t border-zinc-100 pt-3 text-[12px] font-medium text-blue-600 hover:text-blue-700"
          >
            운영 이력 더보기 →
          </Link>
        </div>
      </section>
    </>
  );
}
