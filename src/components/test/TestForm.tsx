import { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/TextField";
import { NumberField } from "@/components/form/NumberField";
import { SelectField } from "@/components/form/SelectField";
import { MultiSelectField } from "@/components/form/MultiSelectField";
import { RadioGroupField } from "@/components/form/RadioGroupField";
import { TestCreationTabs } from "@/components/test/TestCreationTabs";

import { testFormSchema, type TestFormInput } from "@/features/tests/tests.schema";
import { useSubjects } from "@/features/taxonomy/useSubjects";
import { useTopics } from "@/features/taxonomy/useTopics";
import { useSubTopics } from "@/features/taxonomy/useSubTopics";

interface TestFormProps {
  defaultValues?: Partial<TestFormInput>;
  submitting?: boolean;
  mode?: "create" | "edit";
  onCancel?: () => void;
  onSaveDraft?: (values: TestFormInput) => void | Promise<void>;
  onContinue: (values: TestFormInput) => void | Promise<void>;
}

const EMPTY_DEFAULTS: TestFormInput = {
  name: "",
  type: "chapterwise",
  subject: "",
  topics: [],
  sub_topics: [],
  difficulty: "easy",
  correct_marks: 5,
  wrong_marks: -1,
  unattempt_marks: 0,
  total_time: 60,
  total_marks: 250,
  total_questions: 50,
};

export function TestForm({
  defaultValues,
  submitting,
  mode = "create",
  onCancel,
  onSaveDraft,
  onContinue,
}: TestFormProps) {
  const methods = useForm<TestFormInput>({
    resolver: zodResolver(testFormSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...defaultValues },
  });

  const subjectId = useWatch({ control: methods.control, name: "subject" });
  const typeValue = useWatch({ control: methods.control, name: "type" });
  const topicIds = useWatch({ control: methods.control, name: "topics" }) ?? [];
  const numQuestions = useWatch({ control: methods.control, name: "total_questions" });
  const correctMarks = useWatch({ control: methods.control, name: "correct_marks" });

  const { data: subjects, loading: subjectsLoading } = useSubjects();
  const { data: topics, loading: topicsLoading } = useTopics(subjectId);
  const { data: subTopics, loading: subTopicsLoading } = useSubTopics(topicIds);

  // Auto-compute total marks
  useEffect(() => {
    const total = Number(numQuestions || 0) * Number(correctMarks || 0);
    if (!Number.isNaN(total) && total > 0) {
      methods.setValue("total_marks", total, { shouldValidate: false });
    }
  }, [numQuestions, correctMarks, methods]);

  // Robustly set subject field in case backend returns an object or name instead of ID
  const [initializedSubject, setInitializedSubject] = useState(false);
  useEffect(() => {
    if (subjects.length > 0 && defaultValues?.subject && !initializedSubject) {
      const subj = defaultValues.subject as any;
      const val = typeof subj === "object" ? subj.id || subj.name : subj;
      const found = subjects.find((s) => s.id === val || s.name === val);
      if (found && found.id !== methods.getValues("subject")) {
        methods.setValue("subject", found.id, { shouldValidate: false, shouldDirty: false });
      } else if (typeof val === "string" && val !== methods.getValues("subject")) {
        methods.setValue("subject", val, { shouldValidate: false, shouldDirty: false });
      }
      setInitializedSubject(true);
    }
  }, [subjects, defaultValues?.subject, methods, initializedSubject]);

  // Robustly map topics if backend returns names
  const [initializedTopics, setInitializedTopics] = useState(false);
  useEffect(() => {
    if (topics.length > 0 && defaultValues?.topics?.length && !initializedTopics) {
      const mapped = defaultValues.topics.map((t: any) => {
        const val = typeof t === "object" ? t.id || t.name : t;
        const found = topics.find((topic) => topic.id === val || topic.name === val);
        return found ? found.id : val;
      });
      const current = methods.getValues("topics") || [];
      if (JSON.stringify(mapped) !== JSON.stringify(current)) {
        methods.setValue("topics", mapped, { shouldValidate: false, shouldDirty: false });
      }
      setInitializedTopics(true);
    }
  }, [topics, defaultValues?.topics, methods, initializedTopics]);

  // Robustly map sub_topics if backend returns names
  const [initializedSubTopics, setInitializedSubTopics] = useState(false);
  useEffect(() => {
    if (subTopics.length > 0 && defaultValues?.sub_topics?.length && !initializedSubTopics) {
      const mapped = defaultValues.sub_topics.map((t: any) => {
        const val = typeof t === "object" ? t.id || t.name : t;
        const found = subTopics.find((sub) => sub.id === val || sub.name === val);
        return found ? found.id : val;
      });
      const current = methods.getValues("sub_topics") || [];
      if (JSON.stringify(mapped) !== JSON.stringify(current)) {
        methods.setValue("sub_topics", mapped, { shouldValidate: false, shouldDirty: false });
      }
      setInitializedSubTopics(true);
    }
  }, [subTopics, defaultValues?.sub_topics, methods, initializedSubTopics]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onContinue)} className="space-y-10">
        <div className="mb-8">
          <TestCreationTabs 
            value={typeValue as any} 
            onChange={(val) => methods.setValue("type", val, { shouldValidate: true, shouldDirty: true })} 
          />
        </div>
        
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          <SelectField<TestFormInput>
            name="subject"
            label="Subject"
            placeholder={subjectsLoading ? "Loading…" : "Choose from Drop-down"}
            options={subjects.map((s) => ({ value: s.id, label: s.name }))}
            required
          />
          <TextField<TestFormInput>
            name="name"
            label="Name of Test"
            placeholder="Enter name of Test"
            required
          />
          <MultiSelectField<TestFormInput>
            name="topics"
            label="Topic"
            placeholder={
              !subjectId
                ? "Select a subject first"
                : topicsLoading
                  ? "Loading…"
                  : "Choose from Drop-down"
            }
            options={topics.map((t) => ({ value: t.id, label: t.name }))}
            emptyText="No topics for this subject"
            required
          />
          <MultiSelectField<TestFormInput>
            name="sub_topics"
            label="Sub Topic"
            placeholder={
              topicIds.length === 0
                ? "Select topics first"
                : subTopicsLoading
                  ? "Loading…"
                  : "Choose from Drop-down"
            }
            options={subTopics.map((s) => ({ value: s.id, label: s.name }))}
            emptyText="No sub-topics"
          />
          <NumberField<TestFormInput>
            name="total_time"
            label="Duration (Minutes)"
            placeholder="Enter the time"
            required
          />
          <RadioGroupField<TestFormInput>
            name="difficulty"
            label="Test Difficulty Level"
            orientation="horizontal"
            options={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Difficult" },
            ]}
            required
          />
        </div>

        {/* Marking scheme */}
        <div>
          <h3 className="mb-4 text-base font-semibold">Marking Scheme:</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-5">
            <NumberField<TestFormInput> name="wrong_marks" label="Wrong Answer" />
            <NumberField<TestFormInput> name="unattempt_marks" label="Unattempted" />
            <NumberField<TestFormInput> name="correct_marks" label="Correct Answer" />
            <NumberField<TestFormInput>
              name="total_questions"
              label="No of Questions"
              placeholder="Ex:250 Marks"
            />
            <NumberField<TestFormInput>
              name="total_marks"
              label="Total Marks"
              placeholder="Ex:250 Marks"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="h-12 min-w-[200px] rounded-md bg-muted text-muted-foreground hover:bg-muted/80"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          {mode === "create" && onSaveDraft && (
            <Button
              type="button"
              variant="outline"
              className="h-12 min-w-[200px] rounded-md"
              disabled={submitting}
              onClick={methods.handleSubmit(onSaveDraft)}
            >
              Save as draft
            </Button>
          )}
          <Button
            type="submit"
            className="h-12 min-w-[200px] rounded-md"
            disabled={submitting}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {mode === "edit" ? "Save" : "Next"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
