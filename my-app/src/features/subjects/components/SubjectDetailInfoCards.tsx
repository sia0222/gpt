import { useId, useState, type ReactNode } from "react";
import type { SubjectDetailView } from "@/features/subjects/services/subjectWorkspaceMock";
import { RISK_LABEL, riskBadgeClasses } from "@/features/subjects/utils/subjectRiskUi";

interface SubjectDetailInfoCardsProps {
  readonly subject: SubjectDetailView;
}

const THEAD_ROW =
  "border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-extrabold uppercase tracking-widest text-zinc-500";
const THEAD_TH = "px-6 py-4 text-left";
const DATA_TD = "px-6 py-4 text-[13px] font-semibold text-zinc-900";

function HorizontalDetailTable({
  caption,
  headers,
  cells,
}: {
  readonly caption: string;
  readonly headers: readonly string[];
  readonly cells: readonly ReactNode[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
      <table className="w-full min-w-[520px] border-collapse text-left caption-bottom">
        <caption className="sr-only">{caption}</caption>
        <thead className={THEAD_ROW}>
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className={`${THEAD_TH} whitespace-nowrap`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          <tr>
            {cells.map((cell, i) => (
              <td key={i} className={`${DATA_TD} whitespace-nowrap`}>
                {cell}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const DETAIL_TABS = [
  { id: "basic" as const, label: "기본정보" },
  { id: "guardian" as const, label: "보호자" },
  { id: "type" as const, label: "대상자 유형" },
  { id: "case" as const, label: "사례 관리" },
];

type DetailTabId = (typeof DETAIL_TABS)[number]["id"];

/**
 * 상단 요약 한 줄 + 기본/보호자/유형/사례 탭, 탭마다 가로 1행 테이블.
 */
export function SubjectDetailInfoCards({ subject }: SubjectDetailInfoCardsProps) {
  const baseId = useId();
  const [active, setActive] = useState<DetailTabId>("basic");

  return (
    <article className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
          <h2
            id="subject-detail-summary-heading"
            className="text-[22px] font-bold leading-none tracking-tight text-zinc-900 sm:text-[26px]"
          >
            {subject.name}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset",
                riskBadgeClasses(subject.riskLevel),
              ].join(" ")}
            >
              {RISK_LABEL[subject.riskLevel]}
            </span>
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset",
                subject.status === "이용중"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200/50"
                  : "bg-zinc-50 text-zinc-600 ring-zinc-200",
              ].join(" ")}
            >
              {subject.status}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          수정
        </button>
      </div>

      <div
        className="mt-5 flex flex-wrap gap-1 border-b border-zinc-200"
        role="tablist"
        aria-label="대상자 상세 정보 구분"
      >
        {DETAIL_TABS.map((tab) => {
          const isOn = tab.id === active;
          const tabId = `${baseId}-tab-${tab.id}`;
          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isOn}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isOn ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={[
                "-mb-px border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                isOn
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-zinc-500 hover:text-zinc-800",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 min-w-0">
        <div
          id={`${baseId}-panel-basic`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-basic`}
          hidden={active !== "basic"}
        >
          <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
            <table className="w-full min-w-[720px] border-collapse text-left caption-bottom">
              <caption className="sr-only">대상자 기본 정보 한 줄 요약</caption>
              <thead className={THEAD_ROW}>
                <tr>
                  <th scope="col" className={`${THEAD_TH} whitespace-nowrap`}>
                    읍면동
                  </th>
                  <th scope="col" className={`${THEAD_TH} whitespace-nowrap`}>
                    생년월일
                  </th>
                  <th scope="col" className={`${THEAD_TH} min-w-[200px]`}>
                    주소
                  </th>
                  <th scope="col" className={`${THEAD_TH} whitespace-nowrap`}>
                    집번호
                  </th>
                  <th scope="col" className={`${THEAD_TH} whitespace-nowrap`}>
                    핸드폰번호
                  </th>
                  <th scope="col" className={`${THEAD_TH} whitespace-nowrap`}>
                    가구원수
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                <tr>
                  <td className={`${DATA_TD} whitespace-nowrap`}>{subject.district}</td>
                  <td className={`${DATA_TD} whitespace-nowrap`}>{subject.birthDate}</td>
                  <td className={`${DATA_TD} max-w-[10rem] sm:max-w-[14rem]`} title={subject.address}>
                    <span className="block truncate">{subject.address}</span>
                  </td>
                  <td className={`${DATA_TD} whitespace-nowrap`}>{subject.homePhone}</td>
                  <td className={`${DATA_TD} whitespace-nowrap text-blue-600`}>{subject.phone}</td>
                  <td className={`${DATA_TD} whitespace-nowrap`}>{subject.householdSize}명</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          id={`${baseId}-panel-guardian`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-guardian`}
          hidden={active !== "guardian"}
        >
          <HorizontalDetailTable
            caption="보호자 정보"
            headers={["보호자 성명", "보호자 연락처", "관계"]}
            cells={[subject.guardianName, <span className="text-blue-600">{subject.guardianPhone}</span>, subject.guardianRelation]}
          />
        </div>

        <div
          id={`${baseId}-panel-type`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-type`}
          hidden={active !== "type"}
        >
          <HorizontalDetailTable
            caption="대상자 유형"
            headers={["장애등급", "급성기요양 퇴원(예정)", "생애말기환자"]}
            cells={[
              subject.disabilityGrade,
              <span
                className={subject.dischargeScheduled !== "해당없음" ? "text-amber-800" : "text-zinc-500"}
              >
                {subject.dischargeScheduled}
              </span>,
              <span className={subject.isEndOfLife ? "text-rose-800" : "text-zinc-500"}>
                {subject.isEndOfLife ? "대상자" : "미해당"}
              </span>,
            ]}
          />
        </div>

        <div
          id={`${baseId}-panel-case`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-case`}
          hidden={active !== "case"}
        >
          <HorizontalDetailTable
            caption="사례 관리"
            headers={["담당자명", "종결여부"]}
            cells={[
              subject.caseManager,
              subject.isClosed ? (
                <span className="inline-block rounded-md bg-zinc-200/90 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                  종결됨
                </span>
              ) : (
                <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                  진행중
                </span>
              ),
            ]}
          />
        </div>
      </div>
    </article>
  );
}
