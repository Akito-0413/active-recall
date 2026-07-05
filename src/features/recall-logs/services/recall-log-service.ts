import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type {
  RecallLog,
  RecallLogInsert,
  RecallLogRecord,
  UpdateReviewStatusInput,
} from "@/features/recall-logs/types";

class RecallLogServiceError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "database"
      | "invalid_data"
      | "not_found"
      | "configuration" = "database",
  ) {
    super(message);
    this.name = "RecallLogServiceError";
  }
}

function mapRecallLog(record: RecallLogRecord): RecallLog {
  if (!Array.isArray(record.summary_points)) {
    throw new RecallLogServiceError(
      "保存データの形式が正しくありません。",
      "invalid_data",
    );
  }

  return {
    id: record.id,
    bookTitle: record.book_title,
    summaryPoints: record.summary_points.map((item) => String(item)),
    reflection: record.reflection,
    reviewed: record.reviewed,
    reviewedAt: record.reviewed_at,
    source: record.source,
    sourceType: record.source_type,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function handleSupabaseError(message: string, error: { message: string } | null) {
  if (error) {
    throw new RecallLogServiceError(message);
  }
}

export function isRecallLogServiceError(
  error: unknown,
): error is RecallLogServiceError {
  return error instanceof RecallLogServiceError;
}

export async function listRecallLogs() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("recall_logs")
    .select("*")
    .order("created_at", { ascending: false });

  handleSupabaseError("学習ログ一覧を取得できませんでした。", error);

  return (data as RecallLogRecord[]).map(mapRecallLog);
}

export async function listPendingRecallLogs() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("recall_logs")
    .select("*")
    .eq("reviewed", false)
    .order("created_at", { ascending: false });

  handleSupabaseError("未復習ログを取得できませんでした。", error);

  return (data as RecallLogRecord[]).map(mapRecallLog);
}

export async function getRecallLogById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("recall_logs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  handleSupabaseError("学習ログ詳細を取得できませんでした。", error);

  if (!data) {
    return null;
  }

  return mapRecallLog(data as RecallLogRecord);
}

export async function createRecallLog(input: RecallLogInsert) {
  const supabase = createAdminClient();
  const payload = {
    book_title: input.bookTitle,
    summary_points: input.summaryPoints,
    reflection: input.reflection ?? null,
    reviewed: false,
    reviewed_at: null,
    source: input.source,
    source_type: "book" as const,
  };

  const { data, error } = await supabase
    .from("recall_logs")
    .insert(payload)
    .select("*")
    .single();

  handleSupabaseError("学習ログを保存できませんでした。", error);

  return mapRecallLog(data as RecallLogRecord);
}

export async function updateRecallLogReviewStatus(
  input: UpdateReviewStatusInput,
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("recall_logs")
    .update({
      reviewed: input.reviewed,
      reviewed_at: input.reviewed ? new Date().toISOString() : null,
    })
    .eq("id", input.id)
    .select("*")
    .maybeSingle();

  handleSupabaseError("復習状態を更新できませんでした。", error);

  if (!data) {
    throw new RecallLogServiceError(
      "対象の学習ログが見つかりませんでした。",
      "not_found",
    );
  }

  return mapRecallLog(data as RecallLogRecord);
}

export async function deleteRecallLog(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("recall_logs")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  handleSupabaseError("学習ログを削除できませんでした。", error);

  if (!data) {
    throw new RecallLogServiceError(
      "対象の学習ログが見つかりませんでした。",
      "not_found",
    );
  }
}
