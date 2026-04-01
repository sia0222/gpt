import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AI_TREND_DATA,
  DONG_RISK_DISTRIBUTION,
  DUPLICATE_SUPPORT_WARNINGS,
  SERVICE_USAGE_MOCK,
} from "@/features/dashboard/services/dashboardMockData";

/* ── 트렌드 톤별 스타일 ───────────────────────────── */
const TONE_STYLE: Record<string, { icon: string; bg: string; text: string; border: string }> = {
  danger:  { icon: "↑", bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200" },
  warning: { icon: "⚡", bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  success: { icon: "✓", bg: "bg-emerald-50",  text: "text-emerald-700",  border: "border-emerald-200" },
};

export function DashboardBottomRows() {
  const [selectedDong, setSelectedDong] = useState<string | null>(null);
  const maxScore = Math.max(...DONG_RISK_DISTRIBUTION.map((d) => d.riskScore));
  const totalEnrolled = SERVICE_USAGE_MOCK.reduce((s, i) => s + i.enrolled, 0);

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* ── [좌측] 지역별 위험도 및 대상자 분포 ─────── */}
      <div className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm h-full">
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-5 py-4">
          <h2 className="text-[14px] font-bold text-zinc-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            지역별 위험도 집중 모니터링
          </h2>
          <span className="text-[10px] uppercase font-bold text-zinc-400">동별 클릭 필터</span>
        </div>
        <div className="flex flex-col gap-1.5 p-5 overflow-y-auto max-h-[340px]">
          {DONG_RISK_DISTRIBUTION.map((d) => {
            const w = maxScore > 0 ? Math.round((d.riskScore / maxScore) * 100) : 0;
            const isSel = selectedDong === d.dong;
            const isHigh = d.riskScore > 70;
            return (
              <button
                key={d.dong}
                type="button"
                onClick={() => setSelectedDong(isSel ? null : d.dong)}
                className={[
                  "rounded-xl px-4 py-3 text-left transition-all border",
                  isSel ? "border-blue-300 bg-blue-50" : "border-transparent hover:bg-zinc-50 hover:border-zinc-200",
                ].join(" ")}
              >
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold text-zinc-800">{d.dong}</span>
                  <div className="flex items-center gap-2">
                    {isHigh && (
                      <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-extrabold text-rose-700 tracking-wider">
                        경고
                      </span>
                    )}
                    <span className="tabnum font-semibold text-zinc-600">{d.riskScore}점</span>
                  </div>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={["bar-fill h-full rounded-full", isHigh ? "bg-rose-500" : "bg-amber-400"].join(" ")}
                    style={{ width: `${w}%` }}
                  />
                </div>
              </button>
            );
          })}
          {selectedDong && (
            <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-[12px] font-semibold text-blue-800 flex items-center justify-between">
              <span>{selectedDong} 기준 필터 적용됨</span>
              <button type="button" onClick={() => setSelectedDong(null)} className="text-[10px] underline underline-offset-2">해제</button>
            </div>
          )}
        </div>
      </div>

      {/* ── [중앙] 서비스 이용 현황 & 중복 지원 ──── */}
      <div className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm h-full">
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-5 py-4">
          <h2 className="text-[14px] font-bold text-zinc-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            운영 서비스 통제
          </h2>
          <Link to="/services" className="text-[11px] font-bold text-blue-600 hover:underline underline-offset-2">관리 바로가기 &rarr;</Link>
        </div>
        
        <div className="flex flex-col p-5 gap-6">
          {/* 중복 경고 배너 */}
          <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/40 p-5 shadow-sm">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100/80 shadow-inner">
                  <span className="text-amber-600 font-extrabold pb-0.5">!</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">서비스 중복 수혜 의심</p>
                  <p className="tabnum text-[24px] font-extrabold leading-tight text-amber-950 mt-1">
                    {DUPLICATE_SUPPORT_WARNINGS.count}
                    <span className="ml-0.5 text-[12px] font-semibold text-amber-800">건 보류 중</span>
                  </p>
                </div>
              </div>
              <Link to="/services" className="rounded-lg bg-orange-500 px-3 py-1.5 text-[12px] font-bold text-white shadow-sm hover:bg-orange-600 transition">확인결재</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <h3 className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-100 pb-2">주요 서비스 점유율</h3>
            {SERVICE_USAGE_MOCK.map((s) => {
              const ratio = totalEnrolled > 0 ? (s.enrolled / totalEnrolled) * 100 : 0;
              return (
                <div key={s.serviceName}>
                  <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                    <span className="font-bold text-zinc-700">{s.serviceName}</span>
                    <span className="tabnum font-extrabold text-zinc-900">
                      {s.enrolled.toLocaleString("ko-KR")}명
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div className={["h-full rounded-full transition-all duration-1000", s.color].join(" ")} style={{ width: `${ratio}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── [우측] AI 플랫폼 추론 결산 ───────── */}
      <div className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm h-full">
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-5 py-4">
          <h2 className="text-[14px] font-bold text-zinc-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            최근 상담결과 및 AI 추세
          </h2>
          <span className="rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-extrabold text-purple-700 tracking-wider">최근 7일 AI</span>
        </div>
        
        <div className="flex flex-col gap-3 p-5 overflow-y-auto">
          {AI_TREND_DATA.map((item) => {
            const t = TONE_STYLE[item.tone] ?? TONE_STYLE.success;
            return (
              <div key={item.title} className={["flex items-start gap-4 rounded-xl border p-4 transition hover:shadow-md bg-white", t.border].join(" ")}>
                <div className={["flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-black shadow-inner", t.bg, t.text].join(" ")}>
                  {t.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-[13px] font-bold text-zinc-900">{item.title}</p>
                    <span className={["tabnum rounded px-2 py-0.5 text-[11px] font-extrabold border", t.bg, t.text, t.border].join(" ")}>
                      {item.stat}
                    </span>
                  </div>
                  <p className="text-[12px] text-zinc-600 leading-snug">{item.description}</p>
                </div>
              </div>
            );
          })}

          <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">상담 핵심 키워드 (STT 텍스트 마이닝)</h3>
            <div className="flex flex-wrap gap-1.5">
              {['병원', '우울함', '불면증', '식사거름', '외로움', '기운없음'].map((kw, idx) => (
                <span key={kw} className={["px-2 py-1 text-[11px] font-bold rounded shadow-sm border", idx < 2 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-white text-zinc-600 border-zinc-200"].join(" ")}>
                 #{kw}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-zinc-400 mt-3 text-right">실시간 음성분석 목업 데이터</p>
          </div>
        </div>
      </div>
    </section>
  );
}
