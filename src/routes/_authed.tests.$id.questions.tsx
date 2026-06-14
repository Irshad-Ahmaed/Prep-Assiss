import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Download, ChevronsLeft, CheckCircle2, MinusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { Breadcrumbs } from "@/components/test/TestCreationTabs";
import { TestPreviewSummary } from "@/components/test/TestPreviewSummary";
import { QuestionForm } from "@/components/test/QuestionForm";
import { QuestionListItem } from "@/components/test/QuestionListItem";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { EmptyState } from "@/components/feedback/EmptyState";
import { EmptyState as _EmptyState } from "@/components/feedback/EmptyState";

import { useTest } from "@/features/tests/useTest";
import { testsService } from "@/features/tests/tests.service";
import { questionsService } from "@/features/questions/questions.service";
import { ApiError } from "@/lib/api/types";
import type { QuestionInput } from "@/features/questions/questions.schema";

export const Route = createFileRoute("/_authed/tests/$id/questions")({
  head: () => ({ meta: [{ title: "Add Questions — Preproute" }] }),
  component: QuestionsPage,
});

void _EmptyState;

function QuestionsPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { data: test, loading, error } = useTest(id);

  const [pending, setPending] = useState<QuestionInput[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (loading) return <LoadingSpinner label="Loading test…" />;
  if (error || !test) {
    return <EmptyState title="Couldn't load test" description={error?.message} />;
  }

  const saveQuestionsAndContinue = async (list: QuestionInput[]) => {
    if (list.length === 0) {
      toast.error("Add at least one question");
      return;
    }
    setSubmitting(true);
    try {
      const payload = list.map((q) => ({ ...q, type: "mcq" as const, test_id: id, subject: test.subject }));
      const created = await questionsService.bulkCreate(payload);
      const questionIds = created.map((c) => c.id).filter((x): x is string => !!x);

      const totalQuestions = (test.questions?.length ?? 0) + questionIds.length;
      const correctMarks = test.correct_marks ?? 1;
      await testsService.update(id, {
        questions: [...(test.questions ?? []), ...questionIds],
        total_questions: totalQuestions,
        total_marks: totalQuestions * correctMarks,
      });

      toast.success(`Saved ${questionIds.length} question(s)`);
      router.navigate({ to: "/tests/$id/preview", params: { id } });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to save questions");
    } finally {
      setSubmitting(false);
    }
  };

  const addOrUpdate = async (q: QuestionInput) => {
    let nextPending: QuestionInput[];
    if (editingIdx !== null) {
      nextPending = pending.map((p, i) => (i === editingIdx ? q : p));
      setEditingIdx(null);
    } else {
      nextPending = [...pending, q];
    }
    setPending(nextPending);

    const targetLimit = test.total_questions || 50;
    if (nextPending.length >= targetLimit) {
      await saveQuestionsAndContinue(nextPending);
    }
  };

  const removeAt = (idx: number) => {
    setPending((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
  };

  const saveAndContinue = () => saveQuestionsAndContinue(pending);

  return (
    <div className="flex w-full items-start bg-white min-h-screen">
        <div className={`flex flex-col items-start gap-[30px] border-r border-[#E5E7EB] bg-white p-6 shadow-sm self-stretch shrink-0 transition-all duration-300 ${isSidebarOpen ? "w-[174px]" : "w-[80px] items-center"}`}>
          <div className="flex flex-col gap-[30px] self-stretch">
            <div className={`flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
              {isSidebarOpen && <span className="text-sm font-medium text-[#6B7180] whitespace-nowrap">Question creation</span>}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="grid size-[18px] place-items-center rounded bg-white hover:bg-gray-100 cursor-pointer"
              >
                <ChevronsLeft className={`size-3 text-[#7489FF] transition-transform ${isSidebarOpen ? "" : "rotate-180"}`} />
              </button>
            </div>
            {isSidebarOpen && (
              <div className="flex items-center gap-[5px]">
                <span className="text-sm text-[#6B7180] whitespace-nowrap">Total Questions</span>
                <span className="text-sm text-[#6B7180]">.</span>
                <span className="text-sm font-medium text-[#6B7180]">{test.total_questions || 50}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[10px] self-stretch">
            {Array.from({ length: test.total_questions || 50 }).map((_, i) => {
              const isAdded = i < pending.length;
              return (
                <div
                  key={i}
                  className={`flex items-center rounded-lg border-[0.5px] py-1.5 h-8 transition-all ${isSidebarOpen ? "justify-between px-[10px]" : "justify-center px-0"} ${isAdded ? "border-[#0C9D61] bg-white" : "border-[#E5E7EB] bg-white"}`}
                >
                  <div className={`flex items-center ${isSidebarOpen ? "gap-[10px]" : ""}`}>
                    {isAdded ? (
                      <div className="grid size-4 place-items-center rounded-full bg-[#0C9D61] shrink-0">
                        <CheckCircle2 className="size-3 text-white" />
                      </div>
                    ) : (
                      <div className="grid size-4 place-items-center rounded-full bg-[#E5E7EB] shrink-0">
                        <MinusCircle className="size-3 text-white" />
                      </div>
                    )}
                    {isSidebarOpen && (
                      <span className={`text-xs whitespace-nowrap ${isAdded ? "text-[#0C9D61]" : "text-[#6B7180]"}`}>
                        Question {i + 1}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      <div className="flex-1 w-full p-4 md:p-8 overflow-y-auto min-h-screen">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumbs
            items={[
              { label: "Test Creation", to: "/dashboard" },
              { label: "Create Test" },
              { label: "Chapter Wise" },
            ]}
          />
          <Button onClick={saveAndContinue} disabled={submitting || pending.length === 0}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Save & continue
          </Button>
        </div>

        <div className="mb-6">
          <TestPreviewSummary test={test} />
        </div>

        <div className="mb-6 flex w-full flex-row items-center justify-between rounded-[8px] bg-white py-[14px] px-6 border border-[#E5E7EB]">
          <h2 className="text-[18px] font-semibold text-[#1e1b4b]">
            Question {pending.length + 1}<span className="text-[#93c5fd]">/{test.total_questions || 50}</span>
          </h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium">
              <Plus className="size-4" /> MCQ
            </Button>
            <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium">
              <Download className="size-4" /> CSV
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[15px] rounded-[12px] bg-white p-[1px] lg:flex-row lg:items-start">
          <QuestionForm
            key={editingIdx ?? "new"}
            defaultValues={editingIdx !== null ? pending[editingIdx] : undefined}
            submitLabel={editingIdx !== null ? "Update question" : "Add question"}
            topicOptions={(test.topics ?? []).map(t => ({ value: t, label: t }))}
            subTopicOptions={(test.sub_topics ?? []).map(t => ({ value: t, label: t }))}
            onSubmit={addOrUpdate}
            onCancel={editingIdx !== null ? () => setEditingIdx(null) : undefined}
          />
        </div>
      </div>
    </div>
  );
}
