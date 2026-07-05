"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createManualRecallLogAction } from "@/features/recall-logs/actions";
import {
  initialRecallLogActionState,
  type RecallLogActionState,
} from "@/features/recall-logs/types";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p className="text-sm text-rose-600" aria-live="polite">
      {errors[0]}
    </p>
  );
}

export function ManualRecallLogForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    RecallLogActionState,
    FormData
  >(createManualRecallLogAction, initialRecallLogActionState);

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [router, state.redirectTo]);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label
          htmlFor="bookTitle"
          className="text-sm font-medium text-stone-800"
        >
          本タイトル
        </label>
        <input
          id="bookTitle"
          name="bookTitle"
          type="text"
          required
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition focus:border-stone-500 focus:bg-white"
          placeholder="例: 良い戦略、悪い戦略"
        />
        <FieldError errors={state.fieldErrors?.bookTitle} />
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-medium text-stone-800">要約ポイント</h2>
          <p className="mt-1 text-sm text-stone-500">
            3件は必須です。4件目は必要なときだけ追加してください。
          </p>
        </div>
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <label
                htmlFor={`summaryPoints-${index}`}
                className="text-sm text-stone-700"
              >
                要約ポイント {index + 1}
              </label>
              <textarea
                id={`summaryPoints-${index}`}
                name="summaryPoints"
                rows={3}
                required={index < 3}
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition focus:border-stone-500 focus:bg-white"
                placeholder="思い出したい学びを短く書く"
              />
            </div>
          ))}
        </div>
        <FieldError errors={state.fieldErrors?.summaryPoints} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="reflection"
          className="text-sm font-medium text-stone-800"
        >
          自分の気づき
        </label>
        <textarea
          id="reflection"
          name="reflection"
          rows={5}
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition focus:border-stone-500 focus:bg-white"
          placeholder="仕事や学習でどう活かしたいか、まだ曖昧な点は何か"
        />
        <FieldError errors={state.fieldErrors?.reflection} />
      </div>

      <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="text-sm text-stone-600">
          {state.message}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {pending ? "保存中..." : "学習ログを保存"}
        </button>
      </div>
    </form>
  );
}
