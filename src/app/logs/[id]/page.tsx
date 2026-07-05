export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { DeleteRecallLogForm } from "@/features/recall-logs/components/delete-recall-log-form";
import { ErrorState } from "@/features/recall-logs/components/error-state";
import { PageShell } from "@/features/recall-logs/components/page-shell";
import { ReviewToggleForm } from "@/features/recall-logs/components/review-toggle-form";
import { StatusBadge } from "@/features/recall-logs/components/status-badge";
import { getRecallLogById } from "@/features/recall-logs/services/recall-log-service";
import { isMissingEnvironmentError } from "@/lib/env";

function formatDateTime(value: string | null) {
  if (!value) {
    return "未設定";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type RecallLogDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function loadRecallLog(id: string) {
  try {
    return {
      recallLog: await getRecallLogById(id),
      errorMessage: null,
    };
  } catch (error) {
    return {
      recallLog: null,
      errorMessage: isMissingEnvironmentError(error)
        ? "環境変数が設定されていないため、学習ログを読み込めません。"
        : "学習ログの読み込みに失敗しました。",
    };
  }
}

export default async function RecallLogDetailPage({
  params,
}: RecallLogDetailPageProps) {
  const { id } = await params;
  const { recallLog, errorMessage } = await loadRecallLog(id);

  if (errorMessage) {
    return (
      <PageShell
        title="学習ログ詳細"
        description="要約ポイントと自分の気づきを見返して、理解が曖昧なところを思い出します。"
      >
        <ErrorState message={errorMessage} />
      </PageShell>
    );
  }

  if (!recallLog) {
    notFound();
  }

  return (
    <PageShell
      title={recallLog.bookTitle}
      description="要約ポイントと自分の気づきを見返して、理解が曖昧なところを思い出します。"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge reviewed={recallLog.reviewed} />
            <span className="text-sm text-stone-500">
              生成元: {recallLog.source === "manual" ? "手動登録" : "Custom GPT"}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-950">要約ポイント</h2>
            <ul className="space-y-3">
              {recallLog.summaryPoints.map((point, index) => (
                <li
                  key={`${recallLog.id}-${index}`}
                  className="rounded-2xl bg-stone-100 px-4 py-4 text-sm leading-6 text-stone-800"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-950">自分の気づき</h2>
            <div className="rounded-2xl bg-stone-100 px-4 py-4 text-sm leading-7 text-stone-800">
              {recallLog.reflection || "まだ記録されていません。"}
            </div>
          </div>
        </section>

        <aside className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              状態
            </h2>
            <p className="text-sm text-stone-700">
              作成日: {formatDateTime(recallLog.createdAt)}
            </p>
            <p className="text-sm text-stone-700">
              更新日: {formatDateTime(recallLog.updatedAt)}
            </p>
            <p className="text-sm text-stone-700">
              復習日時: {formatDateTime(recallLog.reviewedAt)}
            </p>
          </div>

          <ReviewToggleForm id={recallLog.id} reviewed={recallLog.reviewed} />
          <DeleteRecallLogForm id={recallLog.id} />
        </aside>
      </div>
    </PageShell>
  );
}
