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
  const { data: tests, loading, error, refetch } = useTests();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tests;
    return tests.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.status?.toString().toLowerCase().includes(q),
    );
  }, [tests, query]);

  const handleDelete = async (test: Test) => {
    if (!confirm(`Are you sure you want to delete test "${test.name}"?`)) return;
    try {
      await testsService.delete(test.id);
      toast.success("Test deleted successfully");
      refetch();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete test");
    }
  };

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
        <TestTable tests={filtered} onDelete={handleDelete} />
      )}
    </>
  );
}
