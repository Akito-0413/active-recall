"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  initialAuthActionState,
  type AuthActionState,
} from "@/features/auth/types";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (
    state: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  googleAction: () => Promise<void>;
  initialMessage?: string | null;
};

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

export function AuthForm({
  mode,
  action,
  googleAction,
  initialMessage = null,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    action,
    initialMessage
      ? {
          ...initialAuthActionState,
          status: "success",
          message: initialMessage,
        }
      : initialAuthActionState,
  );

  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-md space-y-5 rounded-[2rem] border border-stone-200 bg-white/90 p-7 shadow-[0_24px_80px_rgba(28,25,23,0.08)] backdrop-blur">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-stone-500">
          Active Recall
        </p>
        <h1 className="text-3xl font-semibold text-stone-950">
          {isLogin ? "ログイン" : "アカウント作成"}
        </h1>
        <p className="text-sm leading-6 text-stone-600">
          {isLogin
            ? "保存した学習ログを自分専用で見返せるようにします。"
            : "メールアドレスとパスワードで学習ログ用のアカウントを作成します。"}
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-stone-800">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition focus:border-stone-500 focus:bg-white"
            placeholder="reader@example.com"
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-stone-800"
          >
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition focus:border-stone-500 focus:bg-white"
            placeholder="8文字以上"
          />
          <FieldError errors={state.fieldErrors?.password} />
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {pending
              ? "処理中..."
              : isLogin
                ? "メールでログイン"
                : "アカウントを作成"}
          </button>

          <button
            type="submit"
            formAction={googleAction}
            formNoValidate
            className="inline-flex w-full items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
          >
            Googleで続ける
          </button>
        </div>

        <div className="min-h-6 text-sm text-stone-600" aria-live="polite">
          {state.message}
        </div>
      </form>

      <p className="text-sm text-stone-600">
        {isLogin ? "初めて使う場合は" : "すでにアカウントがある場合は"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4"
        >
          {isLogin ? "アカウントを作成" : "ログイン"}
        </Link>
      </p>
    </div>
  );
}
