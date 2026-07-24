import { test, expect } from "@playwright/test";

// ログアウトのテスト

test.describe("ログアウト", () => {
  test("ログアウトできる", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "メニューページ" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "ログアウト" }).click();

    await expect(page).toHaveURL(/\/admin\/login(\?loggedOut=1)?$/);
    await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();

    await expect(
      page.getByText("ログアウトしました。", { exact: true }),
    ).toBeVisible();
  });
});
