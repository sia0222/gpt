import { useMemo, useState } from "react";
import { PageHeader } from "@/features/admin-shell";
import {
  DUPLICATE_RISK_ANALYSIS_MOCK,
  SERVICE_AUDIT_LOG_MOCK,
  SERVICE_CATEGORY_TREE,
  SUBJECT_SERVICE_MAPPING_MOCK,
  WELFARE_SERVICES_MOCK,
  getBreadcrumbLabels,
  getCategoryById,
  getCategoryServiceCounts,
  getSelectionServiceStats,
  isCategoryInSubtree,
  type ServiceCategoryNode,
} from "@/features/service-management/services/serviceCatalogMock";

function filterCategoryTree(node: ServiceCategoryNode, q: string): ServiceCategoryNode | null {
  const s = q.trim().toLowerCase();
  if (!s) return node;
  if (node.name.toLowerCase().includes(s)) return node;
  const kids = node.children
    .map((c) => filterCategoryTree(c, q))
    .filter((x): x is ServiceCategoryNode => x !== null);
  if (kids.length === 0) return null;
  return { id: node.id, name: node.name, description: node.description, children: kids };
}

function CategoryTreeItem({
  node,
  depth,
  selectedId,
  onSelect,
  expandedIds,
  toggleExpanded,
  countMap,
}: {
  readonly node: ServiceCategoryNode;
  readonly depth: number;
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
  readonly expandedIds: ReadonlySet<string>;
  readonly toggleExpanded: (id: string) => void;
  readonly countMap: ReadonlyMap<string, number>;
}) {
  const hasChildren = node.children.length > 0;
  const expanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const svcCount = countMap.get(node.id) ?? 0;

  return (
    <li role="none">
      <div className="flex items-center gap-0.5" style={{ paddingLeft: depth * 14 }}>
        {hasChildren ? (
          <button
            type="button"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 transition"
            aria-expanded={expanded}
            onClick={() => toggleExpanded(node.id)}
          >
            <span aria-hidden>{expanded ? "▾" : "▸"}</span>
          </button>
        ) : (
          <span className="inline-block w-7 shrink-0" aria-hidden />
        )}
        <button
          type="button"
          role="treeitem"
          aria-selected={isSelected}
          className={[
            "flex min-w-0 flex-1 items-center justify-between gap-2 border border-transparent rounded-lg px-2.5 py-1.5 text-left text-[13px] font-semibold transition-all",
            isSelected ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-900" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
          ].join(" ")}
          onClick={() => onSelect(node.id)}
        >
          <span className="truncate">{node.name}</span>
          {svcCount > 0 && (
            <span
              className={[
                "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                isSelected ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-600",
              ].join(" ")}
            >
              {svcCount}
            </span>
          )}
        </button>
      </div>
      {hasChildren && expanded && (
        <ul role="group" className="mt-1 space-y-1">
          {node.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              toggleExpanded={toggleExpanded}
              countMap={countMap}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

const DEFAULT_EXPANDED = new Set<string>(["cat-welfare", "cat-child", "cat-elder", "cat-disability"]);
type TableStatusFilter = "ALL" | "ACTIVE" | "DRAFT" | "INACTIVE";
type DupFilter = "ALL" | "DUP_ONLY" | "NO_DUP";
type RightPaneTab = "services" | "mappings" | "audit";
const TIER_LARGE_OPTIONS = ["복지"] as const;

export function ServiceManagementPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(SERVICE_CATEGORY_TREE.id);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(DEFAULT_EXPANDED));
  const [categoryQuery, setCategoryQuery] = useState("");
  const [tableQuery, setTableQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TableStatusFilter>("ALL");
  const [tierLarge, setTierLarge] = useState<string>("all");
  const [tierMid, setTierMid] = useState<string>("all");
  const [tierSmall, setTierSmall] = useState<string>("all");
  const [providerOrgQ, setProviderOrgQ] = useState("");
  const [dupFilter, setDupFilter] = useState<DupFilter>("ALL");
  
  const [activeTab, setActiveTab] = useState<RightPaneTab>("services");

  const countMap = useMemo(() => getCategoryServiceCounts(SERVICE_CATEGORY_TREE, WELFARE_SERVICES_MOCK), []);
  const globalStats = useMemo(() => getSelectionServiceStats(SERVICE_CATEGORY_TREE, SERVICE_CATEGORY_TREE.id, WELFARE_SERVICES_MOCK), []);

  const displayRoot = useMemo(() => {
    if (!categoryQuery.trim()) return SERVICE_CATEGORY_TREE;
    return filterCategoryTree(SERVICE_CATEGORY_TREE, categoryQuery) ?? SERVICE_CATEGORY_TREE;
  }, [categoryQuery]);

  const breadcrumbs = useMemo(() => getBreadcrumbLabels(SERVICE_CATEGORY_TREE, selectedCategoryId), [selectedCategoryId]);
  const selectedCategory = useMemo(() => getCategoryById(SERVICE_CATEGORY_TREE, selectedCategoryId), [selectedCategoryId]);
  const selectionStats = useMemo(() => getSelectionServiceStats(SERVICE_CATEGORY_TREE, selectedCategoryId, WELFARE_SERVICES_MOCK), [selectedCategoryId]);

  const filteredServices = useMemo(() => {
    let rows = WELFARE_SERVICES_MOCK.filter((s) => isCategoryInSubtree(SERVICE_CATEGORY_TREE, selectedCategoryId, s.categoryId));
    if (statusFilter !== "ALL") rows = rows.filter((s) => s.status === statusFilter);
    if (tierLarge !== "all") rows = rows.filter((s) => s.tierLarge === tierLarge);
    if (tierMid !== "all") rows = rows.filter((s) => s.tierMid === tierMid);
    if (tierSmall !== "all") rows = rows.filter((s) => s.tierSmall === tierSmall);
    const orgQ = providerOrgQ.trim().toLowerCase();
    if (orgQ) rows = rows.filter((s) => s.providerOrg.toLowerCase().includes(orgQ));
    if (dupFilter === "DUP_ONLY") rows = rows.filter((s) => s.duplicateRisk);
    if (dupFilter === "NO_DUP") rows = rows.filter((s) => !s.duplicateRisk);
    const q = tableQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.targetGroup.toLowerCase().includes(q) || s.providerType.toLowerCase().includes(q) || s.tierSmall.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [selectedCategoryId, statusFilter, tableQuery, tierLarge, tierMid, tierSmall, providerOrgQ, dupFilter]);

  const midOptions = useMemo(() => {
    const set = new Set<string>();
    for (const s of WELFARE_SERVICES_MOCK) if (tierLarge === "all" || s.tierLarge === tierLarge) set.add(s.tierMid);
    return [...set].sort((a, b) => a.localeCompare(b, "ko"));
  }, [tierLarge]);

  const smallOptions = useMemo(() => {
    const set = new Set<string>();
    for (const s of WELFARE_SERVICES_MOCK) {
      if (tierLarge !== "all" && s.tierLarge !== tierLarge) continue;
      if (tierMid !== "all" && s.tierMid !== tierMid) continue;
      set.add(s.tierSmall);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "ko"));
  }, [tierLarge, tierMid]);

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader
        eyebrow="SERVICE MANAGEMENT"
        title="서비스 관리 및 통제"
        description={<p className="text-[13px] text-zinc-600 leading-relaxed">대·중·소 분류체계로 서비스 인벤토리를 관리하고, <strong>중복위험 (상충/유사/예산) 요소를 자동 점검</strong>하여 행정 과잉 지원을 사전에 방지합니다.</p>}
        aside={
          <button type="button" className="h-10 rounded-xl px-5 text-[13px] font-extrabold text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all outline-none flex items-center justify-center gap-2 active:scale-95">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            신규 서비스 등록
          </button>
        }
        footer={
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-2">
            <div className="rounded-xl border border-zinc-200/70 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">전체 서비스</p>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-zinc-900">{globalStats.total}</p>
            </div>
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">운영 중 (ACTIVE)</p>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-emerald-900">{globalStats.active}</p>
            </div>
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">검수 대기 (DRAFT)</p>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-amber-900">{globalStats.draft}</p>
            </div>
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-700">총 이용자 배정</p>
              <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-blue-900">{globalStats.enrolledSum.toLocaleString("ko-KR")}명</p>
            </div>
          </div>
        }
      />

      {/* Global Filter Grid */}
      <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm flex flex-col xl:flex-row xl:items-end gap-5">
        <h2 className="text-[14px] font-bold text-zinc-900 xl:w-24 shrink-0 mt-0.5 xl:mt-0 pt-2.5">검색 필터</h2>
        <div className="flex flex-wrap items-end gap-3 flex-1">
          <label className="flex flex-col gap-1.5 text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
            대분류
            <select className="min-w-[7rem] rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-[13px] text-zinc-800 font-medium focus:ring-2 outline-none h-10" value={tierLarge} onChange={(e) => { setTierLarge(e.target.value); setTierMid("all"); setTierSmall("all"); }}>
              <option value="all">전체</option>
              {TIER_LARGE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
            중분류
            <select className="min-w-[7.5rem] rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-[13px] text-zinc-800 font-medium focus:ring-2 outline-none h-10" value={tierMid} onChange={(e) => { setTierMid(e.target.value); setTierSmall("all"); }}>
              <option value="all">전체</option>
              {midOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
            소분류
            <select className="min-w-[7.5rem] rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-[13px] text-zinc-800 font-medium focus:ring-2 outline-none h-10" value={tierSmall} onChange={(e) => setTierSmall(e.target.value)}>
              <option value="all">전체</option>
              {smallOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
            제공기관
            <input type="search" value={providerOrgQ} onChange={(e) => setProviderOrgQ(e.target.value)} placeholder="기관명 입력" className="min-w-[9rem] rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-[13px] text-zinc-800 focus:bg-white focus:ring-2 outline-none h-10" autoComplete="off" />
          </label>
          <label className="flex flex-col gap-1.5 text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
            중복위험 분류 필터
            <select className="min-w-[8rem] rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-900 font-bold focus:ring-2 outline-none h-10" value={dupFilter} onChange={(e) => setDupFilter(e.target.value as DupFilter)}>
              <option value="ALL">전체 내역</option>
              <option value="DUP_ONLY">중복 및 상충 경고건</option>
              <option value="NO_DUP">정상 (경고없음)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        {/* === Left Sidebar: Taxonomy Tree === */}
        <aside className="xl:sticky xl:top-[120px] xl:h-[calc(100vh-140px)] flex flex-col rounded-2xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden" aria-label="서비스 분류">
          <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-bold text-zinc-900">분류 체계 트리</h2>
              <button type="button" className="rounded border border-zinc-200 bg-white px-2 py-1 text-[10px] font-bold text-zinc-600 shadow-sm hover:bg-zinc-50">+ 분류 추가</button>
            </div>
            <div className="relative">
              <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search" value={categoryQuery} onChange={(e) => setCategoryQuery(e.target.value)} placeholder="분류명 검색"
                className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 py-2 text-[12px] font-medium text-zinc-800 focus:ring-2 outline-none shadow-sm" autoComplete="off"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-50/30">
            <ul role="tree" aria-label="복지 서비스 분류 트리" className="space-y-1">
              <CategoryTreeItem node={displayRoot} depth={0} selectedId={selectedCategoryId} onSelect={setSelectedCategoryId} expandedIds={expandedIds} toggleExpanded={toggleExpanded} countMap={countMap} />
            </ul>
          </div>
        </aside>

        {/* === Right Content === */}
        <div className="flex flex-col gap-6 min-w-0">
          
          {/* Top Info Grid (Always visible summary info) */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
            <div className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm">
              <nav className="text-[12px] font-medium text-zinc-500 flex flex-wrap gap-2 items-center" aria-label="선택된 분류 경로">
                {breadcrumbs.map((label, i) => (
                  <span key={`${label}-${i}`} className="flex items-center gap-2">
                    <span className="bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200/50 font-bold text-zinc-700">{label}</span>
                    {i < breadcrumbs.length - 1 && <span className="text-zinc-300">/</span>}
                  </span>
                ))}
              </nav>
              {selectedCategory?.description && <p className="mt-4 text-[13px] leading-relaxed text-zinc-600 bg-zinc-50 p-3 rounded-lg border border-zinc-100">{selectedCategory.description}</p>}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded bg-zinc-100 px-2 py-1 text-[11px] font-bold text-zinc-700 uppercase">분류 내 서비스 {selectionStats.total}건</span>
                <span className="rounded bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-800 uppercase">운영 {selectionStats.active}</span>
                <span className="rounded bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-900 uppercase">작성중 {selectionStats.draft}</span>
              </div>
            </div>

            <section className="rounded-2xl border border-rose-200/70 bg-gradient-to-r from-rose-50/50 to-white p-6 shadow-sm flex flex-col h-full h-max-[200px]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-[14px] font-bold text-zinc-900 flex items-center gap-2 mb-1">
                    <span className="flex items-center justify-center w-5 h-5 bg-rose-100 rounded-full text-rose-600"><svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" /></svg></span>
                    중복위험 룰 엔진 현황
                  </h2>
                  <p className="text-[11px] text-zinc-500 mb-3 ml-7 font-medium uppercase tracking-wider">이용 대상자 상충 요건 탐지</p>
                </div>
                {/* Moved "중복 규칙 관리" into the precise contextual header */}
                <button type="button" className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-50 shadow-sm transition-all focus:ring-2 focus:ring-rose-200 outline-none flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  규칙 엔진 관리
                </button>
              </div>
              <ul className="flex-1 space-y-2 overflow-y-auto pr-2">
                {DUPLICATE_RISK_ANALYSIS_MOCK.map((row) => (
                  <li key={row.id} className="rounded-xl border border-zinc-100 bg-white shadow-sm px-3 py-2.5 flex items-center gap-3">
                    <span className={[
                      "shrink-0 rounded px-2 py-0.5 text-[10px] font-extrabold uppercase border",
                      row.level === "차단" ? "bg-rose-50 text-rose-700 border-rose-200" : row.level === "경고" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-zinc-100 text-zinc-700 border-zinc-200"
                    ].join(" ")}>{row.level}</span>
                    <p className="font-bold text-[12px] text-zinc-800 truncate">{row.category} <span className="font-medium text-[11px] text-zinc-500 ml-1">- {row.detail}</span></p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sub Navigation Tabs for heavy content */}
          <div className="flex gap-4 border-b border-zinc-200 mt-2 px-1">
            <button
               onClick={() => setActiveTab("services")}
               className={["relative px-2 py-3 text-[14px] font-extrabold transition-all", activeTab === "services" ? "text-blue-700" : "text-zinc-500 hover:text-zinc-800"].join(" ")}
            >
               분류 내 서비스 인벤토리 ({filteredServices.length})
               {activeTab === "services" && <div className="absolute bottom-[-1.5px] left-0 right-0 h-[3px] bg-blue-600 rounded-t-lg" />}
            </button>
            <button
               onClick={() => setActiveTab("mappings")}
               className={["relative px-2 py-3 text-[14px] font-extrabold transition-all", activeTab === "mappings" ? "text-blue-700" : "text-zinc-500 hover:text-zinc-800"].join(" ")}
            >
               대상자 연계 매핑 현황 ({SUBJECT_SERVICE_MAPPING_MOCK.length})
               {activeTab === "mappings" && <div className="absolute bottom-[-1.5px] left-0 right-0 h-[3px] bg-blue-600 rounded-t-lg" />}
            </button>
            <button
               onClick={() => setActiveTab("audit")}
               className={["relative px-2 py-3 text-[14px] font-extrabold transition-all", activeTab === "audit" ? "text-blue-700" : "text-zinc-500 hover:text-zinc-800"].join(" ")}
            >
               시스템 정책 및 감사 이력
               {activeTab === "audit" && <div className="absolute bottom-[-1.5px] left-0 right-0 h-[3px] bg-blue-600 rounded-t-lg" />}
            </button>
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-zinc-200/70 shadow-sm w-full">
            {/* TAB 1: SERVICE INVENTORY */}
            {activeTab === "services" && (
              <section className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col gap-4 border-b border-zinc-100 bg-zinc-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-[15px] font-bold text-zinc-900">제공 서비스 통합 인벤토리</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Moved "종료 처리" into the table toolbar where bulk/table actions belong */}
                    <button type="button" className="rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-[12px] font-bold text-zinc-700 hover:bg-zinc-100 shadow-sm transition-all focus:ring-2 outline-none flex items-center justify-center gap-1.5 h-9 whitespace-nowrap shrink-0">
                      <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      선택 종료 처리
                    </button>
                    <div className="w-px h-6 bg-zinc-300 self-center hidden sm:block"></div>
                    <div className="relative flex-1 min-w-[180px]">
                      <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input type="search" value={tableQuery} onChange={(e) => setTableQuery(e.target.value)} placeholder="검색어 입력..." className="w-full h-9 rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-[12px] font-medium text-zinc-800 shadow-sm focus:ring-2 outline-none" />
                    </div>
          <div className="flex bg-zinc-200/50 p-1 rounded-xl shadow-inner border border-zinc-200/50 shrink-0">
             {(
               [["ALL", "전체"], ["ACTIVE", "운영"], ["DRAFT", "작성중"], ["INACTIVE", "중지"]] as const
             ).map(([key, label]) => (
               <button key={key} type="button" onClick={() => setStatusFilter(key)} className={[
                 "rounded-lg px-3 py-1 text-[11px] font-bold tracking-wide transition-all whitespace-nowrap",
                 statusFilter === key ? "bg-white text-zinc-900 shadow-sm" : "bg-transparent text-zinc-500 hover:text-zinc-800",
               ].join(" ")}>{label}</button>
             ))}
          </div>
                  </div>
                </div>
                
                <div className="">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-zinc-50/30 text-[11px] font-extrabold text-zinc-500 uppercase tracking-widest border-b border-zinc-100">
                      <tr>
                        <th className="px-5 py-3 whitespace-nowrap">
                          {/* Mock checkbox for the "종료 처리" visual context */}
                          <input type="checkbox" className="rounded border-zinc-300" aria-label="Select all" />
                        </th>
                        <th className="px-5 py-3 whitespace-nowrap">코드</th>
                        <th className="px-5 py-3 min-w-[160px]">서비스명</th>
                        <th className="px-5 py-3 min-w-[120px]">분류 라인</th>
                        <th className="px-5 py-3 min-w-[120px]">적용대상</th>
                        <th className="px-5 py-3 min-w-[110px]">제공기관</th>
                        <th className="px-5 py-3 whitespace-nowrap text-center">중복위험</th>
                        <th className="px-5 py-3 whitespace-nowrap text-center">상태</th>
                        <th className="px-5 py-3 whitespace-nowrap text-right">이용자</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredServices.length === 0 ? (
                        <tr><td colSpan={9} className="px-5 py-20 text-center text-zinc-500 font-medium text-[13px]">조건에 맞는 서비스내역이 없습니다.</td></tr>
                      ) : (
                        filteredServices.map((row) => (
                          <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors group cursor-pointer lg:hover:shadow-sm">
                            <td className="px-5 py-4">
                              <input type="checkbox" className="rounded border-zinc-300" aria-label="Select row" />
                            </td>
                            <td className="px-5 py-4 font-mono text-[11px] text-zinc-400">{row.code}</td>
                            <td className="px-5 py-4 font-bold text-zinc-900">{row.name}</td>
                            <td className="px-5 py-4 text-[12px] text-zinc-600 leading-snug">
                              <span className="font-semibold text-zinc-800">{row.tierMid}</span><br/><span className="text-[11px] text-zinc-400">{row.tierLarge} &gt; {row.tierSmall}</span>
                            </td>
                            <td className="px-5 py-4 text-[12px] text-zinc-600">{row.targetGroup}</td>
                            <td className="px-5 py-4 text-[12px] text-zinc-600">{row.providerOrg}</td>
                            <td className="px-5 py-4 text-center">
                              {row.duplicateRisk ? (
                                <span className="inline-flex rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-200 uppercase">중복경고</span>
                              ) : (
                                <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500 uppercase">안전</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className={[
                                "inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ring-1",
                                row.status === "ACTIVE" ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : row.status === "DRAFT" ? "bg-amber-50 text-amber-900 ring-amber-200" : "bg-zinc-100 text-zinc-600 ring-zinc-200"
                              ].join(" ")}>{row.status}</span>
                            </td>
                            <td className="px-5 py-4 text-right tabnum font-extrabold text-[14px] text-zinc-800">{row.enrolledCount.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB 2: MAPPING HISTORY */}
            {activeTab === "mappings" && (
              <section className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                  <h2 className="text-[15px] font-bold text-zinc-900">대상자 연계 매핑 현황</h2>
                  <p className="text-[12px] text-zinc-500 mt-1">계약 시작부터 종료까지 추적되는 대상자별 서비스 이용 내역 (목업)</p>
                </div>
                <div className="">
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-white text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                      <tr>
                        <th className="px-5 py-3">대상자</th>
                        <th className="px-5 py-3 min-w-[200px]">적용 서비스</th>
                        <th className="px-5 py-3">분류</th>
                        <th className="px-5 py-3 text-center">기간</th>
                        <th className="px-5 py-3 text-center">상태</th>
                        <th className="px-5 py-3 text-center">중복위험</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {SUBJECT_SERVICE_MAPPING_MOCK.map((m) => (
                        <tr key={m.id} className="hover:bg-zinc-50 transition-colors group">
                          <td className="px-5 py-4 font-bold text-[13px] text-zinc-900">{m.subjectName}</td>
                          <td className="px-5 py-4 font-semibold text-zinc-800">{m.serviceName}</td>
                          <td className="px-5 py-4 text-zinc-500">{m.tierPath}</td>
                          <td className="px-5 py-4 font-mono text-[11px] text-center text-zinc-500">{m.start} <span className="text-zinc-300 mx-1">~</span> {m.end}</td>
                          <td className="px-5 py-4 text-center font-bold text-zinc-700">{m.status}</td>
                          <td className="px-5 py-4 text-center">
                            {m.dupWarning ? <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded shadow-sm border border-amber-200">경고</span> : <span className="text-zinc-300">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB 3: AUDIT & POLICIES */}
            {activeTab === "audit" && (
              <section className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300 p-6">
                <h2 className="text-[15px] font-bold text-zinc-900 mb-6 border-b border-zinc-100 pb-4">현행화 변경 기안 및 감사 로그</h2>
                <ol className="space-y-6 border-l-2 border-zinc-100 pl-5 relative">
                  {SERVICE_AUDIT_LOG_MOCK.map((entry) => (
                    <li key={entry.id} className="relative">
                      <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm" aria-hidden />
                      <time className="font-mono text-[11px] text-zinc-400 block mb-1">{entry.at}</time>
                      <p className="font-bold text-[14px] text-zinc-800 tracking-tight">{entry.actor} <span className="text-blue-600 ml-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/50 text-[12px]">{entry.action}</span></p>
                      <p className="mt-2 text-[13px] text-zinc-600 bg-zinc-50 p-3 rounded-lg border border-zinc-100 max-w-xl">{entry.detail}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
