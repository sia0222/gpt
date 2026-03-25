import { Fragment } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { getBreadcrumbs } from "@/features/admin-shell/services/adminNavConfig";
import { DASH_CONTENT_FRAME } from "@/features/admin-shell/services/dashLayoutClasses";
import { useAdminLastUpdated } from "@/features/admin-shell/services/useAdminClock";

const QUICK_LINKS = [
  { to: "/subjects", label: "대상자" },
  { to: "/risks", label: "위험" },
  { to: "/boards", label: "게시판" },
] as const;

export function AdminTopBar() {
  const location = useLocation();
  const crumbs = getBreadcrumbs(location.pathname);
  const lastUpdated = useAdminLastUpdated();

  return (
    <header
      className="sticky top-0 z-30 border-b border-dash-border/90 bg-dash-surface/90 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md"
      role="banner"
    >
      <div className={`flex h-14 items-center gap-4 ${DASH_CONTENT_FRAME}`}>
        <div className="min-w-0 flex-1">
          <nav aria-label="현재 위치" className="text-[0.8125rem] text-dash-muted">
            {crumbs.map((c, i) => (
              <Fragment key={`${c.label}-${i}`}>
                {i > 0 ? (
                  <span className="mx-1.5 text-dash-subtle" aria-hidden>
                    /
                  </span>
                ) : null}
                {c.to && i < crumbs.length - 1 ? (
                  <Link to={c.to} className="hover:text-dash-foreground">
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-medium text-dash-foreground">{c.label}</span>
                )}
              </Fragment>
            ))}
          </nav>
        </div>

        <div className="hidden max-w-md flex-1 md:block">
          <label htmlFor="global-search" className="sr-only">
            통합 검색
          </label>
          <input
            id="global-search"
            type="search"
            placeholder="검색… (UI만)"
            className="w-full rounded-full border border-dash-border bg-zinc-50 px-4 py-2 text-[0.8125rem] text-dash-foreground placeholder:text-dash-muted outline-none ring-blue-500/30 transition focus:bg-dash-surface focus:ring-2"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <p className="hidden text-[0.6875rem] text-dash-subtle lg:block">
            갱신 <time dateTime={lastUpdated}>{lastUpdated}</time>
          </p>
          <div className="hidden items-center rounded-full border border-dash-border bg-dash-surface p-0.5 sm:flex">
            {QUICK_LINKS.map((q) => (
              <NavLink
                key={q.to}
                to={q.to}
                className={({ isActive }) =>
                  [
                    "rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                    isActive
                      ? "bg-dash-foreground text-dash-surface"
                      : "text-dash-muted hover:bg-zinc-100",
                  ].join(" ")
                }
              >
                {q.label}
              </NavLink>
            ))}
          </div>
          <button
            type="button"
            className="relative rounded-full p-2 text-dash-muted hover:bg-zinc-100 hover:text-dash-foreground"
            aria-label="알림 (UI)"
          >
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-dash-muted hover:bg-zinc-100 hover:text-dash-foreground"
            aria-label="새로고침 (UI)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9-9v9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="ml-1 flex items-center gap-2 rounded-full border border-dash-border bg-dash-surface py-1 pl-1 pr-2 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
              김
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-[0.75rem] font-semibold text-dash-foreground">김운영</p>
              <p className="text-[0.625rem] text-dash-muted">운영 관리자</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
