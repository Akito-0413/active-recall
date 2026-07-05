import { ManualRecallLogForm } from "@/features/recall-logs/components/manual-recall-log-form";
import { PageShell } from "@/features/recall-logs/components/page-shell";

export default function NewRecallLogPage() {
  return (
    <PageShell
      title="手動登録"
      description="読書後に残したい学びを、思い出せる粒度まで短く整理して保存します。"
    >
      <ManualRecallLogForm />
    </PageShell>
  );
}
