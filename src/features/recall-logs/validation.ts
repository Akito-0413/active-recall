import { z } from "zod";

export const MAX_BOOK_TITLE_LENGTH = 200;
export const MAX_SUMMARY_POINT_LENGTH = 280;
export const MAX_REFLECTION_LENGTH = 2000;

const trimmedRequiredString = (maxLength: number, label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください。`)
    .max(maxLength, `${label}は${maxLength}文字以内で入力してください。`);

const summaryPointSchema = trimmedRequiredString(
  MAX_SUMMARY_POINT_LENGTH,
  "要約ポイント",
);

export const recallLogIdSchema = z.uuid({
  message: "不正なログIDです。",
});

export const reviewStatusSchema = z.object({
  id: recallLogIdSchema,
  reviewed: z.boolean(),
});

export const recallLogCreateSchema = z.object({
  bookTitle: trimmedRequiredString(MAX_BOOK_TITLE_LENGTH, "本タイトル"),
  summaryPoints: z
    .array(summaryPointSchema)
    .min(3, "要約ポイントは3件以上入力してください。")
    .max(4, "要約ポイントは4件以内で入力してください。"),
  reflection: z
    .string()
    .trim()
    .max(
      MAX_REFLECTION_LENGTH,
      `気づきは${MAX_REFLECTION_LENGTH}文字以内で入力してください。`,
    )
    .transform((value) => value || null)
    .nullable()
    .optional(),
  source: z.enum(["manual", "custom_gpt"]),
});

export const manualRecallLogCreateSchema = recallLogCreateSchema.extend({
  source: z.literal("manual"),
});

export const customGptRecallLogCreateSchema = recallLogCreateSchema.extend({
  source: z.literal("custom_gpt"),
});
