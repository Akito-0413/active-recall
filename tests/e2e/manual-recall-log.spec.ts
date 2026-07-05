import { expect, test } from "@playwright/test";

test("manual recall log page renders the form", async ({ page }) => {
  await page.goto("/logs/new");

  await expect(
    page.getByRole("heading", { level: 1, name: "手動登録" }),
  ).toBeVisible();
  await expect(page.getByLabel("本タイトル")).toBeVisible();
  await expect(page.getByLabel("要約ポイント 1")).toBeVisible();
  await expect(page.getByLabel("要約ポイント 2")).toBeVisible();
  await expect(page.getByLabel("要約ポイント 3")).toBeVisible();
  await expect(page.getByLabel("要約ポイント 4")).toBeVisible();
  await expect(page.getByLabel("自分の気づき")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "学習ログを保存" }),
  ).toBeVisible();
});
