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
    await page.getByLabel("アカウント名").fill("Suzuki");
    await page.getByLabel("パスワード").fill("SuzukiPass");
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/"),
      page.getByRole("button", { name: "ログイン" }).click(),
    ]);
    await expect(
      page.getByRole("heading", { name: "メニューページ" }),
    ).toBeVisible();
  });

  //ユーザ名が空欄
  test("ユーザ名が空欄の状態でログインできない", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("アカウント名").fill("");
    await page.getByLabel("パスワード").fill("SuzukiPass");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/admin/login");
    await expect(
      page.getByLabel("アカウント名").evaluate((el) => {
        const input = el as HTMLInputElement;
        return !input.checkValidity();
      }),
    ).resolves.toBe(true);
    // await expect(
    //   page.getByText("このフィールドに入力してください。"),
    // ).toBeVisible();
  });

  //パスワードが空欄
  test("パスワードが空欄の状態でログインできない", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("アカウント名").fill("Suzuki");
    await page.getByLabel("パスワード").fill("");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/admin/login");
    await expect(
      page.getByLabel("パスワード").evaluate((el) => {
        const input = el as HTMLInputElement;
        return !input.checkValidity();
      }),
    ).resolves.toBe(true);
    // await expect(
    //   page.getByText("このフィールドに入力してください。"),
    // ).toBeVisible();
  });

  //アカウント名が5文字未満
  test("アカウント名が5文字未満の状態でログインできない", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("アカウント名").fill("Suzu");
    await page.getByLabel("パスワード").fill("SuzukiPass");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/admin/login");
    await expect(
      page.getByLabel("アカウント名").evaluate((el) => {
        const input = el as HTMLInputElement;
        return !input.checkValidity();
      }),
    ).resolves.toBe(true);
    // await expect(
    //   page.getByText("このテキストを長くして5文字以上にしてください。"),
    // ).toBeVisible();
  });

  //アカウント名が半角英数字以外
  test("アカウント名が半角英数字以外の状態でログインできない", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.getByLabel("アカウント名").fill("スズキ");
    await page.getByLabel("パスワード").fill("SuzukiPass");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/admin/login");
    await expect(
      page.getByLabel("アカウント名").evaluate((el) => {
        const input = el as HTMLInputElement;
        return !input.checkValidity();
      }),
    ).resolves.toBe(true);
    // await expect(
    //   page.getByText("要求された形式に一致させてください。"),
    // ).toBeVisible();
  });

  //パスワードが５文字未満
  test("パスワードが5文字未満の状態でログインできない", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("アカウント名").fill("Suzuki");
    await page.getByLabel("パスワード").fill("Suzu");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/admin/login");
    await expect(
      page.getByLabel("パスワード").evaluate((el) => {
        const input = el as HTMLInputElement;
        return !input.checkValidity();
      }),
    ).resolves.toBe(true);
    // await expect(
    //   page.getByText("このテキストを長くして5文字以上にしてください。"),
    // ).toBeVisible();
  });

  //パスワードが半角英数字以外
  test("パスワードが半角英数字以外の状態でログインできない", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.getByLabel("アカウント名").fill("Suzuki");
    await page.getByLabel("パスワード").fill("鈴木");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/admin/login");
    await expect(
      page.getByLabel("パスワード").evaluate((el) => {
        const input = el as HTMLInputElement;
        return !input.checkValidity();
      }),
    ).resolves.toBe(true);
    // await expect(
    //   page.getByText("要求された形式に一致させてください。"),
    // ).toBeVisible();
  });

  //ユーザ名が間違っている
  test("間違ったユーザ名でログインできない", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("アカウント名").fill("WrongUser");
    await page.getByLabel("パスワード").fill("SuzukiPass");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/admin/login");
    await expect(
      page.getByText("アカウント名またはパスワードが正しくありません。"),
    ).toBeVisible();
  });

  //パスワードが間違っている
  test("間違ったパスワードでログインできない", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("アカウント名").fill("Suzuki");
    await page.getByLabel("パスワード").fill("WrongPass");
    await page.getByRole("button", { name: "ログイン" }).click();
    await expect(page).toHaveURL("/admin/login");
    await expect(
      page.getByText("アカウント名またはパスワードが正しくありません。"),
    ).toBeVisible();
  });
});
