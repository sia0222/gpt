import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/features/admin-shell";
import { SubjectIntegratedProfile } from "@/features/subjects/components/SubjectIntegratedProfile";
import { SubjectDetailInfoCards } from "@/features/subjects/components/SubjectDetailInfoCards";
import { SubjectDetailTabs } from "@/features/subjects/components/SubjectDetailTabs";
import { getSubjectDetailMock } from "@/features/subjects/services/subjectWorkspaceMock";

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

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        eyebrow="OVERVIEW · 대상자 관리"
        title="통합 대상자 명부"
        backPath="/subjects"
      />

      <section className="min-w-0" aria-labelledby="subject-detail-summary-heading">
        <SubjectDetailInfoCards subject={subject} />
      </section>

      {/* ── 2컬럼 본문 영역 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* 좌측: 상세 이력 (Wider) */}
        <section className="lg:col-span-3 rounded-2xl border border-zinc-200/70 bg-white shadow-sm flex flex-col overflow-hidden" aria-labelledby="subject-history-title">
          <div className="border-b border-zinc-100 bg-zinc-50/50 p-5 shrink-0">
            <h2 id="subject-history-title" className="text-[15px] font-bold text-zinc-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              상세 이력
            </h2>
            <p className="text-[12px] text-zinc-500 mt-1 pl-6">디바이스 관제, 상담, 서비스 및 헬스케어 리포트 통합 이력입니다.</p>
          </div>
          <SubjectDetailTabs subject={subject} />
        </section>

        {/* 우측: AI 분석 결과 (Narrower) */}
        <div className="lg:col-span-1">
          <SubjectIntegratedProfile subject={subject} />
        </div>
      </div>
    </div>
  );
}
