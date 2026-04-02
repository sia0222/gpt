import { useState } from "react";
import { PageHeader, PageHeaderAction, PlusIcon, ManagementKpiRow } from "@/features/admin-shell";

// ?�?�?�?� MOCK DATA ?�?�?�?�
interface AdminAccount {
  id: string;
  name: string;
  role: "super" | "operator" | "viewer";
  lastLogin: string;
  status: "active" | "locked" | "pending";
}

interface CommonCode {
  group: string;
  code: string;
  value: string;
  sort: number;
  isUsed: boolean;
}

const INITIAL_ACCOUNTS: AdminAccount[] = [
  { id: "adm_001", name: "최고관리자", role: "super", lastLogin: "2026-04-02 09:12", status: "active" },
  { id: "adm_002", name: "김?�영", role: "operator", lastLogin: "2026-04-01 18:45", status: "active" },
  { id: "adm_003", name: "?��???, role: "viewer", lastLogin: "2026-03-20 11:20", status: "locked" },
  { id: "adm_004", name: "박승??, role: "operator", lastLogin: "N/A", status: "pending" },
];

const INITIAL_CODES: CommonCode[] = [
  { group: "RISK_LEVEL", code: "L1", value: "긴급 (Rose)", sort: 1, isUsed: true },
  { group: "RISK_LEVEL", code: "L2", value: "주의 (Amber)", sort: 2, isUsed: true },
  { group: "FACILITY_CAT", code: "F01", value: "보건/?�료", sort: 1, isUsed: true },
  { group: "FACILITY_CAT", code: "F02", value: "?�인복�?", sort: 2, isUsed: true },
];

export function SystemPage() {
  const [statusFilter, setStatusFilter] = useState<AdminAccount["status"] | "all">("all");
  const [accounts] = useState<AdminAccount[]>(INITIAL_ACCOUNTS);
  const [codes] = useState<CommonCode[]>(INITIAL_CODES);

  const filteredAccounts = accounts.filter(a => statusFilter === "all" || a.status === statusFilter);

  const ROLE_MAP = {
    super: { label: "최고권한", style: "bg-zinc-900 text-white" },
    operator: { label: "?�영?�당", style: "bg-blue-50 text-blue-700 border-blue-200" },
    viewer: { label: "?�순조회", style: "bg-zinc-100 text-zinc-500 border-zinc-200" },
  };

  const STATUS_MAP = {
    active: { label: "?�영�?, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    locked: { label: "?�금??, color: "text-rose-600 bg-rose-50 border-rose-100" },
    pending: { label: "?�인?��?, color: "text-amber-600 bg-amber-50 border-amber-100" },
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <PageHeader 
        eyebrow="OVERVIEW · ?�스???�경 ?�정" 
        title="?�스??�?계정 관�? 
        aside={
          <PageHeaderAction onClick={() => alert("?�규 관리자 계정 ?�성 모달???�출?�니??")}>
            <PlusIcon />
            ?�규 관리자 계정 ?�성
          </PageHeaderAction>
        }
      />

      <section aria-label="?�스???�영 ?�태 지??>
        <ManagementKpiRow items={[
          { id: "sys-status", label: "?�스??가???�태", value: "99.9%", color: "emerald", icon: "monitor", sentiment: "positive", sparkline: [98, 99, 99.5, 99.8, 99.9, 100, 99.9], delta: "HEALTHY" },
          { id: "sys-api", label: "API ?�답 (Avg)", value: "142ms", color: "blue", icon: "people", sentiment: "positive", sparkline: [180, 160, 155, 150, 145, 140, 142], delta: "-12ms" },
          { id: "sys-acc", label: "관리자 ?�성 계정", value: accounts.filter(a => a.status === "active").length.toString(), color: "zinc", icon: "bell", sparkline: [4, 5, 4, 3, 5, 6, 5], delta: "+1 (금월)" },
          { id: "sys-pending", label: "?�인 ?��?건수", value: accounts.filter(a => a.status === "pending").length.toString(), color: "amber", icon: "alert", sentiment: "negative", sparkline: [0, 1, 0, 2, 1, 0, 1], delta: "+1" }
        ]} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2 flex-1 min-h-0">
        {/* === 관리자 계정 관�?=== */}
        <section className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <h3 className="text-[13px] font-extrabold text-zinc-900 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-zinc-900 rounded-sm"></span>
              관리자 계정 ?�벤?�리
            </h3>
            <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner border border-zinc-200/50 shrink-0 w-max">
              {(
                [["all", "?�체"], ["active", "?�영�?], ["locked", "?�금"], ["pending", "?��?]] as const
              ).map(([key, label]) => (
                <button
                  key={key} onClick={() => setStatusFilter(key as any)}
                  className={[
                    "rounded-lg px-3 py-1.5 text-[12px] font-extrabold tracking-wide transition-all whitespace-nowrap",
                    statusFilter === key ? "bg-white text-zinc-900 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800",
                  ].join(" ")}
                >{label}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
             <table className="w-full text-left text-[13px]">
               <thead className="bg-zinc-50/50 text-[12px] font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 sticky top-0 z-10">
                 <tr>
                    <th className="px-5 py-4">?�명 / 권한</th>
                    <th className="px-5 py-4">최근 ?�속 기록</th>
                    <th className="px-5 py-4 text-center">계정 ?�태</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100">
                 {filteredAccounts.map(acc => (
                   <tr key={acc.id} className="hover:bg-zinc-50/50 transition-colors group">
                     <td className="px-5 py-5">
                        <p className="text-[15px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors uppercase">{acc.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                           <span className={["px-2 py-0.5 rounded-lg text-[12px] font-extrabold border", ROLE_MAP[acc.role].style].join(" ")}>
                             {ROLE_MAP[acc.role].label}
                           </span>
                           <span className="text-[12px] font-mono font-bold text-zinc-300">{acc.id}</span>
                        </div>
                     </td>
                     <td className="px-5 py-5">
                        <p className="font-mono text-[12px] font-bold text-zinc-600">{acc.lastLogin}</p>
                     </td>
                     <td className="px-5 py-5 text-center">
                        <span className={["px-2.5 py-1 rounded-lg text-[12px] font-extrabold border shadow-sm", STATUS_MAP[acc.status].color].join(" ")}>
                           {STATUS_MAP[acc.status].label}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </section>

        {/* === 공통 코드 관�?=== */}
        <section className="flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <h3 className="text-[13px] font-extrabold text-zinc-900 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm shadow-sm"></span>
              마스??코드 ?�이?�베?�스
            </h3>
            <button className="text-[12px] font-extrabold text-blue-600 hover:underline">그룹코드 추�?</button>
          </div>
          <div className="flex-1 overflow-auto">
             <table className="w-full text-left text-[13px]">
               <thead className="bg-zinc-50/50 text-[12px] font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 sticky top-0 z-10">
                 <tr>
                    <th className="px-5 py-4">그룹 / ?�세 코드</th>
                    <th className="px-5 py-4">코드 명칭(Value)</th>
                    <th className="px-5 py-4 text-center">?�렬 / ?�용</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 text-zinc-600">
                  {codes.map(c => (
                    <tr key={c.code} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-5 py-4">
                         <p className="text-[12px] font-extrabold text-blue-600 mb-0.5">{c.group}</p>
                         <p className="font-mono font-black text-zinc-900">{c.code}</p>
                      </td>
                      <td className="px-5 py-4">
                         <span className="font-bold text-zinc-700">{c.value}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                         <div className="flex items-center justify-center gap-3">
                            <span className="text-[12px] font-mono font-extrabold text-zinc-400 border border-zinc-200 w-5 h-5 flex items-center justify-center rounded bg-white shadow-sm">{c.sort}</span>
                            <span className={["w-2 h-2 rounded-full", c.isUsed ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-zinc-300"].join(" ")}></span>
                         </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="px-5 py-4 text-center">
                       <button className="text-[12px] font-extrabold text-zinc-300 hover:text-zinc-500 transition-colors leading-loose">
                          + ?�위 코드 추�? (Add sub-code)
                       </button>
                    </td>
                  </tr>
               </tbody>
             </table>
          </div>
        </section>
      </div>

      {/* ?�스???��? 가?�드 ?�림 */}
      <div className="bg-zinc-900 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl shadow-zinc-900/20">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div>
               <h4 className="text-[15px] font-extrabold tracking-tight">강력??보안 ?��????�역 ?�용 ?�어?�습?�다.</h4>
               <p className="text-[12px] font-bold text-zinc-400 mt-0.5">?�퍼 관리자 권한?�로�??�스???�심 코드�?변경할 ???�으�?모든 ?�정 ?�력?� 법률???�라 로깅?�니??</p>
            </div>
         </div>
         <button className="h-10 px-6 bg-white text-zinc-900 rounded-xl font-black text-[12px] hover:bg-zinc-100 transition-all active:scale-95 shadow-lg">보안 ?�책 문서 ?�인</button>
      </div>
    </div>
  );
}
