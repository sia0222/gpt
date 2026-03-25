import { PageHeader } from "@/features/admin-shell";

/**
 * 운영 관리 — 알림·작업 이력 (IA 요지, UI만)
 */
export function OperationsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="운영 센터"
        title="운영 관리"
        description="알림 규칙·수신 대상·작업 이력을 통합해 봅니다. (목업)"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">알림 관리</h2>
          <p className="mt-2 text-sm text-slate-600">
            규칙·수신 대상·처리 상태 테이블 UI 자리 (목업)
          </p>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">작업 이력</h2>
          <p className="mt-2 text-sm text-slate-600">
            등록/수정/삭제/승인 로그 — 필터·내보내기 UI 자리
          </p>
        </section>
      </div>
    </div>
  );
}
