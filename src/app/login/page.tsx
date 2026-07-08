import { AuthForm } from "@/features/auth/components/auth-form";
import {
  signInWithEmailAction,
  signInWithGoogleAction,
} from "@/features/auth/actions";

type LoginPageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

function getLoginMessage(message: string | undefined) {
  if (message === "signup-success") {
    return "アカウントを作成しました。メールアドレスとパスワードでログインしてください。";
  }

  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f4efe7_0%,#f7f5f1_48%,#efe8dc_100%)] px-4 py-10">
      <AuthForm
        mode="login"
        action={signInWithEmailAction}
        googleAction={signInWithGoogleAction}
        initialMessage={getLoginMessage(params.message)}
      />
    </main>
  );
}
