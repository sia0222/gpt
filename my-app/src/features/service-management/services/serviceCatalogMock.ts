/** 서비스 분류(트리 노드) — 복지 > 아동복지 등 계층 */
export interface ServiceCategoryNode {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly children: readonly ServiceCategoryNode[];
}

/** 등록·관리 대상 복지 서비스(목업) */
export interface WelfareServiceItem {
  readonly id: string;
  readonly categoryId: string;
  readonly code: string;
  readonly name: string;
  readonly targetGroup: string;
  readonly providerType: string;
  readonly status: "ACTIVE" | "INACTIVE" | "DRAFT";
  readonly enrolledCount: number;
  readonly updatedAt: string;
}

export const SERVICE_CATEGORY_TREE: ServiceCategoryNode = {
  id: "cat-welfare",
  name: "복지",
  description: "복지 분야 서비스 상위 분류",
  children: [
    {
      id: "cat-child",
      name: "아동복지",
      description: "아동·청소년 대상",
      children: [
        { id: "cat-child-foster", name: "가정위탁", children: [] },
        { id: "cat-child-facility", name: "보호시설 연계", children: [] },
      ],
    },
    {
      id: "cat-elder",
      name: "노인복지",
      description: "노인 대상",
      children: [
        { id: "cat-elder-visit", name: "방문요양", children: [] },
        { id: "cat-elder-day", name: "주간보호", children: [] },
      ],
    },
    {
      id: "cat-disability",
      name: "장애인복지",
      description: "장애인 대상",
      children: [{ id: "cat-disability-activity", name: "활동지원", children: [] }],
    },
  ],
};

export const WELFARE_SERVICES_MOCK: readonly WelfareServiceItem[] = [
  {
    id: "svc-001",
    categoryId: "cat-child-foster",
    code: "WF-CH-FT-01",
    name: "가정위탁 아동 정기 점검",
    targetGroup: "만 18세 미만",
    providerType: "민간 위탁기관",
    status: "ACTIVE",
    enrolledCount: 42,
    updatedAt: "2026-03-24",
  },
  {
    id: "svc-002",
    categoryId: "cat-child-facility",
    code: "WF-CH-FC-01",
    name: "보호시설 입소 연계 상담",
    targetGroup: "위기아동",
    providerType: "시설·센터",
    status: "ACTIVE",
    enrolledCount: 18,
    updatedAt: "2026-03-22",
  },
  {
    id: "svc-003",
    categoryId: "cat-elder-visit",
    code: "WF-EL-VY-01",
    name: "노인 방문요양 (등급별)",
    targetGroup: "65세 이상 요양등급자",
    providerType: "방문요양기관",
    status: "ACTIVE",
    enrolledCount: 356,
    updatedAt: "2026-03-25",
  },
  {
    id: "svc-004",
    categoryId: "cat-elder-day",
    code: "WF-EL-DY-01",
    name: "주간보호 이용",
    targetGroup: "독거·취약 노인",
    providerType: "주간보호센터",
    status: "ACTIVE",
    enrolledCount: 128,
    updatedAt: "2026-03-23",
  },
  {
    id: "svc-005",
    categoryId: "cat-disability-activity",
    code: "WF-DS-AC-01",
    name: "장애인 활동지원 급여",
    targetGroup: "등록 장애인",
    providerType: "활동지원기관",
    status: "DRAFT",
    enrolledCount: 0,
    updatedAt: "2026-03-20",
  },
];

function collectDescendantIds(node: ServiceCategoryNode, acc: Set<string> = new Set()) {
  acc.add(node.id);
  for (const c of node.children) {
    collectDescendantIds(c, acc);
  }
  return acc;
}

function findCategoryNode(
  n: ServiceCategoryNode,
  id: string,
): ServiceCategoryNode | null {
  if (n.id === id) {
    return n;
  }
  for (const c of n.children) {
    const found = findCategoryNode(c, id);
    if (found) {
      return found;
    }
  }
  return null;
}

