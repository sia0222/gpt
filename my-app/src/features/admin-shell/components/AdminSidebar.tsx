import { useEffect, useState } from "react";
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

export function AdminSidebar() {
  const { pathname } = useLocation();
  const collapsed = useAdminChromeStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAdminChromeStore((s) => s.toggleSidebar);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    ops: true,
    portal: true,
  });

  useEffect(() => {
    if (collapsed) {
      return;
    }
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

  function renderNavItem(item: { to: string; label: string; glyph: AdminNavGlyph; end?: boolean }) {
    return (
      <NavLink
        key={item.to}
        to={item.to}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          [
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
            collapsed ? "justify-center px-2" : "",
            isActive
              ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100/80"
              : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
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
                isActive ? "text-blue-700" : "text-zinc-400",
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
        "dash-sidebar flex shrink-0 flex-col border-r border-dash-border/80 bg-dash-surface",
        collapsed ? "w-[72px]" : "w-60",
      ].join(" ")}
      aria-label="주요 메뉴"
    >
      <div
        className={[
          "flex items-center gap-3 border-b border-zinc-100 px-3 py-4",
          collapsed ? "justify-center px-2" : "",
        ].join(" ")}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm"
          aria-hidden
        >
          A
        </div>
        {collapsed ? null : (
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold tracking-tight text-zinc-900">
              Admin Console
            </p>
            <p className="truncate text-[11px] text-zinc-500">Healthcare Ops</p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {collapsed
          ? ADMIN_NAV_GROUPS.flatMap((group) => group.items).map((item) =>
              renderNavItem(item),
            )
          : ADMIN_NAV_GROUPS.map((group) => (
              <section key={group.id} className="mb-1">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((prev) => ({ ...prev, [group.id]: !prev[group.id] }))
                  }
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] font-semibold tracking-wide text-zinc-500 hover:bg-zinc-50"
                  aria-expanded={openGroups[group.id]}
                >
                  <span>{group.label}</span>
                  <span aria-hidden>{openGroups[group.id] ? "−" : "+"}</span>
                </button>
                {openGroups[group.id] ? (
                  <div className="mt-1 flex flex-col gap-1">
                    {group.items.map((item) => renderNavItem(item))}
                  </div>
                ) : null}
              </section>
            ))}
      </nav>

      <div className="border-t border-zinc-100 p-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className={[
            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800",
            collapsed ? "justify-center" : "",
          ].join(" ")}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "메뉴 펼치기" : "메뉴 접기"}
        >
          <GlyphPanelLeft className="shrink-0" />
          {collapsed ? null : <span>메뉴 접기</span>}
        </button>
      </div>
    </aside>
  );
}
