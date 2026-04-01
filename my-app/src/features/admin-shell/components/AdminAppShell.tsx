import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/features/admin-shell/components/AdminSidebar";
import { AdminSkipLinks } from "@/features/admin-shell/components/AdminSkipLinks";
import { DASH_CONTENT_FRAME } from "@/features/admin-shell/services/dashLayoutClasses";

export function AdminAppShell() {
  return (
    <div className="dash-app flex min-h-screen bg-dash-canvas text-dash-foreground antialiased">
      <AdminSkipLinks />
      <AdminSidebar />
      <div className="flex min-h-full min-w-0 flex-1 flex-col">
        <main
          id="main-content"
          className="flex-1 overflow-auto"
          tabIndex={-1}
        >
          <div className={`${DASH_CONTENT_FRAME} py-4 sm:py-6`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
