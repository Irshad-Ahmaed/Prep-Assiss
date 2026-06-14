import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRichText } from "@/lib/utils";
import type { QuestionInput } from "@/features/questions/questions.schema";

interface QuestionListItemProps {
  index: number;
  question: QuestionInput;
  onEdit?: () => void;
  onDelete?: () => void;
}

const OPTION_LABEL: Record<string, string> = {
  option1: "A",
  option2: "B",
  option3: "C",
  option4: "D",
};

export function QuestionListItem({ index, question, onEdit, onDelete }: QuestionListItemProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Q{index + 1}</Badge>
            {question.difficulty && (
              <Badge variant="outline" className="capitalize">
                {question.difficulty}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              Correct: {OPTION_LABEL[question.correct_option]}
            </span>
          </div>
          <p 
            className="text-sm font-medium text-foreground line-clamp-2"
            dangerouslySetInnerHTML={{ __html: formatRichText(question.question) }}
          />
        </div>
        <div className="flex gap-1">
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit">
              <Pencil className="size-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete">
              <Trash2 className="size-4 text-destructive" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
