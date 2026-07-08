export type RecallLogSource = "manual" | "custom_gpt";
export type RecallLogSourceType = "book";

export type RecallLog = {
  id: string;
  bookTitle: string;
  summaryPoints: string[];
  reflection: string | null;
  reviewed: boolean;
  reviewedAt: string | null;
  source: RecallLogSource;
  sourceType: RecallLogSourceType;
  createdAt: string;
  updatedAt: string;
};

export type RecallLogInsert = {
  bookTitle: string;
  summaryPoints: string[];
  reflection?: string | null;
  source: RecallLogSource;
};

export type UpdateReviewStatusInput = {
  id: string;
  reviewed: boolean;
};

export type RecallLogRecord = {
  id: string;
  owner_id: string | null;
  book_title: string;
  summary_points: unknown;
  reflection: string | null;
  reviewed: boolean;
  reviewed_at: string | null;
  source: RecallLogSource;
  source_type: RecallLogSourceType;
  created_at: string;
  updated_at: string;
};

export type RecallLogActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: Partial<
    Record<"bookTitle" | "summaryPoints" | "reflection" | "reviewed", string[]>
  >;
  redirectTo?: string;
};

export const initialRecallLogActionState: RecallLogActionState = {
  status: "idle",
  message: null,
};
