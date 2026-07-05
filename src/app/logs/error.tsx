"use client";

import { PageShell } from "@/features/recall-logs/components/page-shell";

export default function LogsError() {
  return (
    <PageShell
      title="学習ログ一覧"
      description="本から得た学びを、あとで思い出しやすい単位で見返します。"
    >
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
        学習ログの表示中にエラーが発生しました。ページを再読み込みしてください。
      </div>
    </PageShell>
  );
}
