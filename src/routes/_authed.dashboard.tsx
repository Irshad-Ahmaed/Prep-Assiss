import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/PageHeader";
import { TestTable } from "@/components/test/TestTable";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useTests } from "@/features/tests/useTests";
import { testsService } from "@/features/tests/tests.service";
import type { Test } from "@/types";

export const Route = createFileRoute("/_authed/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Preproute" },
      { name: "description", content: "Browse, edit and publish your tests." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [showAll, setShowAll] = useState(false);
  const { data: tests, loading, error, refetch } = useTests(showAll ? undefined : 10);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const baseTests = showAll ? tests : tests.slice(0, 10);
    if (!q) return baseTests;
    return baseTests.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.status?.toString().toLowerCase().includes(q),
    );
  }, [tests, query, showAll]);



  return (
    <>
      <PageHeader
        title="Tests"
        description="All tests you have created."
        actions={
          <Button asChild>
            <Link to="/tests/new">
              <Plus className="size-4" /> Create new test
            </Link>
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, subject, status…"
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading tests…" />
      ) : error ? (
        <EmptyState title="Couldn't load tests" description={error.message} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={tests.length === 0 ? "No tests yet" : "No matches"}
          description={
            tests.length === 0
              ? "Create your first test to get started."
              : "Try a different search."
          }
          action={
            tests.length === 0 ? (
              <Button asChild>
                <Link to="/tests/new">
                  <Plus className="size-4" /> Create new test
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          <TestTable tests={filtered} />
          {!showAll && tests.length >= 10 && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => setShowAll(true)} disabled={loading}>
                {loading ? "Loading..." : "Show all documents"}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
