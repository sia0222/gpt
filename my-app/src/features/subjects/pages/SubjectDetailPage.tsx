import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/features/admin-shell";
import { SubjectDetailTabs } from "@/features/subjects/components/SubjectDetailTabs";
import { getSubjectDetailMock } from "@/features/subjects/services/subjectWorkspaceMock";
import { RISK_LABEL, riskBadgeClasses } from "@/features/subjects/utils/subjectRiskUi";

export function SubjectDetailPage() {
  const { subjectId = "" } = useParams();
  const subject = getSubjectDetailMock(subjectId);

  if (!subject) {
    return (
      <div className="mx-auto max-w-[960px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-bold text-slate-900">대상자를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-slate-600">목록에서 다시 선택해 주세요.</p>
        <Link
          to="/subjects"
          className="mt-4 inline-block rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          목록으로 이동
        </Link>
      </div>
    );
  }

  const urgentTone =
    subject.riskLevel === "critical" || subject.riskLevel === "high";

  const headerAppendix =
    subject.activeAlerts.length > 0 || subject.alertTimeline.length > 0 ? (
      <>
        {subject.activeAlerts.length > 0 ? (
          <div
            className={[
              "rounded-xl border p-3 sm:p-4",
              urgentTone ? "border-rose-200 bg-rose-50/80" : "border-amber-200 bg-amber-50/60",
            ].join(" ")}
            role="region"
            aria-label="활성 알림"
          >
            <p className="text-xs font-semibold text-slate-900">활성 알림 · 이슈</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-800">
              {subject.activeAlerts.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="text-rose-500" aria-hidden>
                    !
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {subject.alertTimeline.length > 0 ? (
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4">
            <p className="text-xs font-semibold text-slate-900">오늘 요약 타임라인</p>
            <ol className="mt-3 space-y-2 border-l-2 border-slate-200 pl-4">
              {subject.alertTimeline.slice(0, 5).map((ev) => (
                <li key={`${ev.time}-${ev.message}`} className="relative text-sm">
                  <span
                    className={[
                      "absolute -left-[calc(0.5rem+2px)] top-1.5 h-2 w-2 rounded-full",
                      ev.level === "critical"
                        ? "bg-rose-600"
                        : ev.level === "warn"
                          ? "bg-amber-500"
                          : "bg-slate-300",
                    ].join(" ")}
                    aria-hidden
                  />
                  <span className="font-mono text-xs text-slate-500">{ev.time}</span>
                  <span className="mt-0.5 block text-slate-800">{ev.message}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </>
    ) : undefined;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="운영 관리 · 대상자 상세"
        title={subject.name}
        titleSuffix={
          <>
            <span
              className={[
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold",
                riskBadgeClasses(subject.riskLevel),
              ].join(" ")}
            >
              {RISK_LABEL[subject.riskLevel]}
            </span>
            <span
              className={[
                "inline-flex rounded-md px-2 py-0.5 text-xs font-semibold",
                subject.status === "이용중"
                  ? "bg-emerald-50 text-emerald-900"
                  : subject.status === "주의"
                    ? "bg-amber-50 text-amber-900"
                    : "bg-slate-100 text-slate-700",
              ].join(" ")}
            >
              {subject.status}
            </span>
          </>
        }
        description={
          <>
            <p className="text-sm text-slate-600">
              {subject.age}세 · {subject.district} · {subject.primaryService}
            </p>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-800">{subject.riskSummary}</p>
            <p className="mt-1 text-xs text-slate-500">
              담당 <span className="!font-medium text-slate-700">{subject.caseManager}</span> · 서비스 시작{" "}
              {subject.serviceStartDate} · {subject.careGrade}
            </p>
          </>
        }
        aside={
          <div className="flex flex-wrap justify-end gap-2">
            <Link
              to="/subjects"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
            >
              목록
            </Link>
            <button
              type="button"
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              조치 등록 (UI)
            </button>
            <button
              type="button"
              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-200"
            >
              보호자 연락 (UI)
            </button>
          </div>
        }
        footer={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[11px] font-medium text-slate-500">최근 신호</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">오늘 {subject.lastSignalAt}</p>
              <p className="mt-0.5 text-xs text-slate-500">{subject.deviceHint}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[11px] font-medium text-slate-500">기기 연결</p>
              <p className="mt-1 font-mono text-lg font-bold tabular-nums text-slate-900">
                {subject.devicesOnline}
              </p>
              <p className="text-xs text-slate-500">온라인 / 전체</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[11px] font-medium text-slate-500">연락처</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{subject.phone}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{subject.address}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[11px] font-medium text-slate-500">보호자</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{subject.guardian}</p>
              <p className="mt-0.5 text-xs text-slate-500">긴급 시 연락 순서 목업</p>
            </div>
          </div>
        }
        appendix={headerAppendix}
      />

      <SubjectDetailTabs subject={subject} />
    </div>
  );
}
