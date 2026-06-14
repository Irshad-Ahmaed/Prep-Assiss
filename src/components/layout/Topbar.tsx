import { useRouter } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthProvider";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Topbar({ hideSidebarButton }: { hideSidebarButton?: boolean }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const displayName = (user?.name as string) ?? (user?.userId as string) ?? "Admin User";
  const role = (user?.role as string) ?? "Admin";

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <header className="flex h-20 items-center justify-end gap-4 border-b border-border bg-background px-4 md:px-8">
      <button
        type="button"
        className="relative grid size-11 place-items-center rounded-full border border-border bg-card transition-colors hover:bg-muted"
        aria-label="Notifications"
      >
        <Bell className="size-5 text-foreground" />
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-success ring-2 ring-card" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto gap-3 px-2 py-1.5">
            <Avatar className="size-10">
              <AvatarFallback className="bg-warning text-warning-foreground font-semibold">
                {initials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="text-sm font-semibold text-foreground">{displayName}</div>
              <div className="text-xs text-muted-foreground">{role}</div>
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem disabled>Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="size-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
