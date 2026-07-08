export const dynamic = "force-dynamic";

import { ProtectedPageShell } from "@/features/auth/components/protected-page-shell";
import { EmptyState } from "@/features/recall-logs/components/empty-state";
import { ErrorState } from "@/features/recall-logs/components/error-state";
import { RecallLogList } from "@/features/recall-logs/components/recall-log-list";
import { listPendingRecallLogs } from "@/features/recall-logs/services/recall-log-service";
import { isMissingEnvironmentError } from "@/lib/env";

function getReviewErrorMessage(error: unknown) {
  return isMissingEnvironmentError(error)
    ? "環境変数が設定されていないため、未復習ログを読み込めません。"
    : "未復習ログの読み込みに失敗しました。";
}

async function loadReviewPageData() {
  try {
    return {
      logs: await listPendingRecallLogs(),
      errorMessage: null,
    };
  } catch (error) {
    return {
      logs: [],
      errorMessage: getReviewErrorMessage(error),
    };
  }
}

export default async function ReviewPage() {
  const { logs, errorMessage } = await loadReviewPageData();

  return (
    <ProtectedPageShell
      title="未復習ログ"
      description="まだ見返していない学びだけを集めて、次に思い出す対象をはっきりさせます。"
    >
      {errorMessage ? (
        <ErrorState message={errorMessage} />
      ) : logs.length === 0 ? (
        <EmptyState
          title="未復習ログはありません"
          description="いま保存されている学習ログはすべて復習済みです。次の学びを追加するか、一覧から記録を見返してください。"
          ctaHref="/logs/new"
          ctaLabel="新しいログを作る"
        />
      ) : (
        <RecallLogList logs={logs} highlightPending />
      )}
    </ProtectedPageShell>
  );
}
