import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/admin.json" });

test.describe("BP015 購入履歴検索機能のE2Eテスト", () => {
  test.beforeEach(async ({ page }) => {
    // 購入履歴検索画面へ遷移
    await page.goto("/admin/order/search");

    // リダイレクト等でログイン画面に飛ばされていないか確認
    await expect(page).not.toHaveURL(/\/login/);

    // 画面タイトル「購入履歴検索」が表示されるまで待機
    await expect(
      page.getByRole("heading", { name: "購入履歴検索", level: 1 })
    ).toBeVisible();

    // 初期表示のローディング完了を待機
    await expect(
      page.getByText("注文情報を読み込んでいます。")
    ).toBeHidden();

    // 画面状態の安定化のため待機
    await page.waitForTimeout(1000);
  });

  test("正常系: 初期表示で画面要素（フォーム・テーブル）が正しく表示されること", async ({ page }) => {
    await expect(page.getByLabel("購入日")).toBeVisible();
    await expect(page.getByLabel("顧客アカウント名")).toBeVisible();
    await expect(page.getByRole("button", { name: "検索" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("正常系: 顧客アカウント名「ayase」で検索し、該当する注文履歴が表示されること", async ({ page }) => {
    const customerInput = page.getByLabel("顧客アカウント名");
    await expect(customerInput).toBeEnabled();
    await customerInput.fill("ayase");

    await page.getByRole("button", { name: "検索" }).click();
    await page.waitForTimeout(1000);

    await expect(
      page.getByText("注文情報を読み込んでいます。")
    ).toBeHidden();

    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("cell", { name: "ayase" }).first()).toBeVisible();
  });

  test("正常系: 7/27日の購入日で検索し、該当する注文履歴が表示されること", async ({ page }) => {
    const dateInput = page.getByLabel("購入日");

    await expect(dateInput).toBeEnabled();
    await dateInput.click();
    await dateInput.fill("2026-07-27");
    
    // 入力確定の待機
    await page.waitForTimeout(500);

    // 検索実行
    await page.getByRole("button", { name: "検索" }).click();
    await page.waitForTimeout(1000);

    await expect(
      page.getByText("注文情報を読み込んでいます。")
    ).toBeHidden();

    await expect(page.getByRole("table")).toBeVisible();
    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible();
  });

  test("正常系: 顧客アカウント名「ayase」かつ購入日「2026-07-27」のAND条件で検索できること", async ({ page }) => {
    const dateInput = page.getByLabel("購入日");
    const customerInput = page.getByLabel("顧客アカウント名");

    await expect(dateInput).toBeEnabled();
    await dateInput.fill("2026-07-27");
    await customerInput.fill("ayase");

    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "検索" }).click();
    await page.waitForTimeout(1000);

    await expect(
      page.getByText("注文情報を読み込んでいます。")
    ).toBeHidden();

    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("cell", { name: "ayase" }).first()).toBeVisible();
  });

  test("異常系: 該当する注文がない条件で検索した際、「該当する注文が見つかりませんでした」と表示されること", async ({ page }) => {
    const customerInput = page.getByLabel("顧客アカウント名");
    await expect(customerInput).toBeEnabled();
    await customerInput.fill("non_existent_user_9999");

    await page.getByRole("button", { name: "検索" }).click();
    await page.waitForTimeout(1000);

    await expect(
      page.getByText("注文情報を読み込んでいます。")
    ).toBeHidden();

    await expect(
      page.getByText("該当する注文が見つかりませんでした")
    ).toBeVisible();
  });

  test("正常系: ステータス更新ボタンを押下すると、ステータス更新画面に遷移すること", async ({ page }) => {
    const customerInput = page.getByLabel("顧客アカウント名");
    await expect(customerInput).toBeEnabled();
    await customerInput.fill("ayase");

    await page.getByRole("button", { name: "検索" }).click();
    await page.waitForTimeout(1000);

    await expect(
      page.getByText("注文情報を読み込んでいます。")
    ).toBeHidden();

    const updateButton = page.getByRole("button", { name: "更新" }).first();
    await expect(updateButton).toBeVisible();
    await updateButton.click();

    await expect(page).toHaveURL(/\/admin\/order\/status\/update\/.+/);
  });
});