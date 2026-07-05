import { PageShell } from "@/features/recall-logs/components/page-shell";

export default function LogsLoading() {
  return (
    <PageShell
      title="学習ログ一覧"
      description="本から得た学びを、あとで思い出しやすい単位で見返します。"
    >
      <div className="rounded-2xl bg-white p-6 text-sm text-stone-500 shadow-sm">
        学習ログを読み込んでいます...
      </div>
    </PageShell>
  );
}
