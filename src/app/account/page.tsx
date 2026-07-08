import { ProfileForm } from "@/features/auth/components/profile-form";
import { ProtectedPageShell } from "@/features/auth/components/protected-page-shell";
import { getCurrentUserProfile } from "@/features/auth/services/user-profile-service";

export default async function AccountPage() {
  const profile = await getCurrentUserProfile();

  return (
    <ProtectedPageShell
      title="アカウント"
      description="表示名を調整して、学習ログを自分専用で管理します。"
    >
      <ProfileForm profile={profile} />
    </ProtectedPageShell>
  );
}
