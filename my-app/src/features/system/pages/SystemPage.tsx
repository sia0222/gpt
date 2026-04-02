import { PageHeader } from "@/features/admin-shell";

/**
 * 시스템 관리 — 계정·공통코드 (IA 요지, UI만)
 */
export function SystemPage() {
  return (
    <div className="space-y-4">
      <PageHeader eyebrow="OVERVIEW · 시스템 관리" title="시스템 관리" />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">관리자 계정</h2>
          <p className="mt-2 text-sm text-slate-600">
            계정 목록·권한 부여·잠금 UI 자리 (목업)
          </p>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">공통 코드</h2>
          <p className="mt-2 text-sm text-slate-600">
            그룹/상세 코드·정렬·사용여부 관리 UI 자리
          </p>
        </section>
      </div>
    </div>
  );
}
