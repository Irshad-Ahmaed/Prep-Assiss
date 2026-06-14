import { Link } from "@tanstack/react-router";
import { Clock, FileText, Pencil, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Test } from "@/types";

interface TestPreviewSummaryProps {
  test: Test;
  subjectName?: string;
}

export function TestPreviewSummary({ test, subjectName }: TestPreviewSummaryProps) {
  return (
    <div className="relative w-full rounded-[8px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 text-primary hover:text-primary"
      >
        <Link to="/tests/$id/edit" params={{ id: test.id }}>
          <Pencil className="size-4" />
        </Link>
      </Button>

      <span className="inline-flex rounded-full bg-[#0B123C] px-4 py-1.5 text-xs font-medium text-white">
        {test.type === "chapterwise" ? "Chapter Wise" : test.type === "pyq" ? "PYQ" : test.type === "mock" ? "Mock Test" : test.type ?? "Test"}
      </span>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-lg font-bold">{test.name || "Chapter 1"}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#20B2AA] px-3 py-1 text-xs font-medium text-white">
          <Trophy className="size-3.5" />
          {test.difficulty === "easy"
            ? "Easy"
            : test.difficulty === "hard"
              ? "Difficult"
              : "Medium"}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 text-sm md:flex-row md:items-start md:justify-between">
        <div className="grid grid-cols-[max-content_1fr_auto] gap-3">
          <div className="space-y-3 text-muted-foreground">
            <div>Subject</div>
            <div>Topic</div>
            <div>Sub Topic</div>
          </div>
          <div className="space-y-3">
            <div>: <span className="font-medium text-foreground ml-1">{subjectName ?? test.subject ?? "—"}</span></div>
            <div className="flex flex-wrap items-center gap-2">
              <span>:</span>
              {(test.topics ?? []).length === 0 ? (
                <span className="text-muted-foreground ml-1">—</span>
              ) : (
                (test.topics ?? []).map((t, i) => (
                  <span
                    key={i}
                    className="ml-1 rounded-md border border-[#FCD34D] px-2.5 py-0.5 text-xs font-medium text-[#F59E0B]"
                  >
                    {t}
                  </span>
                ))
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span>:</span>
              {(test.sub_topics ?? []).length === 0 ? (
                <span className="text-muted-foreground ml-1">—</span>
              ) : (
                (test.sub_topics ?? []).map((t, i) => (
                  <span
                    key={i}
                    className="ml-1 rounded-md border border-[#FCD34D] px-2.5 py-0.5 text-xs font-medium text-[#F59E0B]"
                  >
                    {t}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end pt-4 text-sm text-muted-foreground md:pt-0">
          <div className="flex items-center gap-3 rounded-md border border-border px-3 py-1.5">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 opacity-50" /> {test.total_time ?? 0} Min
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-4 opacity-50" /> {test.total_questions ?? 0} Q's
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="size-4 opacity-50" /> {test.total_marks ?? 0} Marks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
