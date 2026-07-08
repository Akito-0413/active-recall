export const dynamic = "force-dynamic";

import Link from "next/link";

import { ProtectedPageShell } from "@/features/auth/components/protected-page-shell";
import { EmptyState } from "@/features/recall-logs/components/empty-state";
import { ErrorState } from "@/features/recall-logs/components/error-state";
import { RecallLogList } from "@/features/recall-logs/components/recall-log-list";
import { listRecallLogs } from "@/features/recall-logs/services/recall-log-service";
import { isMissingEnvironmentError } from "@/lib/env";

function getPageErrorMessage(error: unknown) {
  if (isMissingEnvironmentError(error)) {
    return "環境変数が設定されていないため、学習ログを読み込めません。README の設定手順を確認してください。";
  }

  return "学習ログを読み込めませんでした。しばらくしてから再度お試しください。";
}

async function loadLogsPageData() {
  try {
    return {
      logs: await listRecallLogs(),
      errorMessage: null,
    };
  } catch (error) {
    return {
      logs: [],
      errorMessage: getPageErrorMessage(error),
    };
  }
}

export default async function LogsPage() {
  const { logs, errorMessage } = await loadLogsPageData();

  return (
    <ProtectedPageShell
      title="学習ログ一覧"
      description="本から得た学びを、あとで思い出しやすい単位で見返します。"
      actions={
        <Link
          href="/logs/new"
          className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-800 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(41,37,36,0.12)] transition hover:bg-stone-700"
        >
          <span className="text-white">手動登録</span>
          <span aria-hidden="true" className="text-base leading-none text-white">
            +
          </span>
        </Link>
      }
    >
      {errorMessage ? (
        <ErrorState message={errorMessage} />
      ) : logs.length === 0 ? (
        <EmptyState
          title="まだ学習ログがありません"
          description="まずは1冊ぶんの学びを手動登録するか、Custom GPT から保存して流れを作りましょう。"
          ctaHref="/logs/new"
          ctaLabel="最初のログを作る"
        />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-stone-600">
              {logs.length}件の学習ログがあります。
            </p>
            <Link
              href="/review"
              className="text-sm font-medium text-stone-700 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-950"
            >
              未復習ログだけを見る
            </Link>
          </div>
          <RecallLogList logs={logs} />
        </div>
      )}
    </ProtectedPageShell>
  );
}
