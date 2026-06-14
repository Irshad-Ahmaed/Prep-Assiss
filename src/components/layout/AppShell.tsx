import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const SIDEBAR_WIDTH = "16rem";

export function AppShell({ children, hideSidebar = false }: { children: ReactNode, hideSidebar?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed sidebar — independent of content height */}
      {!hideSidebar && <Sidebar widthRem={SIDEBAR_WIDTH} />}

      {/* Main column offset by sidebar width on md+ */}
      <div
        className="flex min-h-screen flex-col"
        style={{ marginLeft: hideSidebar ? "0px" : `var(--app-sidebar-ml, 0px)` }}
      >
        {!hideSidebar && (
          <style>{`@media (min-width: 768px){:root{--app-sidebar-ml:${SIDEBAR_WIDTH};}}`}</style>
        )}
        <Topbar hideSidebarButton={hideSidebar} />
        <main className={`flex-1 ${hideSidebar ? "" : "px-4 py-6 md:px-8 md:py-8"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
