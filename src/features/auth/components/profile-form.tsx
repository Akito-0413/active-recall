"use client";

import { useActionState } from "react";

import { updateProfileAction } from "@/features/auth/actions";
import {
  initialProfileActionState,
  type UserProfile,
} from "@/features/auth/types";

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

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialProfileActionState,
  );

  return (
    <form action={formAction} className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-800">
          メールアドレス
        </label>
        <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
          {profile.email}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-stone-800">
          ユーザー名
        </label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={profile.username}
          required
          className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition focus:border-stone-500 focus:bg-white"
        />
        <FieldError errors={state.fieldErrors?.username} />
      </div>

      <details className="rounded-2xl border border-stone-200 bg-stone-50">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-stone-700 marker:hidden">
          詳細情報
        </summary>
        <div className="border-t border-stone-200 px-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-stone-800">ユーザーID</p>
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 font-mono text-xs text-stone-700">
              {profile.id}
            </div>
          </div>
        </div>
      </details>

      <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-stone-600" aria-live="polite">
          {state.message}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-2xl bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {pending ? "更新中..." : "ユーザー名を更新"}
        </button>
      </div>
    </form>
  );
}
