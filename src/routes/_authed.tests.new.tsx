import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Breadcrumbs, TestCreationTabs } from "@/components/test/TestCreationTabs";
import { TestForm } from "@/components/test/TestForm";
import { testsService } from "@/features/tests/tests.service";
import { ApiError } from "@/lib/api/types";
import type { TestFormInput } from "@/features/tests/tests.schema";

export const Route = createFileRoute("/_authed/tests/new")({
  head: () => ({ meta: [{ title: "Create Test — PrepRoute" }] }),
  component: NewTestPage,
});

function NewTestPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const save = async (values: TestFormInput, status: "draft" | null) => {
    setSubmitting(true);
    try {
      const payload = status ? { ...values, status } : { ...values };
      const created = await testsService.create(payload);
      toast.success(status === "draft" ? "Saved as draft" : "Test created");
      return created;
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to save test");
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Breadcrumbs
        items={[
          { label: "Test Creation", to: "/dashboard" },
          { label: "Create Test" },
          { label: "Chapter Wise" },
        ]}
      />
      <div className="pt-2">
        <TestForm
          submitting={submitting}
          onCancel={() => router.navigate({ to: "/dashboard" })}
          onSaveDraft={async (values) => {
            await save(values, "draft");
            router.navigate({ to: "/dashboard" });
          }}
          onContinue={async (values) => {
            const created = await save(values, null);
            router.navigate({ to: "/tests/$id/questions", params: { id: created.id } });
          }}
        />
      </div>
    </div>
  );
}
