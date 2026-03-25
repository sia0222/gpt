import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/features/admin-shell";
import {
  SUBJECT_LIST_MOCK,
  SUBJECT_RISK_ORDER,
  type SubjectListItem,
} from "@/features/subjects/services/subjectWorkspaceMock";
import { RISK_LABEL, riskBadgeClasses } from "@/features/subjects/utils/subjectRiskUi";

type RiskFilter = "all" | "danger";

function filterByQuery(rows: readonly SubjectListItem[], q: string) {
  const s = q.trim().toLowerCase();
  if (!s) {
    return rows;
  }
  return rows.filter(
    (r) =>
      r.name.toLowerCase().includes(s) ||
      r.district.toLowerCase().includes(s) ||
      r.caseManager.toLowerCase().includes(s) ||
      r.primaryService.toLowerCase().includes(s) ||
      r.riskSummary.toLowerCase().includes(s),
  );
}

export function SubjectsListPage() {
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");

  const stats = useMemo(() => {
    const total = SUBJECT_LIST_MOCK.length;
    const danger = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "critical" || r.riskLevel === "high").length;
    const watch = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "watch").length;
    const normal = SUBJECT_LIST_MOCK.filter((r) => r.riskLevel === "normal").length;
    return { total, danger, watch, normal };
  }, []);

  const rows = useMemo(() => {
    let list = [...SUBJECT_LIST_MOCK];
    if (riskFilter === "danger") {
      list = list.filter((r) => r.riskLevel === "critical" || r.riskLevel === "high");
    }
    list = filterByQuery(list, query);
    list.sort((a, b) => {
      const ra = SUBJECT_RISK_ORDER[a.riskLevel];
      const rb = SUBJECT_RISK_ORDER[b.riskLevel];
      if (ra !== rb) {
        return ra - rb;
      }
      return a.name.localeCompare(b.name, "ko");
    });
    return list;
  }, [query, riskFilter]);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="운영 관리 · 대상자"
        title="대상자 목록"
        description={
          <>
            <strong>위험 등급·알림·기기·담당</strong>을 한 눈에 보실 수 있도록 구성했습니다. 긴급·높음은
            상단에 모이며, 필터로 위험 대상만 볼 수 있습니다. (데이터는 목업)
          </>
        }
        badges={[
          { label: `전체 ${stats.total}명`, tone: "neutral" },
          { label: `긴급·높음 ${stats.danger}명`, tone: "danger" },
          { label: `주의 ${stats.watch}명`, tone: "warning" },
          { label: `안전 ${stats.normal}명`, tone: "success" },
        ]}
      />

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="subject-list-search">
              대상자 검색
            </label>
            <input
              id="subject-list-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름, 지역, 담당, 서비스, 위험요 검색"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500/25 focus:ring-2"
              autoComplete="off"
            />
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="위험 필터"
          >
            <button
              type="button"
              onClick={() => setRiskFilter("all")}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                riskFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              ].join(" ")}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => setRiskFilter("danger")}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                riskFilter === "danger"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-900 ring-1 ring-rose-100 hover:bg-rose-100",
              ].join(" ")}
            >
              긴급·높음만
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500" aria-live="polite">
          표시 {rows.length}명 · 정렬: 위험도(긴급 우선) → 이름
        </p>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[920px] text-left text-sm">
            <caption className="sr-only">
              대상자 목록. 열: 위험, 대상자, 지역, 서비스, 기기, 최근신호, 알림, 이용상태, 담당, 보기
            </caption>
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th scope="col" className="whitespace-nowrap px-3 py-3">
                  위험
                </th>
                <th scope="col" className="px-3 py-3">
                  대상자
                </th>
                <th scope="col" className="px-3 py-3">
                  지역
                </th>
                <th scope="col" className="px-3 py-3">
                  주요 서비스
                </th>
                <th scope="col" className="px-3 py-3">
                  기기
                </th>
                <th scope="col" className="whitespace-nowrap px-3 py-3">
                  최근 신호
                </th>
                <th scope="col" className="min-w-[200px] px-3 py-3">
                  활성 알림
                </th>
                <th scope="col" className="px-3 py-3">
                  이용
                </th>
                <th scope="col" className="px-3 py-3">
                  담당
                </th>
                <th scope="col" className="px-3 py-3 text-right">
                  상세
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-12 text-center text-sm text-slate-500">
                    조건에 맞는 대상자가 없습니다.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className={[
                      "align-top hover:bg-slate-50/90",
                      row.riskLevel === "critical" ? "bg-rose-50/40" : "",
                      row.riskLevel === "high" ? "bg-rose-50/20" : "",
                    ].join(" ")}
                  >
                    <td className="whitespace-nowrap px-3 py-3">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold",
                          riskBadgeClasses(row.riskLevel),
                        ].join(" ")}
                      >
                        {RISK_LABEL[row.riskLevel]}
                      </span>
                      <p className="mt-1 max-w-[8rem] text-[11px] leading-snug text-slate-600">
                        {row.riskSummary}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-slate-900">{row.name}</p>
                      <p className="text-xs text-slate-500">{row.age}세</p>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{row.district}</td>
                    <td className="px-3 py-3 text-slate-700">{row.primaryService}</td>
                    <td className="px-3 py-3">
                      <p className="font-mono text-xs text-slate-800">{row.devicesOnline}</p>
                      <p className="text-[11px] text-slate-500">{row.deviceHint}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-600">
                      오늘 {row.lastSignalAt}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-700">
                      {row.activeAlerts.length === 0 ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <ul className="space-y-1">
                          {row.activeAlerts.slice(0, 2).map((a) => (
                            <li key={a} className="flex gap-1">
                              <span className="text-rose-500" aria-hidden>
                                •
                              </span>
                              <span>{a}</span>
                            </li>
                          ))}
                          {row.activeAlerts.length > 2 ? (
                            <li className="text-slate-400">외 {row.activeAlerts.length - 2}건</li>
                          ) : null}
                        </ul>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <span
                        className={[
                          "inline-flex rounded-md px-2 py-0.5 font-medium",
                          row.status === "이용중"
                            ? "bg-emerald-50 text-emerald-900"
                            : row.status === "주의"
                              ? "bg-amber-50 text-amber-900"
                              : "bg-slate-100 text-slate-700",
                        ].join(" ")}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-700">{row.caseManager}</td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        to={`/subjects/${row.id}`}
                        className="inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        상세
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ul className="divide-y divide-slate-100 md:hidden" aria-label="대상자 카드 목록">
          {rows.length === 0 ? (
            <li className="py-10 text-center text-sm text-slate-500">조건에 맞는 대상자가 없습니다.</li>
          ) : (
            rows.map((row) => (
              <li key={row.id} className="py-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={[
                        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold",
                        riskBadgeClasses(row.riskLevel),
                      ].join(" ")}
                    >
                      {RISK_LABEL[row.riskLevel]}
                    </span>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {row.name}{" "}
                      <span className="text-sm font-normal text-slate-500">({row.age}세)</span>
                    </p>
                    <p className="text-xs text-slate-600">{row.district} · {row.primaryService}</p>
                    <p className="mt-1 text-xs text-slate-500">{row.riskSummary}</p>
                  </div>
                  <Link
                    to={`/subjects/${row.id}`}
                    className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                  >
                    상세
                  </Link>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <p>
                    기기 <span className="font-mono text-slate-800">{row.devicesOnline}</span>
                  </p>
                  <p>신호 오늘 {row.lastSignalAt}</p>
                  <p className="col-span-2">담당 {row.caseManager}</p>
                </div>
                {row.activeAlerts.length > 0 ? (
                  <ul className="mt-2 space-y-0.5 text-[11px] text-rose-800">
                    {row.activeAlerts.map((a) => (
                      <li key={a}>· {a}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