/** 선택 분류 및 그 하위 분류에 속한 서비스만 표시 */
export function isCategoryInSubtree(
  root: ServiceCategoryNode,
  selectedId: string,
  candidateCategoryId: string,
): boolean {
  const selectedNode = findCategoryNode(root, selectedId);
  if (!selectedNode) {
    return false;
  }
  const allowed = collectDescendantIds(selectedNode);
  return allowed.has(candidateCategoryId);
}

export function getCategoryById(
  root: ServiceCategoryNode,
  id: string,
): ServiceCategoryNode | null {
  if (root.id === id) {
    return root;
  }
  for (const c of root.children) {
    const found = getCategoryById(c, id);
    if (found) {
      return found;
    }
  }
  return null;
}

export interface SelectionServiceStats {
  readonly total: number;
  readonly active: number;
  readonly draft: number;
  readonly inactive: number;
  readonly enrolledSum: number;
}

export function getSelectionServiceStats(
  root: ServiceCategoryNode,
  selectedId: string,
  services: readonly WelfareServiceItem[],
): SelectionServiceStats {
  const node = getCategoryById(root, selectedId);
  if (!node) {
    return { total: 0, active: 0, draft: 0, inactive: 0, enrolledSum: 0 };
  }
  const allowed = collectDescendantIds(node);
  const rows = services.filter((s) => allowed.has(s.categoryId));
  return {
    total: rows.length,
    active: rows.filter((s) => s.status === "ACTIVE").length,
    draft: rows.filter((s) => s.status === "DRAFT").length,
    inactive: rows.filter((s) => s.status === "INACTIVE").length,
    enrolledSum: rows.reduce((acc, s) => acc + s.enrolledCount, 0),
  };
}

function collectDescendantIdsForCount(
  node: ServiceCategoryNode,
  services: readonly WelfareServiceItem[],
): number {
  const allowed = collectDescendantIds(node);
  return services.filter((s) => allowed.has(s.categoryId)).length;
}

/** 트리 노드 우측에 표시할 하위(포함) 서비스 건수 */
export function getCategoryServiceCounts(
  root: ServiceCategoryNode,
  services: readonly WelfareServiceItem[],
): Map<string, number> {
  const map = new Map<string, number>();
  function dfs(n: ServiceCategoryNode) {
    map.set(n.id, collectDescendantIdsForCount(n, services));
    for (const c of n.children) {
      dfs(c);
    }
  }
  dfs(root);
  return map;
}

export interface ServiceAuditEntry {
  readonly id: string;
  readonly at: string;
  readonly actor: string;
  readonly action: string;
  readonly detail: string;
}

export const SERVICE_AUDIT_LOG_MOCK: readonly ServiceAuditEntry[] = [
  {
    id: "a1",
    at: "2026-03-25 11:02",
    actor: "김운영",
    action: "서비스 수정",
    detail: "WF-EL-VY-01 노인 방문요양 — 대상 문구 보정",
  },
  {
    id: "a2",
    at: "2026-03-24 16:40",
    actor: "박복지",
    action: "분류 이동",
    detail: "WF-CH-FC-01 을 '보호시설 연계'로 재배치 (목업)",
  },
  {
    id: "a3",
    at: "2026-03-23 09:18",
    actor: "시스템",
    action: "작성중 알림",
    detail: "WF-DS-AC-01 검수 기한 D-2",
  },
  {
    id: "a4",
    at: "2026-03-22 14:05",
    actor: "이검수",
    action: "상태 변경",
    detail: "WF-CH-FT-01 운영 유지 승인",
  },
] as const;

export function getBreadcrumbLabels(
  root: ServiceCategoryNode,
  selectedId: string,
): string[] {
  function walk(
    n: ServiceCategoryNode,
    trail: string[],
  ): string[] | null {
    const next = [...trail, n.name];
    if (n.id === selectedId) {
      return next;
    }
    for (const child of n.children) {
      const found = walk(child, next);
      if (found) {
        return found;
      }
    }
    return null;
  }
  return walk(root, []) ?? [root.name];
}
