import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

import { TestForm } from "@/components/test/TestForm";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useTest } from "@/features/tests/useTest";
import { testsService } from "@/features/tests/tests.service";
import { ApiError } from "@/lib/api/types";
import type { TestFormInput } from "@/features/tests/tests.schema";

export const Route = createFileRoute("/_authed/tests/$id/edit")({
  head: () => ({ meta: [{ title: "Edit Test creation — PrepRoute" }] }),
  component: EditTestPage,
});

function EditTestPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { data: test, loading, error } = useTest(id);
  const [submitting, setSubmitting] = useState(false);

  const close = () => router.history.back();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 md:p-10">
      <div className="relative w-full max-w-5xl rounded-xl bg-background p-8 shadow-xl md:p-10">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-foreground">Edit Test creation</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading test…" />
        ) : error || !test ? (
          <EmptyState title="Couldn't load test" description={error?.message} />
        ) : (
          <TestForm
            mode="edit"
            defaultValues={test as Partial<TestFormInput>}
            submitting={submitting}
            onCancel={close}
            onContinue={async (values) => {
              setSubmitting(true);
              try {
                const payload = { ...values };
                if (payload.sub_topics && payload.sub_topics.length === 0) {
                  delete (payload as any).sub_topics;
                }
                await testsService.update(id, payload);
                toast.success("Test updated");
                close();
              } catch (e) {
                toast.error(e instanceof ApiError ? e.message : "Failed to update test");
              } finally {
                setSubmitting(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
