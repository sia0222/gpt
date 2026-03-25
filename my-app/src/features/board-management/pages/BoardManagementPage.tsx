import { PageHeader } from "@/features/admin-shell";

export function BoardManagementPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="포털 · 게시판"
        title="게시판"
        description="공지·FAQ 등 게시 영역의 등록·승인·예약 게시 현황을 한곳에서 봅니다. (목업)"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">공지사항</h2>
          <p className="mt-2 text-sm text-slate-600">
            등록 32건 · 예약 게시 4건 · 미승인 2건
          </p>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">FAQ/자료실</h2>
          <p className="mt-2 text-sm text-slate-600">
            FAQ 58건 · 자료실 21건 · 최근 업데이트 2026-03-25
          </p>
        </section>
      </div>
    </div>
  );
}
