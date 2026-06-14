import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type TestCategory = "chapterwise" | "pyq" | "mock";

interface TestCreationTabsProps {
  value: TestCategory;
  onChange?: (v: TestCategory) => void;
}

export function TestCreationTabs({ value, onChange }: TestCreationTabsProps) {
  const [internal, setInternal] = useState<TestCategory>(value);
  const current = onChange ? value : internal;

  const set = (v: TestCategory) => {
    setInternal(v);
    onChange?.(v);
  };

  const tabs: { id: TestCategory; label: string }[] = [
    { id: "chapterwise", label: "Chapter Wise" },
    { id: "pyq", label: "PYQ" },
    { id: "mock", label: "Mock Test" },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-primary-soft p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => set(t.id)}
          className={cn(
            "rounded-md px-5 py-2 text-sm font-semibold transition-colors",
            current === t.id
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

interface BreadcrumbProps {
  items: { label: string; to?: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className={i === items.length - 1 ? "text-foreground" : ""}>{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="size-3.5" />}
        </span>
      ))}
    </nav>
  );
}
