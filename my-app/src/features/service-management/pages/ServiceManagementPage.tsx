import { useMemo, useState } from "react";
import { PageHeader } from "@/features/admin-shell";
import { SERVICE_COMPLETION_RATE } from "@/features/shared";
import {
  SERVICE_AUDIT_LOG_MOCK,
  SERVICE_CATEGORY_TREE,
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
  if (!s) {
    return node;
  }
  if (node.name.toLowerCase().includes(s)) {
    return node;
  }
  const kids = node.children
    .map((c) => filterCategoryTree(c, q))
    .filter((x): x is ServiceCategoryNode => x !== null);
  if (kids.length === 0) {
    return null;
  }
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
      <div
        className="flex items-center gap-0.5"
        style={{ paddingLeft: depth * 12 }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-expanded={expanded}
            aria-label={expanded ? `${node.name} 분류 접기` : `${node.name} 분류 펼치기`}
            onClick={() => toggleExpanded(node.id)}
          >
            <span aria-hidden>{expanded ? "▾" : "▸"}</span>
          </button>
        ) : (
          <span className="inline-block w-8 shrink-0" aria-hidden />
        )}
        <button
          type="button"
          role="treeitem"
          aria-selected={isSelected}
          className={[
            "flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] font-medium transition-colors",
            isSelected ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-700/20" : "text-slate-700 hover:bg-slate-50",
          ].join(" ")}
          onClick={() => onSelect(node.id)}
        >
          <span className="truncate">{node.name}</span>
          {svcCount > 0 ? (
            <span
              className={[
                "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600",
              ].join(" ")}
            >
              {svcCount}
            </span>
          ) : null}
        </button>
      </div>
      {hasChildren && expanded ? (
        <ul role="group" className="mt-0.5 space-y-0.5 border-l border-slate-200/80 pl-1">
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
      ) : null}
    </li>
  );
}

const DEFAULT_EXPANDED = new Set<string>([
  "cat-welfare",
  "cat-child",
  "cat-elder",
  "cat-disability",
]);

type TableStatusFilter = "ALL" | "ACTIVE" | "DRAFT" | "INACTIVE";

