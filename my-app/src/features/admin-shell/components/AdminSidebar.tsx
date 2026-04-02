import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  GlyphArticle,
  GlyphBell,
  GlyphChart,
  GlyphGear,
  GlyphLayout,
  GlyphPanelLeft,
  GlyphPeople,
  GlyphRadar,
} from "@/features/admin-shell/components/SidebarGlyph";
import {
  ADMIN_NAV_GROUPS,
  type AdminNavItem,
  type AdminNavGlyph,
} from "@/features/admin-shell/services/adminNavConfig";
import { useAdminChromeStore } from "@/features/admin-shell/services/useAdminChromeStore";

function NavIcon({ glyph, className }: { glyph: AdminNavGlyph; className?: string }) {
  switch (glyph) {
    case "layout":
      return <GlyphLayout className={className} />;
    case "people":
      return <GlyphPeople className={className} />;
    case "radar":
      return <GlyphRadar className={className} />;
    case "article":
      return <GlyphArticle className={className} />;
    case "chart":
      return <GlyphChart className={className} />;
    case "bell":
      return <GlyphBell className={className} />;
    case "gear":
      return <GlyphGear className={className} />;
    default:
      return <GlyphLayout className={className} />;
  }
}

function getGroupTitle(groupId: "ops" | "portal") {
  return groupId === "ops" ? "MENU" : "GENERAL";
}

