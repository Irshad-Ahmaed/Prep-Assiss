/** Centralized API endpoint URLs. */
export const endpoints = {
  auth: {
    login: "/auth/login",
  },
  subjects: {
    list: "/subjects",
  },
  topics: {
    bySubject: (subjectId: string) => `/topics/subject/${subjectId}`,
  },
  subTopics: {
    byTopic: (topicId: string) => `/sub-topics/topic/${topicId}`,
    multi: "/sub-topics/multi-topics",
  },
  tests: {
    list: "/tests",
    create: "/tests",
    byId: (id: string) => `/tests/${id}`,
    update: (id: string) => `/tests/${id}`,
  },
  questions: {
    bulkCreate: "/questions/bulk",
    fetchBulk: "/questions/fetchBulk",
  },
} as const;
