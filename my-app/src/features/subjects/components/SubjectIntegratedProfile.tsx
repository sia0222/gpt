import { useId } from "react";
import type { SubjectDetailView } from "@/features/subjects/services/subjectWorkspaceMock";

interface SubjectIntegratedProfileProps {
  readonly subject: SubjectDetailView;
}

export function SubjectIntegratedProfile({ subject }: SubjectIntegratedProfileProps) {
  const baseId = useId();
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
    <section
      className={["rounded-2xl border p-6 shadow-sm flex flex-col h-full", textColors[aiTheme]].join(" ")}
      aria-labelledby={`${baseId}-ai`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-between w-full mb-6">
          <h2 id={`${baseId}-ai`} className="text-[15px] font-bold text-inherit">
            AI 통합 위험 분석
          </h2>
          <span className="text-[10px] font-bold px-2 py-1 bg-black/5 rounded-md opacity-60">
            1시간 주기 배치
          </span>
        </div>

        <div className={["relative flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br shadow-lg ring-4 ring-offset-2 ring-offset-white mb-6", scoreColors[aiTheme]].join(" ")}>
          <span className="text-[12px] font-bold uppercase tracking-widest opacity-90">Risk Score</span>
          <span className="tabnum text-[42px] font-extrabold leading-none tracking-tighter">
            {ai.totalScore}
          </span>
          <span className="mt-1 rounded border border-white/20 bg-black/10 px-2 py-0.5 text-[11px] font-bold uppercase backdrop-blur-md">
            {ai.gradeLabel}
          </span>
        </div>

        <div className="w-full space-y-2 text-left mb-8">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-60 ml-1">추론 근거</p>
          <ul className="space-y-1.5 text-[13px] bg-white/40 p-4 rounded-xl border border-white/30">
            {ai.reasons.map((r, i) => (
              <li key={i} className="flex gap-2 font-semibold opacity-90 leading-snug">
                <span className="opacity-40">•</span> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI 5대 영역 브레이크다운 */}
      <div className="flex-1 rounded-xl bg-white/60 p-5 backdrop-blur-sm border border-white/40 mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-4">5대 영역 상세 분석</h3>
        <div className="space-y-4">
          {(
            [
              ["생체 이상", ai.breakdown.vital, 40],
              ["건강문서", ai.breakdown.health, 20],
              ["상담 감정", ai.breakdown.emotion, 20],
              ["이상 패턴", ai.breakdown.isolation, 10],
              ["서비스 거부", ai.breakdown.service, 10],
            ] as const
          ).map(([label, val, maxVal]) => {
            const pct = Math.min(100, Math.round((val / maxVal) * 100));
            return (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center px-0.5">
                  <span className="text-[11px] font-bold text-zinc-600">{label}</span>
                  <span className="tabnum text-[11px] font-bold opacity-80">{val} / {maxVal}</span>
                </div>
                <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto border-t pt-5 border-black/5">
        <p className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-3 px-1">권장 조치 프로세스</p>
        <div className="flex flex-col gap-2">
          {ai.recommended.map((a) => (
            <div
              key={a}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-[12px] font-bold shadow-sm border border-white/50"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
              {a}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
