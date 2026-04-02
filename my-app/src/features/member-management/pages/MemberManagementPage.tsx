import { useState } from "react";
import { PageHeader, PageHeaderAction, PlusIcon, ManagementKpiRow } from "@/features/admin-shell";

export function MemberManagementPage() {
  const [filter, setFilter] = useState<"all" | "활성" | "잠금">("all");
  const members = [
    { id: 1, name: "김운영", role: "SUPER_ADMIN", org: "중앙센터", status: "활성" },
    { id: 2, name: "박간호", role: "STAFF", org: "남구지소", status: "활성" },
    { id: 3, name: "이상담", role: "REVIEWER", org: "북구지소", status: "잠금" },
  ];

  const filteredMembers = members.filter(m => filter === "all" || m.status === filter);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader
        eyebrow="OVERVIEW · 회원 관리"
        title="운영진 계정 관리"
        aside={
          <PageHeaderAction onClick={() => alert("신규 계정 등록")}>
            <PlusIcon />
            등록
          </PageHeaderAction>
        }
      />

      <section aria-label="운영진 현황 지표">
        <ManagementKpiRow items={[
          { id: "mem-total", label: "전체 운영진", value: members.length.toString(), color: "zinc", icon: "people", sparkline: [10, 12, 11, 14, 15, 16, members.length], delta: "+2 (분기)" },
          { id: "mem-active", label: "활성 세션", value: "2", color: "emerald", icon: "monitor", sentiment: "positive", sparkline: [1, 2, 1, 3, 2, 4, 2], delta: "ONLINE" },
          { id: "mem-lock", label: "잠금/제한 계정", value: members.filter(m => m.status !== "활성").length.toString(), color: "rose", icon: "alert", sentiment: "negative", sparkline: [0, 1, 0, 1, 0, 2, 1], delta: "+1 (금일)" },
          { id: "mem-action", label: "주간 권한 변경", value: "8", color: "blue", icon: "bell", sentiment: "neutral", sparkline: [2, 5, 3, 6, 4, 7, 5], delta: "정기점검" }
        ]} />
      </section>

      <section className="rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-zinc-900">운영자 계정 목록</h2>
          <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner border border-zinc-200/50 shrink-0 w-max">
            {(
              [["all", "전체"], ["활성", "활성"], ["잠금", "잠금"]] as const
            ).map(([key, label]) => (
              <button
                key={key} onClick={() => setFilter(key as any)}
                className={[
                  "rounded-lg px-4 py-1.5 text-[12px] font-extrabold tracking-wide transition-all whitespace-nowrap",
                  filter === key ? "bg-white text-zinc-900 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800",
                ].join(" ")}
              >{label}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-zinc-50/30 text-[12px] font-extrabold text-zinc-500 uppercase tracking-widest border-b border-zinc-100">
              <tr>
                <th className="px-6 py-3">이름</th>
                <th className="px-6 py-3">권한</th>
                <th className="px-6 py-3">소속</th>
                <th className="px-6 py-3 text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50/80 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-bold text-[15px] text-zinc-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{m.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-[12px] font-bold text-zinc-600 ring-1 ring-zinc-200 uppercase">{m.role}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 font-medium">{m.org}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={[
                      "inline-flex rounded-md px-2 py-0.5 text-[12px] font-bold uppercase ring-1",
                      m.status === "활성" ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-rose-50 text-rose-800 ring-rose-200"
                    ].join(" ")}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
