import { test, expect } from "@playwright/test";

test.describe("ログインページ", () => {
  //log inしていない状態であることを保証する
  test.use({ storageState: { cookies: [], origins: [] } });

  test("ログインページの表示", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();
  });

  test("正しいユーザ名とパスワードでログインできる", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("ユーザー名").fill("Suzuki");
    await page.getByLabel("パスワード").fill("SuzukiPass");
    await page.getByRole("button", { name: "ログイン" }).click();
    await page.waitForURL("/");
    await expect(
      page.getByRole("heading", { name: "メニューページ" }),
    ).toBeVisible();
  });

  test("間違ったユーザ名とパスワードでログインできない", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("ユーザー名").fill("WrongUser");
    await page.getByLabel("パスワード").fill("WrongPass");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/admin/login");
    await expect(
      page.getByText("ユーザー名またはパスワードが正しくありません。"),
    ).toBeVisible();
  });
});
