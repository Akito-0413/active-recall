import { AuthForm } from "@/features/auth/components/auth-form";
import {
  signInWithGoogleAction,
  signUpWithEmailAction,
} from "@/features/auth/actions";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#ede8de_0%,#f8f5ee_52%,#ebe4d8_100%)] px-4 py-10">
      <AuthForm
        mode="signup"
        action={signUpWithEmailAction}
        googleAction={signInWithGoogleAction}
      />
    </main>
  );
}
