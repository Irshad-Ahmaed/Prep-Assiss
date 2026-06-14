import { Badge } from "@/components/ui/badge";
import type { TestStatus } from "@/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: TestStatus | string | undefined }) {
  const normalized = (status ?? "draft").toString().toLowerCase();
  const variants: Record<string, string> = {
    live: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    draft: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    archived: "bg-slate-200 text-slate-700 hover:bg-slate-200",
  };
  return (
    <Badge
      variant="secondary"
      className={cn("capitalize", variants[normalized] ?? "bg-slate-100 text-slate-700")}
    >
      {normalized}
    </Badge>
  );
}
