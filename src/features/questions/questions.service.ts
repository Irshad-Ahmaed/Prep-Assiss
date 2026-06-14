import { api, unwrap } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Question } from "@/types";

export const questionsService = {
  bulkCreate: (questions: Question[]) =>
    unwrap<Question[]>(api.post(endpoints.questions.bulkCreate, { questions })),
  fetchBulk: (question_ids: string[]) =>
    unwrap<Question[]>(api.post(endpoints.questions.fetchBulk, { question_ids })),
};