export function ServiceManagementPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(SERVICE_CATEGORY_TREE.id);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(DEFAULT_EXPANDED));
  const [categoryQuery, setCategoryQuery] = useState("");
  const [tableQuery, setTableQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TableStatusFilter>("ALL");

  const countMap = useMemo(
    () => getCategoryServiceCounts(SERVICE_CATEGORY_TREE, WELFARE_SERVICES_MOCK),
    [],
  );

  const globalStats = useMemo(
    () => getSelectionServiceStats(SERVICE_CATEGORY_TREE, SERVICE_CATEGORY_TREE.id, WELFARE_SERVICES_MOCK),
    [],
  );

  const displayRoot = useMemo(() => {
    if (!categoryQuery.trim()) {
      return SERVICE_CATEGORY_TREE;
    }
    return filterCategoryTree(SERVICE_CATEGORY_TREE, categoryQuery) ?? SERVICE_CATEGORY_TREE;
  }, [categoryQuery]);

  const breadcrumbs = useMemo(
    () => getBreadcrumbLabels(SERVICE_CATEGORY_TREE, selectedCategoryId),
    [selectedCategoryId],
  );

  const selectedCategory = useMemo(
    () => getCategoryById(SERVICE_CATEGORY_TREE, selectedCategoryId),
    [selectedCategoryId],
  );

  const selectionStats = useMemo(
    () => getSelectionServiceStats(SERVICE_CATEGORY_TREE, selectedCategoryId, WELFARE_SERVICES_MOCK),
    [selectedCategoryId],
  );

  const filteredServices = useMemo(() => {
    let rows = WELFARE_SERVICES_MOCK.filter((s) =>
      isCategoryInSubtree(SERVICE_CATEGORY_TREE, selectedCategoryId, s.categoryId),
    );
    if (statusFilter !== "ALL") {
      rows = rows.filter((s) => s.status === statusFilter);
    }
    const q = tableQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.targetGroup.toLowerCase().includes(q) ||
          s.providerType.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [selectedCategoryId, statusFilter, tableQuery]);

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4 pb-8">
      <PageHeader
        eyebrow="운영 관리 · 서비스"
        title="서비스 관리"
        accent="gradient"
        description={
          <>
            복지 서비스는 <strong>분류 트리</strong>를 유지한 채 등록·현황·이력을 한 화면에서 다룹니다. 예:{" "}
            <span className="text-slate-700">복지 → 아동복지 → 가정위탁</span>
          </>
        }
        footer={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">전체 서비스</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{globalStats.total}</p>
              <p className="mt-1 text-xs text-slate-500">모든 분류 합산 (목업)</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-800/90">운영 중</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-900">{globalStats.active}</p>
              <p className="mt-1 text-xs text-emerald-800/80">ACTIVE 상태</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-amber-900/90">작성·검수</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-amber-950">{globalStats.draft}</p>
              <p className="mt-1 text-xs text-amber-900/70">DRAFT</p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-indigo-900/90">총 이용자</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-indigo-950">
                {globalStats.enrolledSum.toLocaleString("ko-KR")}
              </p>
              <p className="mt-1 text-xs text-indigo-900/70">이용자 수 합계 (목업)</p>
            </div>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside
          className="xl:sticky xl:top-4 xl:self-start"
          aria-label="서비스 분류"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h2 className="text-xs font-semibold text-slate-800">분류 트리</h2>
              <button
                type="button"
                className="rounded-lg border border-dashed border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
              >
                + 하위 분류
              </button>
            </div>
            <label className="mt-2 block text-[11px] text-slate-500" htmlFor="svc-tree-search">
              분류 검색
            </label>
            <input
              id="svc-tree-search"
              type="search"
              value={categoryQuery}
              onChange={(e) => setCategoryQuery(e.target.value)}
              placeholder="예: 아동, 방문요양"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-900 outline-none ring-blue-500/20 focus:bg-white focus:ring-2"
              autoComplete="off"
            />
            <ul role="tree" aria-label="복지 서비스 분류 트리" className="mt-3 max-h-[min(60vh,28rem)] space-y-0.5 overflow-y-auto pr-1">
              <CategoryTreeItem
                node={displayRoot}
                depth={0}
                selectedId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
                expandedIds={expandedIds}
                toggleExpanded={toggleExpanded}
                countMap={countMap}
              />
            </ul>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
              숫자는 해당 분류·하위에 연결된 서비스 건수입니다.
            </p>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <nav className="text-xs text-slate-500" aria-label="선택된 분류 경로">
                {breadcrumbs.map((label, i) => (
                  <span key={`${label}-${i}`}>
                    {i > 0 ? <span className="mx-1.5 text-slate-300">/</span> : null}
                    <span className={i === breadcrumbs.length - 1 ? "font-semibold text-slate-900" : ""}>
                      {label}
                    </span>
                  </span>
                ))}
              </nav>
              {selectedCategory?.description ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{selectedCategory.description}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
                  서비스 {selectionStats.total}건
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 ring-1 ring-emerald-100">
                  운영 {selectionStats.active}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 ring-1 ring-amber-100">
                  작성중 {selectionStats.draft}
                </span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-900 ring-1 ring-indigo-100">
                  이용자 Σ {selectionStats.enrolledSum.toLocaleString("ko-KR")}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
                >
                  분류 설정
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  서비스 등록
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200"
                >
                  일괄 내보내기 (UI)
                </button>
              </div>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-sm font-semibold text-slate-900">주간 제공 이행률</h2>
              <p className="mt-1 text-xs text-slate-500">센터 단위 집계 참고 지표 (목업)</p>
              <ul className="mt-3 space-y-2">
                {SERVICE_COMPLETION_RATE.map((point) => (
                  <li key={point.hour} className="grid grid-cols-[52px_1fr_40px] items-center gap-2 text-xs">
                    <span className="font-medium text-slate-500">{point.hour}</span>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        style={{ width: `${point.value}%` }}
                      />
                    </div>
                    <span className="text-right font-semibold tabular-nums text-slate-800">{point.value}%</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">서비스 목록</h2>
                <p className="mt-0.5 text-xs text-slate-500" aria-live="polite">
                  표시 {filteredServices.length}건 · 선택 분류 및 하위 포함
                </p>
              </div>
              <div className="flex w-full min-w-0 flex-col gap-2 sm:max-w-xl sm:flex-row sm:items-center">
                <label className="sr-only" htmlFor="svc-table-search">
                  서비스 검색
                </label>
                <input
                  id="svc-table-search"
                  type="search"
                  value={tableQuery}
                  onChange={(e) => setTableQuery(e.target.value)}
                  placeholder="코드·명칭·대상 검색"
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none ring-blue-500/20 focus:ring-2"
                />
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="상태 필터">
                  {(
                    [
                      ["ALL", "전체"],
                      ["ACTIVE", "운영"],
                      ["DRAFT", "작성중"],
                      ["INACTIVE", "중지"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStatusFilter(key)}
                      className={[
                        "rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                        statusFilter === key
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <caption className="sr-only">선택 분류 서비스 목록</caption>
                <thead className="border-b border-slate-100 bg-white text-xs font-medium text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3">코드</th>
                    <th className="px-4 py-3">서비스명</th>
                    <th className="px-4 py-3">대상</th>
                    <th className="px-4 py-3">제공주체</th>
                    <th className="px-4 py-3">상태</th>
                    <th className="whitespace-nowrap px-4 py-3 text-right">이용자</th>
                    <th className="whitespace-nowrap px-4 py-3">수정일</th>
                    <th className="px-4 py-3 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-14 text-center">
                        <p className="text-sm font-medium text-slate-700">조건에 맞는 서비스가 없습니다</p>
                        <p className="mt-1 text-xs text-slate-500">
                          분류를 바꾸거나 검색·필터를 초기화해 보세요.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((row) => (
                      <tr key={row.id} className="transition-colors hover:bg-blue-50/40">
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">
                          {row.code}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                        </td>
                        <td className="max-w-[10rem] px-4 py-3 text-xs text-slate-600">{row.targetGroup}</td>
                        <td className="max-w-[10rem] px-4 py-3 text-xs text-slate-600">{row.providerType}</td>
                        <td className="px-4 py-3">
                          <span
                            className={[
                              "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                              row.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                                : row.status === "DRAFT"
                                  ? "bg-amber-50 text-amber-900 ring-1 ring-amber-100"
                                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
                            ].join(" ")}
                          >
                            {row.status === "ACTIVE" ? "운영" : row.status === "DRAFT" ? "작성중" : "중지"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-medium tabular-nums text-slate-900">
                          {row.enrolledCount.toLocaleString("ko-KR")}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{row.updatedAt}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            className="text-xs font-semibold text-blue-700 underline-offset-2 hover:text-blue-800 hover:underline"
                          >
                            수정
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">최근 변경 이력</h2>
              <button
                type="button"
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                전체 보기 (UI)
              </button>
            </div>
            <ol className="mt-4 space-y-3 border-l-2 border-slate-200 pl-4">
              {SERVICE_AUDIT_LOG_MOCK.map((entry) => (
                <li key={entry.id} className="relative text-sm">
                  <span
                    className="absolute -left-[calc(0.625rem+2px)] top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500 shadow"
                    aria-hidden
                  />
                  <time className="font-mono text-[11px] text-slate-500">{entry.at}</time>
                  <p className="mt-0.5 font-medium text-slate-900">
                    {entry.actor} · <span className="text-blue-700">{entry.action}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">{entry.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
