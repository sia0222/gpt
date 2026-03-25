import { PageHeader } from "@/features/admin-shell";

export function PolicyManagementPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="포털 · 정책"
        title="정책"
        description="개인정보 처리방침·이용약관 등 버전과 적용 일자를 관리합니다. (목업)"
      />
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">정책/약관 버전</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>개인정보 처리방침 v2.1 · 2026-03-01 적용</li>
          <li>서비스 이용약관 v4.0 · 2026-02-15 적용</li>
          <li>응급 대응 고지 v1.4 · 2026-01-20 적용</li>
        </ul>
      </section>
    </div>
  );
}
