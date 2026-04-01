import { useId, useMemo, useState } from "react";
import type { SubjectDetailView } from "@/features/subjects/services/subjectWorkspaceMock";

type ChartPeriod = "h24" | "d7" | "d30";

interface SubjectIntegratedProfileProps {
  readonly subject: SubjectDetailView;
}

function MiniVitalChart({ values, label }: { values: readonly number[]; label: string }) {
  const max = Math.max(...values, 1);
  return (
    <div
      className="mt-4 flex h-28 items-end gap-1 px-1"
      role="img"
      aria-label={`${label} 추이 차트`}
    >
      {values.map((v, i) => {
        const MathMax = Math.max;
        const h = Math.round((v / max) * 100);
        return (
          <div
            key={i}
            className="group relative flex-1 rounded-t bg-gradient-to-t from-blue-100 to-blue-400 hover:from-blue-400 hover:to-blue-600 transition-colors"
            style={{ height: `${MathMax(12, h)}%` }}
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10">
              {v}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SubjectIntegratedProfile({ subject }: SubjectIntegratedProfileProps) {
  const baseId = useId();
  const [period, setPeriod] = useState<ChartPeriod>("h24");
  const [pdfOpen, setPdfOpen] = useState<{ title: string; summary: string } | null>(null);

  const chartValues = useMemo(() => {
    if (period === "h24") return subject.vitalChart.h24;
    if (period === "d7") return subject.vitalChart.d7;
    return subject.vitalChart.d30;
  }, [period, subject.vitalChart]);

  const periodLabel = period === "h24" ? "24시간" : period === "d7" ? "7일" : "30일";
  const ai = subject.aiIntegrated;

  // AI 톤 셋팅
  const aiTheme = subject.riskLevel === "critical" ? "rose" : subject.riskLevel === "high" ? "orange" : subject.riskLevel === "watch" ? "amber" : "blue";
  
  const scoreColors: Record<string, string> = {
    rose: "bg-rose-500 text-rose-50 ring-rose-200 from-rose-500 to-rose-600",
    orange: "bg-orange-500 text-orange-50 ring-orange-200 from-orange-500 to-orange-600",
    amber: "bg-amber-500 text-amber-50 ring-amber-200 from-amber-500 to-amber-600",
    blue: "bg-blue-500 text-blue-50 ring-blue-200 from-blue-500 to-blue-600"
  };

  const textColors: Record<string, string> = {
    rose: "text-rose-900 border-rose-100 bg-rose-50/50",
    orange: "text-orange-900 border-orange-100 bg-orange-50/50",
    amber: "text-amber-900 border-amber-100 bg-amber-50/50",
    blue: "text-blue-900 border-blue-100 bg-blue-50/50"
  };

  return (
    <div className="space-y-6">
      {/* ── 1. AI 통합 추론 보드 (최상단) ── */}
      <section
        className={["rounded-2xl border p-6 shadow-sm", textColors[aiTheme]].join(" ")}
        aria-labelledby={`${baseId}-ai`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          <div className="flex items-center gap-6 lg:w-[35%] shrink-0">
            <div className={["relative flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br shadow-md ring-4 ring-offset-2 ring-offset-white", scoreColors[aiTheme]].join(" ")}>
              <span className="text-[12px] font-bold uppercase tracking-widest opacity-90">Score</span>
              <span className="tabnum text-[38px] font-extrabold leading-none tracking-tighter">
                {ai.totalScore}
              </span>
              <span className="mt-1 rounded border border-white/20 bg-black/10 px-1.5 py-0.5 text-[10px] font-bold uppercase backdrop-blur-md">
                {ai.gradeLabel}
              </span>
            </div>
            <div>
              <h2 id={`${baseId}-ai`} className="text-[15px] font-bold text-inherit mb-2">
                AI 하이브리드 위험 추론
              </h2>
              <ul className="space-y-1.5 text-[12px]">
                {ai.reasons.map((r, i) => (
                  <li key={i} className="flex gap-1.5 font-medium opacity-90">
                    <span className="opacity-70 mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI 5대 영역 브레이크다운 막대 그래픽 */}
          <div className="flex-1 rounded-xl bg-white/60 p-5 backdrop-blur-sm border border-white/40">
            <h3 className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-3">5대 영역 점수 분포 (비중 환산)</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["실시간 생체 이상", ai.breakdown.vital, 40],
                  ["건강문서 위험지표", ai.breakdown.health, 20],
                  ["상담 감정위험", ai.breakdown.emotion, 20],
                  ["고립/이상 패턴", ai.breakdown.isolation, 10],
                  ["서비스 이용 거부", ai.breakdown.service, 10],
                ] as const
              ).map(([label, val, maxVal]) => {
                const pct = Math.min(100, Math.round((val / maxVal) * 100));
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-[11px] font-semibold text-zinc-600 truncate">{label}</span>
                    <div className="flex-1 h-1.5 bg-black/5 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-10 shrink-0 text-right tabnum text-[11px] font-bold uppercase opacity-80">{val} / {maxVal}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t pt-4 border-black/5">
          <span className="text-[12px] font-bold uppercase tracking-wide opacity-70 mt-1.5 mr-2">권장 조치:</span>
          {ai.recommended.map((a) => (
            <span
              key={a}
              className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-bold shadow-sm"
            >
             {a}
            </span>
          ))}
        </div>
      </section>

      {/* ── 2. 통합 모니터링 3컬럼 위젯 (실시간 / 헬스케어 / 상담) ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* 실시간 생체 데이터 */}
        <section
          className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm flex flex-col"
          aria-labelledby={`${baseId}-realtime`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id={`${baseId}-realtime`} className="text-[14px] font-bold text-zinc-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              실시간 데이터 추이
            </h2>
            <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/50">
              {(
                [["h24", "24H"], ["d7", "7D"], ["d30", "30D"]] as const
              ).map(([key, lab]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriod(key)}
                  className={[
                    "rounded-md px-2 py-1 text-[10px] font-bold",
                    period === key ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800",
                  ].join(" ")}
                >
                  {lab}
                </button>
              ))}
            </div>
          </div>
          
          <MiniVitalChart values={chartValues} label={`활동·심박 ${periodLabel}`} />
          
          <ul className="mt-auto pt-5 space-y-2">
            {subject.realtime.length === 0 ? (
              <li className="text-[12px] text-zinc-400 text-center py-2 bg-zinc-50 rounded-lg border border-dashed border-zinc-200">실시간 측정 데이터 없음</li>
            ) : (
              subject.realtime.map((row) => (
                <li key={row.label} className="flex justify-between items-center text-[13px] border-b border-zinc-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-zinc-600 font-medium">{row.label}</span>
                  <span className={[
                    "font-bold tabnum",
                    row.level === "warn" ? "text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md" : "text-zinc-900"
                  ].join(" ")}>
                    {row.value}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* 헬스케어 (문서해석) */}
        <section
          className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm flex flex-col"
          aria-labelledby={`${baseId}-health`}
        >
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <h2 id={`${baseId}-health`} className="text-[14px] font-bold text-zinc-900">
              헬스케어 기록 (OCR/PDF)
            </h2>
          </div>
          <ul className="flex-1 space-y-3 overflow-y-auto pr-1">
            {subject.healthcarePdfs.map((pdf) => (
              <li key={pdf.id} className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 transition-colors hover:bg-zinc-50">
                <p className="font-bold text-[13px] text-zinc-900 leading-tight">{pdf.title}</p>
                <p className="text-[11px] font-mono text-zinc-400 mt-1">{pdf.date}</p>
                <div className="mt-2 text-[12px] leading-relaxed text-zinc-600 border-l-2 border-blue-200 pl-2">
                  <span className="font-bold text-blue-800 text-[10px] uppercase block mb-0.5">AI 추출 요약</span>
                  {pdf.summary}
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-zinc-700 bg-white border border-zinc-200 px-2 py-1 rounded shadow-sm hover:bg-zinc-50"
                  onClick={() => setPdfOpen({ title: pdf.title, summary: pdf.summary })}
                >
                  <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  원문 확인
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* AI 상담 결과 (STT/감정) */}
        <section
          className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm flex flex-col"
          aria-labelledby={`${baseId}-counsel`}
        >
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <h2 id={`${baseId}-counsel`} className="text-[14px] font-bold text-zinc-900">
              AI 스피커 상담분석
            </h2>
          </div>
          <ul className="flex-1 space-y-4 overflow-y-auto pr-1">
            {subject.consultations.map((c) => (
              <li key={c.at} className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
                <p className="font-mono text-[11px] font-medium text-zinc-400 bg-white border border-zinc-200 inline-block px-1.5 py-0.5 rounded-md mb-2">{c.at}</p>
                <div className="text-[13px] leading-relaxed text-zinc-800 font-medium">
                  {c.summary}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-200/60 pt-2 text-[11px]">
                  <span className="text-zinc-500">감정 분석</span>
                  <div className="flex items-center gap-2 text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md font-bold">
                    {c.emotionLabel} <span className="opacity-40">|</span> <span className="tabnum font-mono">{c.emotionScore.toFixed(2)}</span>
                  </div>
                </div>
                {c.keywords.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span className="text-zinc-400 shrink-0 font-medium">검출 태그</span>
                    <div className="flex flex-wrap gap-1">
                      {c.keywords.map(kw => (
                        <span key={kw} className="bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded font-bold">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* PDF 모달 */}
      {pdfOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity"
            aria-label="닫기"
            onClick={() => setPdfOpen(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${baseId}-pdf-title`}
            className="relative z-10 w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl overflow-hidden flex flex-col h-[80vh]"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 shrink-0">
              <h2 id={`${baseId}-pdf-title`} className="text-[16px] font-bold text-zinc-900">
                {pdfOpen.title} (가상 뷰어)
              </h2>
              <button
                type="button"
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
                onClick={() => setPdfOpen(null)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 flex flex-col items-center justify-center bg-zinc-50 border border-dashed border-zinc-200 rounded-xl my-4 text-center px-4">
              <svg className="w-12 h-12 text-zinc-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[14px] font-bold text-zinc-700">문서 원문 렌더링 영역</p>
              <p className="text-[12px] text-zinc-500 mt-1 max-w-sm leading-relaxed">추후 백엔드에서 원문 PDF/이미지 URL을 받아올 경우, 이곳에 PDF.js 등 뷰어가 삽입됩니다.</p>
            </div>

            <div className="shrink-0 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <p className="text-[11px] font-bold text-blue-800 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                AI 추출 결과
              </p>
              <p className="text-[13px] font-medium leading-relaxed text-zinc-800">{pdfOpen.summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
