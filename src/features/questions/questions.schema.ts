import { z } from "zod";

export const questionSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(2000),
  option1: z.string().trim().min(1, "Option 1 is required").max(500),
  option2: z.string().trim().min(1, "Option 2 is required").max(500),
  option3: z.string().trim().min(1, "Option 3 is required").max(500),
  option4: z.string().trim().min(1, "Option 4 is required").max(500),
  correct_option: z.enum(["option1", "option2", "option3", "option4"]),
  explanation: z.string().max(2000).optional().or(z.literal("")),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  topic: z.string().optional().or(z.literal("")),
  sub_topic: z.string().optional().or(z.literal("")),
  media_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type QuestionInput = z.infer<typeof questionSchema>;
