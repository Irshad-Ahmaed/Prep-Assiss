import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatRichText } from "@/lib/utils";
import type { Question } from "@/types";

interface QuestionPreviewCardProps {
  index: number;
  question: Question;
}

const OPTIONS: Array<keyof Pick<Question, "option1" | "option2" | "option3" | "option4">> = [
  "option1",
  "option2",
  "option3",
  "option4",
];

const LABELS = ["A", "B", "C", "D"];

export function QuestionPreviewCard({ index, question }: QuestionPreviewCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Q{index + 1}</Badge>
          {question.difficulty && (
            <Badge variant="outline" className="capitalize">
              {question.difficulty}
            </Badge>
          )}
        </div>
        <p 
          className="font-medium text-foreground"
          dangerouslySetInnerHTML={{ __html: formatRichText(question.question) }}
        />
        {question.media_url && (
          <img
            src={question.media_url}
            alt="Question media"
            className="max-h-56 rounded-md border object-contain"
          />
        )}
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {OPTIONS.map((key, i) => {
            const isCorrect = question.correct_option === key;
            return (
              <li
                key={key}
                className={cn(
                  "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
                  isCorrect
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                    : "border-border bg-background",
                )}
              >
                <span className="font-semibold">{LABELS[i]}.</span>
                <span className="flex-1">{question[key]}</span>
                {isCorrect && <Check className="size-4 shrink-0 text-emerald-600" />}
              </li>
            );
          })}
        </ul>
        {question.explanation && (
          <div className="rounded-md bg-muted/60 p-3 text-sm">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Explanation
            </div>
            <p dangerouslySetInnerHTML={{ __html: formatRichText(question.explanation) }} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
