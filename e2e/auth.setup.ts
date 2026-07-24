// e2e/auth.setup.ts
import { test as setup, expect } from "@playwright/test";
import path from "path";
const authFile = path.join(__dirname, ".auth/admin.json");
setup("ログインして認証状態を保存する", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("ユーザー名").fill("Suzuki");
  await page.getByLabel("パスワード").fill("SuzukiPass");
  await page.getByRole("button", { name: "ログイン" }).click();
  await page.waitForURL("/");
  await expect(
    page.getByRole("heading", { name: "メニューページ" }),
  ).toBeVisible();
  // Cookie と localStorage の状態をファイルへ書き出す
  await page.context().storageState({ path: authFile });
});
