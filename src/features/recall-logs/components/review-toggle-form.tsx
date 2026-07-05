"use client";

import { useActionState } from "react";

import { updateReviewStatusAction } from "@/features/recall-logs/actions";
import {
  initialRecallLogActionState,
  type RecallLogActionState,
} from "@/features/recall-logs/types";

type ReviewToggleFormProps = {
  id: string;
  reviewed: boolean;
  compact?: boolean;
};

export function ReviewToggleForm({
  id,
  reviewed,
  compact = false,
}: ReviewToggleFormProps) {
  const action = updateReviewStatusAction.bind(null, id, !reviewed);
  const [state, formAction, pending] = useActionState<
    RecallLogActionState,
    FormData
  >(action, initialRecallLogActionState);

  return (
    <form action={formAction} className="space-y-2">
      <button
        type="submit"
        disabled={pending}
        className={
          compact
            ? "rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
            : "rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
        }
      >
        {pending
          ? "更新中..."
          : reviewed
            ? "未復習に戻す"
            : "復習済みにする"}
      </button>
      {state.message ? (
        <p
          aria-live="polite"
          className={
            state.status === "error"
              ? "text-sm text-rose-600"
              : "text-sm text-emerald-700"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
