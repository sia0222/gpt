import { useId, useState, type ReactNode } from "react";
import type { SubjectDetailView } from "@/features/subjects/services/subjectWorkspaceMock";
import { RISK_LABEL, riskBadgeClasses } from "@/features/subjects/utils/subjectRiskUi";

interface SubjectDetailInfoCardsProps {
  readonly subject: SubjectDetailView;
}

const DETAIL_TABS = [
  { id: "basic" as const,    label: "기본정보" },
  { id: "guardian" as const, label: "보호자" },
  { id: "type" as const,     label: "대상자 유형" },
  { id: "case" as const,     label: "사례 관리" },
] as const;

type DetailTabId = (typeof DETAIL_TABS)[number]["id"];

// ── 공통 스타일 상수 ───────────────────────────────────────────
const TH = "px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400 whitespace-nowrap";
const TD = "px-5 py-3.5 text-[13px] font-semibold text-zinc-900 whitespace-nowrap";

// ── 전화번호 셀 ───────────────────────────────────────────────
function Tel({ value }: { readonly value: string }) {
  if (!value || value === "—") {
    return <span className="text-zinc-400">—</span>;
  }
  return (
    <a
      href={`tel:${value}`}
      className="text-blue-600 transition-colors hover:text-blue-700 hover:underline"
    >
      {value}
    </a>
  );
}

// ── 테이블 ────────────────────────────────────────────────────
function InfoTable({
  caption,
  headers,
  cells,
  minWidth = "520px",
}: {
  readonly caption: string;
  readonly headers: readonly string[];
  readonly cells: readonly ReactNode[];
  readonly minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200/70">
      <table className="w-full border-collapse text-left caption-bottom" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50">
            {headers.map((h) => (
              <th key={h} scope="col" className={TH}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white transition-colors hover:bg-zinc-50/60">
            {cells.map((cell, i) => (
              <td key={i} className={TD}>
                {cell}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────
export function SubjectDetailInfoCards({ subject }: SubjectDetailInfoCardsProps) {
  const baseId = useId();
  const [active, setActive] = useState<DetailTabId>("basic");

  return (
    <article
      className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm"
      aria-labelledby="subject-detail-summary-heading"
    >
      {/* ── 헤더 ── */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-zinc-100 bg-zinc-50/50 px-5 py-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1.5">
          <h2
            id="subject-detail-summary-heading"
            className="text-[22px] font-bold leading-none tracking-tight text-zinc-900"
          >
            {subject.name}
          </h2>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset",
                riskBadgeClasses(subject.riskLevel),
              ].join(" ")}
            >
              {RISK_LABEL[subject.riskLevel]}
            </span>
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
                subject.status === "이용중"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200/60"
                  : "bg-zinc-100 text-zinc-500 ring-zinc-200",
              ].join(" ")}
            >
              {subject.status}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          수정
        </button>
      </div>

      {/* ── 탭 목록 ── */}
      <div
        className="flex border-b border-zinc-200 px-5"
        role="tablist"
        aria-label="대상자 상세 정보 구분"
      >
        {DETAIL_TABS.map((tab) => {
          const isOn = tab.id === active;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
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

      {/* ── 탭 패널 ── */}
      <div className="p-4">
        {/* 기본정보 */}
        <div
          id={`${baseId}-panel-basic`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-basic`}
          hidden={active !== "basic"}
        >
          <InfoTable
            caption="대상자 기본 정보"
            minWidth="700px"
            headers={["읍면동", "생년월일", "주소", "집번호", "핸드폰번호", "가구원수"]}
            cells={[
              subject.district,
              subject.birthDate,
              <span
                key="addr"
                className="block max-w-[12rem] truncate sm:max-w-[14rem]"
                title={subject.address}
              >
                {subject.address}
              </span>,
              <Tel key="home" value={subject.homePhone} />,
              <Tel key="phone" value={subject.phone} />,
              `${subject.householdSize}명`,
            ]}
          />
        </div>

        {/* 보호자 */}
        <div
          id={`${baseId}-panel-guardian`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-guardian`}
          hidden={active !== "guardian"}
        >
          <InfoTable
            caption="보호자 정보"
            headers={["보호자 성명", "보호자 연락처", "관계"]}
            cells={[
              subject.guardianName,
              <Tel key="gphone" value={subject.guardianPhone} />,
              subject.guardianRelation,
            ]}
          />
        </div>

        {/* 대상자 유형 */}
        <div
          id={`${baseId}-panel-type`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-type`}
          hidden={active !== "type"}
        >
          <InfoTable
            caption="대상자 유형"
            headers={["장애등급", "급성기요양 퇴원(예정)", "생애말기환자"]}
            cells={[
              subject.disabilityGrade,
              <span
                key="discharge"
                className={
                  subject.dischargeScheduled !== "해당없음" ? "text-amber-700" : "text-zinc-400"
                }
              >
                {subject.dischargeScheduled}
              </span>,
              <span key="eol" className={subject.isEndOfLife ? "text-rose-700" : "text-zinc-400"}>
                {subject.isEndOfLife ? "대상자" : "미해당"}
              </span>,
            ]}
          />
        </div>

        {/* 사례 관리 */}
        <div
          id={`${baseId}-panel-case`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-case`}
          hidden={active !== "case"}
        >
          <InfoTable
            caption="사례 관리"
            headers={["담당자명", "종결여부"]}
            cells={[
              subject.caseManager,
              subject.isClosed ? (
                <span
                  key="closed"
                  className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-500"
                >
                  종결됨
                </span>
              ) : (
                <span
                  key="open"
                  className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
                >
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
