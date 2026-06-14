import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, FileText, Loader2, Pencil, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/test/TestCreationTabs";
import { QuestionPreviewCard } from "@/components/test/QuestionPreviewCard";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { EmptyState } from "@/components/feedback/EmptyState";
import { cn } from "@/lib/utils";

import { useTest } from "@/features/tests/useTest";
import { useSubjects } from "@/features/taxonomy/useSubjects";
import { testsService } from "@/features/tests/tests.service";
import { questionsService } from "@/features/questions/questions.service";
import { ApiError } from "@/lib/api/types";
import type { Question } from "@/types";

export const Route = createFileRoute("/_authed/tests/$id/preview")({
  head: () => ({ meta: [{ title: "Preview & Publish — PrepRoute" }] }),
  component: PreviewPage,
});

type PublishMode = "now" | "schedule";
type LiveUntil = "always" | "1w" | "2w" | "3w" | "1m" | "custom";

const liveOptions: { id: LiveUntil; label: string }[] = [
  { id: "always", label: "Always Available" },
  { id: "3w", label: "3 Weeks" },
  { id: "1w", label: "1 Week" },
  { id: "1m", label: "1 Month" },
  { id: "2w", label: "2 Weeks" },
  { id: "custom", label: "Custom Duration" },
];

function PreviewPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { data: test, loading, error } = useTest(id);
  const { data: subjects } = useSubjects();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [mode, setMode] = useState<PublishMode>("now");
  const [liveUntil, setLiveUntil] = useState<LiveUntil>("always");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const ids = test?.questions ?? [];
    if (ids.length === 0) {
      setQuestions([]);
      return;
    }
    questionsService
      .fetchBulk(ids)
      .then(setQuestions)
      .catch((e) =>
        toast.error(e instanceof ApiError ? e.message : "Failed to load questions"),
      );
  }, [test]);

  const subjectName = useMemo(() => {
    if (!test?.subject) return undefined;
    return subjects.find((s) => s.id === test.subject)?.name ?? test.subject;
  }, [subjects, test]);

  const publish = async () => {
    if (mode === "schedule" && (!scheduleDate || !scheduleTime)) {
      toast.error("Pick a date and time to schedule.");
      return;
    }
    setPublishing(true);
    try {
      await testsService.publish(id);
      toast.success(mode === "now" ? "Test published!" : "Test scheduled.");
      router.navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading test…" />;
  if (error || !test) {
    return <EmptyState title="Couldn't load test" description={error?.message} />;
  }

  const totalDone = test.questions?.length ?? questions.length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumbs
          items={[
            { label: "Test Creation", to: "/dashboard" },
            { label: "Create Test" },
            { label: "Chapter Wise" },
          ]}
        />
        <Button onClick={publish} disabled={publishing} className="min-w-32">
          {publishing ? <Loader2 className="size-4 animate-spin" /> : null}
          Publish
        </Button>
      </div>

      <h1 className="text-xl text-muted-foreground">Test creation</h1>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-base font-semibold">Test created</span>
        <span className="inline-flex items-center gap-2 rounded-md bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
          <CheckCircle2 className="size-4" />
          All {totalDone} Questions done
        </span>
      </div>

      {/* Test summary card */}
      <div className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 text-primary hover:text-primary"
        >
          <Link to="/tests/$id/edit" params={{ id }}>
            <Pencil className="size-4" />
          </Link>
        </Button>

        <span className="inline-flex rounded-full bg-chip-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-chip-dark-foreground">
          {test.type === "chapterwise" ? "Chapter Wise" : test.type ?? "Test"}
        </span>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-lg font-bold">{test.name || "Chapter 1"}</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-chip-teal px-3 py-1 text-xs font-semibold text-chip-teal-foreground">
            <Trophy className="size-3.5" />
            {test.difficulty === "easy"
              ? "Easy"
              : test.difficulty === "hard"
                ? "Difficult"
                : "Medium"}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 text-sm md:grid-cols-[max-content_1fr_auto] md:items-start">
          <div className="space-y-3 text-muted-foreground">
            <div>Subject</div>
            <div>Topic</div>
            <div>Sub Topic</div>
          </div>
          <div className="space-y-3">
            <div>: {subjectName ?? "—"}</div>
            <div className="flex flex-wrap items-center gap-2">
              <span>:</span>
              {(test.topics ?? []).length === 0 ? (
                <span className="text-muted-foreground">—</span>
              ) : (
                (test.topics ?? []).map((t, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-chip-yellow px-2.5 py-1 text-xs font-medium text-chip-yellow-foreground"
                  >
                    {t}
                  </span>
                ))
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span>:</span>
              {(test.sub_topics ?? []).length === 0 ? (
                <span className="text-muted-foreground">—</span>
              ) : (
                (test.sub_topics ?? []).map((t, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-chip-yellow px-2.5 py-1 text-xs font-medium text-chip-yellow-foreground"
                  >
                    {t}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 self-end pt-4 text-sm text-muted-foreground md:pt-0">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" /> {test.total_time ?? 0} Min
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-4" /> {test.total_questions ?? 0} Q's
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="size-4" /> {test.total_marks ?? 0} Marks
            </span>
          </div>
        </div>
      </div>

      {/* Publish mode tabs */}
      <div className="inline-flex rounded-lg bg-primary-soft p-1">
        {(["now", "schedule"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-md px-5 py-2 text-sm font-semibold transition-colors",
              mode === m
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m === "now" ? "Publish Now" : "Schedule Publish"}
          </button>
        ))}
      </div>

      {mode === "schedule" && (
        <div>
          <h3 className="mb-3 text-base font-semibold">Select Date and Time</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm"
            />
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm"
            />
          </div>
        </div>
      )}

      {/* Live Until */}
      <div>
        <h3 className="text-base font-semibold">Live Until</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how long this test should remain available on the platform.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {liveOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="radio"
                name="liveUntil"
                value={opt.id}
                checked={liveUntil === opt.id}
                onChange={() => setLiveUntil(opt.id)}
                className="size-5 accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>

        {liveUntil === "custom" && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Select End Date"
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="Select End Time"
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm"
            />
          </div>
        )}
      </div>

      {/* Question previews collapsed below */}
      {questions.length > 0 && (
        <details className="mt-4 rounded-lg border bg-card p-4 text-sm">
          <summary className="cursor-pointer font-semibold">
            Preview {questions.length} question{questions.length === 1 ? "" : "s"}
          </summary>
          <div className="mt-4 space-y-4">
            {questions.map((q, i) => (
              <QuestionPreviewCard key={q.id ?? i} index={i} question={q} />
            ))}
          </div>
        </details>
      )}

      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-6">
        <Button variant="outline" onClick={() => router.navigate({ to: "/dashboard" })}>
          Cancel
        </Button>
        <Button onClick={publish} disabled={publishing} className="min-w-32">
          {publishing && <Loader2 className="size-4 animate-spin" />}
          Confirm
        </Button>
      </div>
    </div>
  );
}
