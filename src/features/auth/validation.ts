import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_USERNAME_LENGTH = 50;

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("メールアドレスの形式を確認してください。");

const passwordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください。`,
  );

const usernameSchema = z
  .string()
  .trim()
  .min(1, "ユーザー名を入力してください。")
  .max(
    MAX_USERNAME_LENGTH,
    `ユーザー名は${MAX_USERNAME_LENGTH}文字以内で入力してください。`,
  );

export function getDefaultUsernameFromEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const [localPart] = normalizedEmail.split("@");
  return localPart || normalizedEmail;
}

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = signInSchema;

export const updateProfileSchema = z.object({
  username: usernameSchema,
});
