import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, NotebookPen, ClipboardList, LogOut } from "lucide-react";
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
}

export function Sidebar({ widthRem = "16rem" }: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex"
      style={{ width: widthRem }}
    >
      <div className="flex h-20 shrink-0 items-center px-6">
        <PreprouteLogo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <SidebarNavLink key={item.to} item={item} active={isActive(pathname, item)} />
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="size-4" /> Log out
        </Button>
      </div>
    </aside>
  );
}

function SidebarNavLink({ item, active }: { item: NavItem; active: boolean }) {
  const { icon: Icon, to, label } = item;
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2.5 rounded-md border-l-[5px] py-2.5 pl-5 pr-5 text-sm font-medium transition-colors",
        active
          ? "border-[#384EC7] bg-[#F8FAFF] text-[#384EC7] font-semibold hover:bg-[#F8FAFF] hover:text-[#384EC7]"
          : "border-transparent text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  );
}
