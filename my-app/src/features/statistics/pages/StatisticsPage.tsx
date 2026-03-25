import { PageHeader } from "@/features/admin-shell";

/**
 * 통계 관리 — 파일·검수·게시 (page-composition-guide §3.5)
 */
export function StatisticsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="분석 · 통계"
        title="통계 관리"
        description="통계 파일 업로드·검수·게시 흐름을 관리합니다. (UI 목업)"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          파일 업로드 영역 (드래그·선택 UI 자리)
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">파일 목록</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>인구통계_2026Q1.xlsx — 검수 완료 · 게시중</li>
            <li>건강지표_202603.xlsx — 검수 대기</li>
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            버전·게시 기간·반려 사유 등 폼은 API 연동 시 추가
          </p>
        </section>
      </div>
    </div>
  );
}
