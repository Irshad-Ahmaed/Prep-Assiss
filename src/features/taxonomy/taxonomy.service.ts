import { api, unwrap } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Subject, Topic, SubTopic } from "@/types";

export const taxonomyService = {
  getSubjects: () => unwrap<Subject[]>(api.get(endpoints.subjects.list)),
  getTopicsBySubject: (subjectId: string) =>
    unwrap<Topic[]>(api.get(endpoints.topics.bySubject(subjectId))),
  getSubTopicsByTopic: (topicId: string) =>
    unwrap<SubTopic[]>(api.get(endpoints.subTopics.byTopic(topicId))),
  getSubTopicsByTopics: (topicIds: string[]) =>
    unwrap<SubTopic[]>(api.post(endpoints.subTopics.multi, { topicIds })),
};
