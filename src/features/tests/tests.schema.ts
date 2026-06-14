import { z } from "zod";

export const testFormSchema = z.object({
  name: z.string().trim().min(1, "Test name is required").max(200),
  type: z.enum(["chapterwise", "pyq", "mock"]),
  subject: z.string().min(1, "Subject is required"),
  topics: z.array(z.string()).min(1, "Select at least one topic"),
  sub_topics: z.array(z.string()),
  difficulty: z.enum(["easy", "medium", "hard"]),
  correct_marks: z.coerce.number().min(0).max(100),
  wrong_marks: z.coerce.number().min(-100).max(100),
  unattempt_marks: z.coerce.number().min(-100).max(100),
  total_time: z.coerce.number().min(1, "Total time must be > 0").max(1000),
  total_marks: z.coerce.number().min(1).max(10000),
  total_questions: z.coerce.number().min(1).max(1000),
});

export type TestFormInput = z.infer<typeof testFormSchema>;
