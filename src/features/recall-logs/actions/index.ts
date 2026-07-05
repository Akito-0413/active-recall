"use server";

import { revalidatePath } from "next/cache";

import type { RecallLogActionState } from "@/features/recall-logs/types";
import {
  createRecallLog,
  deleteRecallLog,
  isRecallLogServiceError,
  updateRecallLogReviewStatus,
} from "@/features/recall-logs/services/recall-log-service";
import {
  manualRecallLogCreateSchema,
  recallLogIdSchema,
  reviewStatusSchema,
} from "@/features/recall-logs/validation";
import { isMissingEnvironmentError } from "@/lib/env";

function buildActionErrorState(message: string): RecallLogActionState {
  return {
    status: "error",
    message,
  };
}

function normalizeSummaryPoints(formData: FormData) {
  return formData
    .getAll("summaryPoints")
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function getActionErrorMessage(error: unknown) {
  if (isMissingEnvironmentError(error)) {
    return "環境変数が不足しているため、保存先へ接続できません。";
  }

  if (isRecallLogServiceError(error)) {
    return error.message;
  }

  return "処理に失敗しました。時間をおいて再度お試しください。";
}

export async function createManualRecallLogAction(
  prevState: RecallLogActionState,
  formData: FormData,
): Promise<RecallLogActionState> {
  void prevState;

  const parsed = manualRecallLogCreateSchema.safeParse({
    bookTitle: formData.get("bookTitle"),
    summaryPoints: normalizeSummaryPoints(formData),
    reflection: formData.get("reflection"),
    source: "manual",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "入力内容を確認してください。",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const recallLog = await createRecallLog(parsed.data);
    revalidatePath("/logs");
    revalidatePath("/review");

    return {
      status: "success",
      message: "学習ログを保存しました。",
      redirectTo: `/logs/${recallLog.id}`,
    };
  } catch (error) {
    return buildActionErrorState(getActionErrorMessage(error));
  }
}

export async function updateReviewStatusAction(
  id: string,
  reviewed: boolean,
  prevState: RecallLogActionState,
): Promise<RecallLogActionState> {
  void prevState;

  const parsed = reviewStatusSchema.safeParse({ id, reviewed });

  if (!parsed.success) {
    return {
      status: "error",
      message: "復習状態を更新できませんでした。",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateRecallLogReviewStatus(parsed.data);
    revalidatePath("/logs");
    revalidatePath(`/logs/${parsed.data.id}`);
    revalidatePath("/review");

    return {
      status: "success",
      message: reviewed
        ? "復習済みに更新しました。"
        : "未復習に戻しました。",
    };
  } catch (error) {
    return buildActionErrorState(getActionErrorMessage(error));
  }
}

export async function deleteRecallLogAction(
  id: string,
  prevState: RecallLogActionState,
): Promise<RecallLogActionState> {
  void prevState;

  const parsed = recallLogIdSchema.safeParse(id);

  if (!parsed.success) {
    return buildActionErrorState("不正なログIDです。");
  }

  try {
    await deleteRecallLog(parsed.data);
    revalidatePath("/logs");
    revalidatePath("/review");

    return {
      status: "success",
      message: "学習ログを削除しました。",
      redirectTo: "/logs",
    };
  } catch (error) {
    return buildActionErrorState(getActionErrorMessage(error));
  }
}
