import { describe, expect, it } from "vitest";

import {
  customGptRecallLogCreateSchema,
  manualRecallLogCreateSchema,
} from "@/features/recall-logs/validation";

describe("recall log validation", () => {
  it("accepts valid manual recall log input", () => {
    const result = manualRecallLogCreateSchema.safeParse({
      bookTitle: "Deep Work",
      summaryPoints: ["Point 1", "Point 2", "Point 3"],
      reflection: "I want to try this tomorrow.",
      source: "manual",
    });

    expect(result.success).toBe(true);
  });

  it("accepts valid custom gpt input", () => {
    const result = customGptRecallLogCreateSchema.safeParse({
      bookTitle: "Make Time",
      summaryPoints: ["Point 1", "Point 2", "Point 3", "Point 4"],
      reflection: "This fits my workflow.",
      source: "custom_gpt",
    });

    expect(result.success).toBe(true);
  });

  it("rejects when summary points are fewer than three", () => {
    const result = manualRecallLogCreateSchema.safeParse({
      bookTitle: "Test Book",
      summaryPoints: ["Point 1", "Point 2"],
      reflection: "Reflection",
      source: "manual",
    });

    expect(result.success).toBe(false);
  });

  it("rejects when summary points are more than four", () => {
    const result = manualRecallLogCreateSchema.safeParse({
      bookTitle: "Test Book",
      summaryPoints: ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
      reflection: "Reflection",
      source: "manual",
    });

    expect(result.success).toBe(false);
  });

  it("rejects blank book titles", () => {
    const result = manualRecallLogCreateSchema.safeParse({
      bookTitle: "   ",
      summaryPoints: ["Point 1", "Point 2", "Point 3"],
      reflection: "Reflection",
      source: "manual",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes empty reflection to null", () => {
    const result = manualRecallLogCreateSchema.safeParse({
      bookTitle: "Essentialism",
      summaryPoints: ["Point 1", "Point 2", "Point 3"],
      reflection: "   ",
      source: "manual",
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error("Expected schema parsing to succeed");
    }
    expect(result.data.reflection).toBeNull();
  });
});
