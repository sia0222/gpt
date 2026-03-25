import { PageHeader } from "@/features/admin-shell";
import {
  LIVE_SIGNAL_VALUES_MOCK,
  RISK_EVALUATION_RESULTS_MOCK,
  RISK_RULES_MOCK,
  type RiskLevel,
  type RuleStatus,
} from "@/features/risk-management/services/riskRuleMockData";

export function RiskManagementPage() {
  const activeRules = RISK_RULES_MOCK.filter((r) => r.status === "ACTIVE");
  const criticalEvents = RISK_EVALUATION_RESULTS_MOCK.filter((r) => r.level === "CRITICAL");

  function levelBadge(level: RiskLevel) {
    if (level === "CRITICAL") return "bg-rose-600 text-white";
    if (level === "HIGH") return "bg-rose-100 text-rose-900";
    if (level === "MEDIUM") return "bg-amber-100 text-amber-900";
    return "bg-slate-100 text-slate-700";
  }

  function statusBadge(status: RuleStatus) {
    if (status === "ACTIVE") return "bg-emerald-50 text-emerald-900";
    if (status === "DRAFT") return "bg-amber-50 text-amber-900";
    return "bg-slate-100 text-slate-700";
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="운영 관리 · 위험 관리"
        title="위험 판단 기준 관리"
        description={
          <>
            실시간 센서/헬스케어 데이터를 기준으로 <strong>위험 판단 룰을 작성·관리</strong>하고, 해당
            룰을 대상자 데이터에 대입해 감지 결과를 확인합니다. (백엔드 미연동 목업)
          </>
        }
        badges={[
          { label: `전체 룰 ${RISK_RULES_MOCK.length}`, tone: "neutral" },
          { label: `활성 룰 ${activeRules.length}`, tone: "success" },
          { label: `CRITICAL 감지 ${criticalEvents.length}건`, tone: "danger" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">위험 판단 기준 작성 (UI)</h2>
            <button
              type="button"
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              기준 저장
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-xs text-slate-600">
              기준명
              <input
                type="text"
                value="실내 CO2 과다"
                readOnly
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </label>
            <label className="space-y-1 text-xs text-slate-600">
              기준 신호
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900">
                <option>CO2</option>
                <option>심박</option>
                <option>미활동 시간</option>
              </select>
            </label>
            <label className="space-y-1 text-xs text-slate-600">
              연산자
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900">
                <option>{">="}</option>
                <option>{">"}</option>
                <option>{"<="}</option>
                <option>{"<"}</option>
              </select>
            </label>
            <label className="space-y-1 text-xs text-slate-600">
              임계값
              <input
                type="text"
                value="900"
                readOnly
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </label>
            <label className="space-y-1 text-xs text-slate-600 sm:col-span-2">
              적용 대상
              <input
                type="text"
                value="가정 설치형 CO2 센서"
                readOnly
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </label>
            <label className="space-y-1 text-xs text-slate-600 sm:col-span-2">
              감지 시 조치
              <textarea
                rows={2}
                value="즉시 환기 알림 + 보호자 PUSH"
                readOnly
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            실제 저장/배포는 백엔드 연동 시 반영됩니다. 현재는 룰 작성 UX 목업입니다.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">실시간 입력 데이터 (목업)</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {LIVE_SIGNAL_VALUES_MOCK.map((signal) => {
              const outOfRange =
                signal.signal === "CO2"
                  ? signal.value >= 900
                  : signal.signal === "심박"
                    ? signal.value > 100
                    : signal.signal === "미활동 시간"
                      ? signal.value >= 45
                      : false;
              return (
                <li key={signal.signal} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">{signal.signal}</p>
                  <p
                    className={[
                      "mt-1 text-lg font-semibold",
                      outOfRange ? "text-rose-700" : "text-slate-900",
                    ].join(" ")}
                  >
                    {signal.value}
                    <span className="ml-1 text-sm font-medium text-slate-500">{signal.unit}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    정상 범위 {signal.normalRange} · 출처 {signal.source}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">위험 판단 기준 목록</h2>
          <button
            type="button"
            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-200"
          >
            룰 배포 (UI)
          </button>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-sm">
            <caption className="sr-only">위험 판단 기준 목록</caption>
            <thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">기준명</th>
                <th className="px-3 py-2 font-medium">신호</th>
                <th className="px-3 py-2 font-medium">조건</th>
                <th className="px-3 py-2 font-medium">레벨</th>
                <th className="px-3 py-2 font-medium">대상</th>
                <th className="px-3 py-2 font-medium">조치</th>
                <th className="px-3 py-2 font-medium">상태</th>
                <th className="px-3 py-2 font-medium">수정</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RISK_RULES_MOCK.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/90">
                  <td className="px-3 py-3 font-medium text-slate-900">{rule.name}</td>
                  <td className="px-3 py-3 text-slate-700">{rule.signal}</td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-700">
                    {rule.operator} {rule.threshold}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={[
                        "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        levelBadge(rule.level),
                      ].join(" ")}
                    >
                      {rule.level}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">{rule.targetScope}</td>
                  <td className="px-3 py-3 text-xs text-slate-700">{rule.action}</td>
                  <td className="px-3 py-3">
                    <span
                      className={[
                        "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        statusBadge(rule.status),
                      ].join(" ")}
                    >
                      {rule.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
                    {rule.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">기준 적용 결과 (실시간 대입 목업)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <caption className="sr-only">위험 판단 기준 적용 결과</caption>
            <thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">대상자</th>
                <th className="px-3 py-2 font-medium">권역</th>
                <th className="px-3 py-2 font-medium">매칭 룰</th>
                <th className="px-3 py-2 font-medium">신호값</th>
                <th className="px-3 py-2 font-medium">레벨</th>
                <th className="px-3 py-2 font-medium">감지 시각</th>
                <th className="px-3 py-2 font-medium">조치 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RISK_EVALUATION_RESULTS_MOCK.map((row) => (
                <tr key={`${row.subjectId}-${row.detectedAt}`} className="hover:bg-slate-50/90">
                  <td className="px-3 py-3">
                    <p className="font-medium text-slate-900">{row.subjectName}</p>
                    <p className="text-xs text-slate-500">{row.subjectId}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{row.district}</td>
                  <td className="px-3 py-3 text-xs text-slate-700">{row.matchedRuleName}</td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-700">{row.signalValue}</td>
                  <td className="px-3 py-3">
                    <span
                      className={[
                        "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        levelBadge(row.level),
                      ].join(" ")}
                    >
                      {row.level}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
                    {row.detectedAt}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-700">{row.actionStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
