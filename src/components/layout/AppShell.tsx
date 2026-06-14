import { type ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const SIDEBAR_WIDTH = "16rem";

export function AppShell({ children, collapseSidebar = false }: { children: ReactNode, collapseSidebar?: boolean }) {
  const [isUserCollapsed, setIsUserCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(isUserCollapsed));
  }, [isUserCollapsed]);

  const effectiveCollapsed = collapseSidebar || isUserCollapsed;
  const sidebarWidth = effectiveCollapsed ? "5rem" : SIDEBAR_WIDTH;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed sidebar */}
      <Sidebar widthRem={sidebarWidth} collapsed={effectiveCollapsed} onToggle={() => setIsUserCollapsed(!isUserCollapsed)} />

      {/* Main column offset by sidebar width on md+ */}
      <div
        className="flex min-h-screen flex-col transition-all duration-300"
        style={{ marginLeft: `var(--app-sidebar-ml, 0px)` }}
      >
        <style>{`@media (min-width: 768px){:root{--app-sidebar-ml:${sidebarWidth};}}`}</style>
        
        <Topbar hideSidebarButton={effectiveCollapsed} />
        <main className={`flex-1 ${collapseSidebar ? "" : "px-4 py-6 md:px-8 md:py-8"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
