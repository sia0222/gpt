import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/features/admin-shell";
import { SubjectIntegratedProfile } from "@/features/subjects/components/SubjectIntegratedProfile";
import { SubjectDetailTabs } from "@/features/subjects/components/SubjectDetailTabs";
import { getSubjectDetailMock } from "@/features/subjects/services/subjectWorkspaceMock";
import { RISK_LABEL, riskBadgeClasses } from "@/features/subjects/utils/subjectRiskUi";

export function SubjectDetailPage() {
  const { subjectId = "" } = useParams();
  const subject = getSubjectDetailMock(subjectId);

  if (!subject) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-bold text-zinc-900">대상자를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-zinc-500">목록에서 다시 선택해 주세요.</p>
        <Link
          to="/subjects"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-zinc-800 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-zinc-700 active:scale-[0.98]"
        >
          목록으로 이동
        </Link>
      </div>
    );
  }

  const urgentTone = subject.riskLevel === "critical" || subject.riskLevel === "high";

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* ── 긴급 알림 배너 ── */}
      {subject.activeAlerts.length > 0 && (
        <div
          className={[
            "flex items-start gap-4 rounded-xl border p-4 shadow-sm",
            urgentTone ? "border-rose-300 bg-rose-50" : "border-amber-300 bg-amber-50",
          ].join(" ")}
          role="region"
          aria-label="활성 알림"
        >
          <div className={["flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold text-white shadow-inner", urgentTone ? "bg-rose-500" : "bg-amber-500"].join(" ")}>
            !
          </div>
          <div className="flex-1">
            <h3 className={["text-[14px] font-bold tracking-wide", urgentTone ? "text-rose-900" : "text-amber-900"].join(" ")}>
              대상자 활성 알림 및 이슈
            </h3>
            <ul className={["mt-1.5 space-y-1 text-[13px] font-medium", urgentTone ? "text-rose-800" : "text-amber-800"].join(" ")}>
              {subject.activeAlerts.map((a) => (
                <li key={a} className="flex gap-2 items-center">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-current opacity-60"></span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── 간소화된 개인정보 헤더 ── */}
      <div className="rounded-2xl border border-zinc-200/70 bg-white shadow-sm p-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-extrabold text-zinc-900 tracking-tight">{subject.name}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={[
                "inline-flex rounded px-2.5 py-0.5 text-[11px] font-bold uppercase",
                riskBadgeClasses(subject.riskLevel),
              ].join(" ")}>
                {RISK_LABEL[subject.riskLevel]}
              </span>
              <span className={[
                "inline-flex rounded px-2.5 py-0.5 text-[11px] font-bold uppercase",
                subject.status === "이용중" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50" : "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200",
              ].join(" ")}>
                {subject.status}
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-[14px] font-extrabold text-zinc-700 bg-zinc-50/80 px-3 py-1.5 rounded-lg border border-zinc-100 inline-block max-w-fit">
              <span className="text-zinc-400 mr-2 font-medium tracking-wide">요약</span>
              {subject.riskSummary}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium text-zinc-600 mt-1">
              <span className="flex items-center gap-1"><span className="text-zinc-400 text-[11px] font-bold">인적:</span> {subject.gender} · {subject.age}세</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
              <span className="flex items-center gap-1"><span className="text-zinc-400 text-[11px] font-bold">연락처:</span> <span className="tabnum font-semibold text-zinc-800">{subject.phone}</span></span>
              <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
              <span className="flex items-center gap-1"><span className="text-zinc-400 text-[11px] font-bold">보호자:</span> {subject.guardian}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
              <span className="flex items-center gap-1"><span className="text-zinc-400 text-[11px] font-bold">담당자:</span> {subject.caseManager}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
              <span className="flex items-center gap-1"><span className="text-zinc-400 text-[11px] font-bold">구분:</span> {subject.careGrade} <span className="text-[11px] text-zinc-400 font-mono ml-1">({subject.serviceStartDate}~)</span></span>
            </div>
            <p className="text-[12px] text-zinc-500 mt-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              {subject.address}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end w-full lg:w-auto">
          <Link
            to="/subjects"
            className="flex h-9 w-full lg:w-auto items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 text-[12px] font-bold text-zinc-600 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900"
          >
            목록으로
          </Link>
          <button
            type="button"
            className="flex h-9 w-full lg:w-auto items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-5 text-[12px] font-bold text-blue-700 shadow-sm transition hover:bg-blue-100"
          >
            보호자 연락
          </button>
          <button
            type="button"
            className="flex h-9 w-full lg:w-auto items-center justify-center rounded-lg bg-zinc-900 px-5 text-[12px] font-bold text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98]"
          >
            신규 조치 등록
          </button>
        </div>
      </div>

      <SubjectIntegratedProfile subject={subject} />

      <section className="rounded-2xl border border-zinc-200/70 bg-white shadow-sm flex flex-col overflow-hidden" aria-labelledby="subject-extra-tabs">
        <div className="border-b border-zinc-100 bg-zinc-50/50 p-5">
          <h2 id="subject-extra-tabs" className="text-[15px] font-bold text-zinc-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            상세 이력 및 행정 정보
          </h2>
          <p className="text-[12px] text-zinc-500 mt-1 pl-6">기기 연결 상태, 과거 조치 타임라인 및 서비스 원장 내역입니다.</p>
        </div>
        <SubjectDetailTabs subject={subject} />
      </section>
    </div>
  );
}
