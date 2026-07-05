import Link from "next/link";

import { PageShell } from "@/features/recall-logs/components/page-shell";

export default function RecallLogNotFound() {
  return (
    <PageShell
      title="ログが見つかりません"
      description="指定された学習ログは存在しないか、すでに削除されています。"
    >
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <Link
          href="/logs"
          className="text-sm font-medium text-stone-700 underline decoration-stone-300 underline-offset-4"
        >
          ログ一覧へ戻る
        </Link>
      </div>
    </PageShell>
  );
}
