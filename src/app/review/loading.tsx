import { PageShell } from "@/features/recall-logs/components/page-shell";

export default function ReviewLoading() {
  return (
    <PageShell
      title="未復習ログ"
      description="まだ見返していない学びだけを集めて、次に思い出す対象をはっきりさせます。"
    >
      <div className="rounded-2xl bg-white p-6 text-sm text-stone-500 shadow-sm">
        未復習ログを読み込んでいます...
      </div>
    </PageShell>
  );
}
