"use client";

import { PageShell } from "@/features/recall-logs/components/page-shell";

export default function ReviewError() {
  return (
    <PageShell
      title="未復習ログ"
      description="まだ見返していない学びだけを集めて、次に思い出す対象をはっきりさせます。"
    >
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
        未復習ログの表示中にエラーが発生しました。ページを再読み込みしてください。
      </div>
    </PageShell>
  );
}
