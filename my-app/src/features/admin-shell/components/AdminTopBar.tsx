import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { getBreadcrumbs } from "@/features/admin-shell/services/adminNavConfig";
import { DASH_CONTENT_FRAME } from "@/features/admin-shell/services/dashLayoutClasses";

export function AdminTopBar() {
  const location = useLocation();
  const crumbs = getBreadcrumbs(location.pathname);

  return (
    <header
      className="sticky top-0 z-30 border-b border-dash-border/90 bg-dash-surface/90 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md"
      role="banner"
    >
      <div className={`flex h-14 items-center ${DASH_CONTENT_FRAME}`}>
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
    </header>
  );
}
