import { PageHeader } from "@/features/admin-shell";

export function MemberManagementPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="운영 관리 · 회원"
        title="회원 관리"
        description="운영자·직원 계정을 조회하고 권한·소속·상태를 관리합니다. (목업 데이터)"
      />
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">운영자 계정 목록</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="py-2">이름</th>
              <th className="py-2">권한</th>
              <th className="py-2">소속</th>
              <th className="py-2 text-right">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="py-2">김운영</td>
              <td className="py-2">SUPER_ADMIN</td>
              <td className="py-2">중앙센터</td>
              <td className="py-2 text-right">활성</td>
            </tr>
            <tr>
              <td className="py-2">박간호</td>
              <td className="py-2">STAFF</td>
              <td className="py-2">남구지소</td>
              <td className="py-2 text-right">활성</td>
            </tr>
            <tr>
              <td className="py-2">이상담</td>
              <td className="py-2">REVIEWER</td>
              <td className="py-2">북구지소</td>
              <td className="py-2 text-right">잠금</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
