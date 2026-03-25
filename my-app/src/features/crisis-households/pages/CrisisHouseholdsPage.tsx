import { PageHeader } from "@/features/admin-shell";
import { CRISIS_HOUSEHOLDS } from "@/features/shared";

export function CrisisHouseholdsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="운영 관리 · 위기가구"
        title="위기가구"
        description="권역별 가구 수와 고위험 가구 비중을 모니터링합니다. (목업)"
      />
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">권역별 현황</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="py-2">권역</th>
              <th className="py-2">총 가구</th>
              <th className="py-2 text-right">고위험</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {CRISIS_HOUSEHOLDS.map((row) => (
              <tr key={row.district}>
                <td className="py-2">{row.district}</td>
                <td className="py-2">{row.count}</td>
                <td className="py-2 text-right text-rose-700">{row.highRisk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
