import { PageHeader } from "@/features/admin-shell";

export function DocumentManagementPage() {
  return (
    <div className="space-y-4">
      <PageHeader eyebrow="OVERVIEW · 문서 관리" title="문서 관리" />
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">최신 문서</h2>
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          <li className="flex items-center justify-between py-2">
            <span>서비스 표준 운영지침_v3.pdf</span>
            <span className="text-xs text-slate-500">2026-03-24</span>
          </li>
          <li className="flex items-center justify-between py-2">
            <span>위험 알림 대응 매뉴얼.docx</span>
            <span className="text-xs text-slate-500">2026-03-22</span>
          </li>
          <li className="flex items-center justify-between py-2">
            <span>가정 센서 설치 체크리스트.xlsx</span>
            <span className="text-xs text-slate-500">2026-03-20</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
