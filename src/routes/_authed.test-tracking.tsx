import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/_authed/test-tracking")({
  head: () => ({ meta: [{ title: "Test Tracking — PrepRoute" }] }),
  component: TrackingPage,
});

function TrackingPage() {
  return (
    <>
      <PageHeader title="Test Tracking" description="Track live and scheduled tests." />
      <EmptyState
        title="Coming soon"
        description="Test tracking is part of the next milestone."
      />
    </>
  );
}
