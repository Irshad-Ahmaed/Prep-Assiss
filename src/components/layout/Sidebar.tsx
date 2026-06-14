import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, NotebookPen, ClipboardList, LogOut, ChevronsLeft } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { PreprouteLogo } from "@/components/brand/PreprouteLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Extra path prefixes that should also mark this item active. */
  match?: string[];
};

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tests/new", label: "Test Creation", icon: NotebookPen, match: ["/tests"] },
  { to: "/test-tracking", label: "Test Tracking", icon: ClipboardList },
];

function isActive(pathname: string, item: NavItem) {
  if (pathname === item.to) return true;
  if (item.match?.some((p) => pathname === p || pathname.startsWith(p + "/"))) return true;
  return false;
}

interface SidebarProps {
  widthRem?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ widthRem = "16rem", collapsed = false, onToggle }: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 md:flex"
      style={{ width: widthRem }}
    >
      <div className={cn("flex h-20 shrink-0 items-center relative", collapsed ? "justify-center px-0" : "px-6")}>
        {!collapsed ? <PreprouteLogo /> : <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">P</div>}
        
        {onToggle && (
          <button 
            onClick={onToggle} 
            className="absolute -right-3 top-7 flex size-6 items-center justify-center rounded-full border border-sidebar-border bg-white text-gray-500 shadow-sm hover:bg-gray-50 z-40 transition-transform hover:scale-110"
          >
            <ChevronsLeft className={cn("size-3 transition-transform", collapsed && "rotate-180")} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <SidebarNavLink key={item.to} item={item} active={isActive(pathname, item)} collapsed={collapsed} />
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <Button variant="ghost" size="sm" className={cn("w-full gap-3", collapsed ? "justify-center px-0" : "justify-start")} onClick={handleLogout}>
          <LogOut className="size-5 shrink-0" /> {!collapsed && "Log out"}
        </Button>
      </div>
    </aside>
  );
}

function SidebarNavLink({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const { icon: Icon, to, label } = item;
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2.5 rounded-md border-l-[5px] py-2.5 transition-colors",
        collapsed ? "justify-center px-0 border-l-0 w-10 h-10 mx-auto" : "pl-5 pr-5",
        active
          ? "border-[#384EC7] bg-[#F8FAFF] text-[#384EC7] font-semibold hover:bg-[#F8FAFF] hover:text-[#384EC7]"
          : "border-transparent text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && active && "border-l-0",
      )}
      title={collapsed ? label : undefined}
    >
      <Icon className="size-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
