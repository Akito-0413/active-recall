import Link from "next/link";

import { signOutAction } from "@/features/auth/actions";
import { getCurrentUserProfile } from "@/features/auth/services/user-profile-service";
import { PageShell } from "@/features/recall-logs/components/page-shell";

type ProtectedPageShellProps = {
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export async function ProtectedPageShell({
  title,
  description,
  actions,
  children,
}: ProtectedPageShellProps) {
  const profile = await getCurrentUserProfile();

  return (
    <PageShell
      title={title}
      description={description}
      actions={
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex flex-wrap items-center gap-3">
            {actions}
            <Link
              href="/account"
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-950"
            >
              アカウント
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-950"
              >
                ログアウト
              </button>
            </form>
          </div>
          <p className="text-sm text-stone-500">{profile.username}</p>
        </div>
      }
    >
      {children}
    </PageShell>
  );
}
