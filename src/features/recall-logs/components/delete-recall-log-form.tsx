"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { deleteRecallLogAction } from "@/features/recall-logs/actions";
import {
  initialRecallLogActionState,
  type RecallLogActionState,
} from "@/features/recall-logs/types";

type DeleteRecallLogFormProps = {
  id: string;
};

export function DeleteRecallLogForm({ id }: DeleteRecallLogFormProps) {
  const router = useRouter();
  const action = deleteRecallLogAction.bind(null, id);
  const [state, formAction, pending] = useActionState<
    RecallLogActionState,
    FormData
  >(action, initialRecallLogActionState);

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [router, state.redirectTo]);

  return (
    <form action={formAction} className="space-y-2">
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-rose-200 px-5 py-3 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "削除中..." : "削除する"}
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