export function AdminSidebar() {
  const { pathname } = useLocation();
  const collapsed = useAdminChromeStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAdminChromeStore((s) => s.toggleSidebar);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    ops: true,
    portal: true,
  });
  const [collapsedParent, setCollapsedParent] = useState<string | null>(null);
  const collapsedMenuRef = useRef<HTMLDivElement | null>(null);

  const collapsedTopLevelItems = ADMIN_NAV_GROUPS.flatMap((group) => group.items);

  useEffect(() => {
    if (collapsed) return;
    const nextOpen = { ops: false, portal: false };
    for (const group of ADMIN_NAV_GROUPS) {
      if (group.items.some((item) => item.to === pathname)) {
        nextOpen[group.id] = true;
      }
    }
    if (!nextOpen.ops && !nextOpen.portal) {
      nextOpen.ops = true;
    }
    setOpenGroups(nextOpen);
  }, [collapsed, pathname]);

  useEffect(() => {
    if (!collapsed) setCollapsedParent(null);
  }, [collapsed]);

  useEffect(() => {
    if (!collapsed || !collapsedParent) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target || collapsedMenuRef.current?.contains(target)) return;
      setCollapsedParent(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [collapsed, collapsedParent]);

  function isItemActive(item: AdminNavItem): boolean {
    if (item.to === pathname) return true;
    return item.children?.some((child) => isItemActive(child)) ?? false;
  }

  function renderCollapsedChildren(items: readonly AdminNavItem[], depth = 0) {
    return items.map((item) => {
      const active = isItemActive(item);
      return (
        <div key={item.to} className="space-y-1">
          <NavLink
            to={item.to}
            end={item.end}
            onClick={() => setCollapsedParent(null)}
            className={[
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-blue-600/10 text-blue-400"
                : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200",
            ].join(" ")}
            style={{ paddingLeft: `${12 + depth * 14}px` }}
          >
            <NavIcon
              glyph={item.glyph}
              className={["shrink-0", active ? "text-blue-400" : "text-zinc-500"].join(" ")}
            />
            <span className="truncate tracking-wide">{item.label}</span>
          </NavLink>
          {item.children?.length ? renderCollapsedChildren(item.children, depth + 1) : null}
        </div>
      );
    });
  }

  function renderNavItem(item: { to: string; label: string; glyph: AdminNavGlyph; end?: boolean }) {
    return (
      <NavLink
        key={item.to}
        to={item.to}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          [
            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium tracking-wide transition-all duration-200",
            collapsed ? "justify-center px-2" : "pr-2.5",
            isActive
              ? "bg-blue-600/10 text-blue-400" // 모던한 Active 상태 (Cloud스타일)
              : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200",
          ].join(" ")
        }
        end={item.end}
      >
        {({ isActive }) => (
          <>
            <NavIcon
              glyph={item.glyph}
              className={[
                "shrink-0",
                isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300",
              ].join(" ")}
            />
            {collapsed ? null : <span className="truncate">{item.label}</span>}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <aside
      className={[
        "dash-sidebar flex flex-col shrink-0 border-r border-zinc-800 bg-[#0c0e14] text-zinc-100 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
      ].join(" ")}
      aria-label="주요 메뉴"
    >
      <div
        className={[
          "flex items-center gap-3 border-b border-zinc-800 px-4 py-4",
          collapsed ? "justify-center px-2" : "",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "메뉴 펼치기" : "메뉴 접기"}
        >
          <GlyphPanelLeft className="h-5 w-5 shrink-0" />
        </button>
        {collapsed ? null : (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-600 text-[12px] font-bold text-white shadow-sm">
                S
              </span>
              <p className="truncate text-[15px] font-bold tracking-tight text-white">Smart Care</p>
            </div>
          </div>
        )}
      </div>

      <nav className="relative flex flex-1 flex-col gap-1 overflow-y-auto min-h-0 px-3 pb-4 pt-5" ref={collapsedMenuRef}>
        {collapsed
          ? collapsedTopLevelItems.map((item) => (
              <div key={item.to} className="relative mb-1">
                {item.children?.length ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedParent((prev) => (prev === item.to ? null : item.to))
                      }
                      className={[
                        "flex w-full items-center justify-center rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-800/60 hover:text-white transition-all",
                        collapsedParent === item.to ? "bg-blue-600/10 text-blue-400" : "",
                      ].join(" ")}
                      title={item.label}
                      aria-haspopup="menu"
                      aria-expanded={collapsedParent === item.to}
                    >
                      <NavIcon glyph={item.glyph} className="shrink-0" />
                    </button>
                    {collapsedParent === item.to ? (
                      <div
                        role="menu"
                        className="absolute left-[64px] top-0 z-40 w-56 rounded-xl border border-zinc-800 bg-[#0c0e14] p-2.5 shadow-xl"
                      >
                        <p className="mb-2 px-3 text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">{item.label}</p>
                        <div className="space-y-1">
                          {renderCollapsedChildren(item.children)}
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <NavLink
                    to={item.to}
                    end={item.end}
                    title={item.label}
                    className={({ isActive }) =>
                      [
                        "flex items-center justify-center rounded-xl p-2.5 transition-all",
                        isActive
                          ? "bg-blue-600/10 text-blue-400"
                          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <NavIcon
                        glyph={item.glyph}
                        className={["shrink-0", isActive ? "text-blue-400" : "text-zinc-500"].join(" ")}
                      />
                    )}
                  </NavLink>
                )}
              </div>
            ))
          : ADMIN_NAV_GROUPS.map((group) => (
              <section key={group.id} className="mb-4">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((prev) => ({ ...prev, [group.id]: !prev[group.id] }))
                  }
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] font-semibold tracking-[0.15em] text-zinc-500 transition-colors hover:text-zinc-300 uppercase"
                  aria-expanded={openGroups[group.id]}
                >
                  <span>{getGroupTitle(group.id)}</span>
                  <span aria-hidden className="transition-transform duration-200" style={{ transform: openGroups[group.id] ? "rotate(180deg)" : "rotate(0)" }}>
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-zinc-600">
                      <path d="M4 6h8l-4 4-4-4z" fill="currentColor"/>
                    </svg>
                  </span>
                </button>
                {openGroups[group.id] ? (
                  <div className="mt-1 flex flex-col gap-0.5">
                    {group.items.map((item) => renderNavItem(item))}
                  </div>
                ) : null}
              </section>
            ))}
      </nav>

      {/* 하단 프로필 영역 */}
      <div className="border-t border-zinc-800 p-3">
        <div
          className={[
            "flex items-center rounded-xl py-2 px-3 transition-colors hover:bg-zinc-800/50 cursor-pointer",
            collapsed ? "justify-center px-0" : "gap-3",
          ].join(" ")}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[12px] font-bold text-white shadow-sm"
            aria-hidden
          >
            A
          </div>
          {collapsed ? null : (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-white leading-tight">Admin User</p>
              <p className="truncate text-[11px] text-zinc-400">admin@company.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
