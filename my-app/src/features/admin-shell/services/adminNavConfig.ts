export type AdminNavGlyph =
  | "layout"
  | "people"
  | "radar"
  | "article"
  | "chart"
  | "bell"
  | "gear";

export interface AdminNavItem {
  readonly to: string;
  readonly label: string;
  readonly end?: boolean;
  readonly glyph: AdminNavGlyph;
}

export interface AdminNavGroup {
  readonly id: "ops" | "portal";
  readonly label: string;
  readonly items: readonly AdminNavItem[];
}

/** sidebar-menu-ia.md 기준 2개 대메뉴 */
export const ADMIN_NAV_GROUPS: readonly AdminNavGroup[] = [
  {
    id: "ops",
    label: "운영 관리",
    items: [
      { to: "/", label: "대시보드", end: true, glyph: "layout" },
      { to: "/subjects", label: "대상자 관리", glyph: "people" },
      { to: "/services", label: "서비스 관리", glyph: "bell" },
      { to: "/risks", label: "위험 관리", glyph: "radar" },
      { to: "/documents", label: "문서 관리", glyph: "article" },
      { to: "/members", label: "회원 관리", glyph: "gear" },
    ],
  },
  {
    id: "portal",
    label: "포털 관리",
    items: [
      { to: "/boards", label: "게시판", glyph: "article" },
      { to: "/policies", label: "정책", glyph: "gear" },
      { to: "/facilities", label: "시설", glyph: "people" },
      { to: "/statistics", label: "통계", glyph: "chart" },
      { to: "/crisis-households", label: "위기가구", glyph: "radar" },
    ],
  },
] as const;

export const ADMIN_PRIMARY_NAV: readonly AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap(
  (group) => group.items,
);

export interface BreadcrumbSegment {
  readonly label: string;
  readonly to?: string;
}

/** 경로별 breadcrumb (와이어프레임 상단 내비) */
export function getBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const base = [{ label: "관리포털", to: "/" }];
  if (pathname.startsWith("/subjects/")) {
    return [...base, { label: "운영 관리" }, { label: "대상자 상세" }];
  }
  const current = ADMIN_PRIMARY_NAV.find((item) => item.to === pathname);
  const title = current?.label ?? "페이지";
  if (pathname === "/") {
    return [...base, { label: title }];
  }
  const group = ADMIN_NAV_GROUPS.find((g) =>
    g.items.some((item) => item.to === pathname),
  );
  if (group) {
    return [...base, { label: group.label }, { label: title, to: pathname }];
  }
  return [...base, { label: title }];
}
