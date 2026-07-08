import { ProtectedPageShell } from "@/features/auth/components/protected-page-shell";
import { ManualRecallLogForm } from "@/features/recall-logs/components/manual-recall-log-form";

export default function NewRecallLogPage() {
  return (
    <ProtectedPageShell
      title="手動登録"
      description="読書後に残したい学びを、思い出せる粒度まで短く整理して保存します。"
    >
      <ManualRecallLogForm />
    </ProtectedPageShell>
  );
}
