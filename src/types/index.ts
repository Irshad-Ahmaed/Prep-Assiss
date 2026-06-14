export interface User {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  [k: string]: unknown;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export type TestStatus = "draft" | "live" | "scheduled" | null;
export type Difficulty = "easy" | "medium" | "hard";
export type TestType = "chapterwise" | "pyq" | "mock";

export interface Test {
  id: string;
  name: string;
  type?: TestType;
  subject?: string;
  topics?: string[];
  sub_topics?: string[];
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  difficulty?: Difficulty;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  questions?: string[];
  status?: TestStatus;
  start_time?: string;
  end_time?: string;
  live_until?: string;
  created_at?: string;
  updated_at?: string;
}

export type CorrectOption = "option1" | "option2" | "option3" | "option4";

export interface Question {
  id?: string;
  type?: "mcq";
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: CorrectOption;
  explanation?: string;
  difficulty?: Difficulty;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
  test_id?: string;
}
