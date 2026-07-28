import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/admin.json" });

test.describe("BP007 商品削除機能のE2Eテスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/product");
  });

  test("正常系: 商品削除確認画面へ遷移できること", async ({ page }) => {
    // 削除対象の商品を取得
    const targetRow = page.getByRole("row").filter({
      hasText: "ペンケースC", // 実際の商品名へ変更
    });

    // 削除ボタン押下
    await targetRow.getByRole("button", { name: "削除" }).click();

    // 削除確認画面へ遷移
    await expect(page).toHaveURL(/\/admin\/product\/delete\//);

    // タイトル表示確認
    await expect(
      page.getByRole("heading", { name: "商品削除（確認）" })
    ).toBeVisible();

    // 商品名表示確認
    await expect(targetRow).not.toBeVisible();
    await expect(page.getByText("ペンケースC")).toBeVisible();
  });

  test("正常系: キャンセルすると商品検索画面へ戻ること", async ({ page }) => {
    const targetRow = page.getByRole("row").filter({
      hasText: "ペンケースC",
    });

    await targetRow.getByRole("button", { name: "削除" }).click();

    await expect(page).toHaveURL(/\/admin\/product\/delete\//);

    // キャンセル
    await page.getByRole("button", { name: "キャンセル" }).click();

    // 商品検索画面へ戻る
    await expect(page).toHaveURL("/admin/product");

    await expect(
      page.getByRole("heading", { name: "商品検索" })
    ).toBeVisible();
  });

  test("正常系: 商品を削除できること", async ({ page }) => {
    const productName = "ペンケースC";

    const targetRow = page.getByRole("row").filter({
      hasText: productName,
    });

    await targetRow.getByRole("button", { name: "削除" }).click();

    await expect(page).toHaveURL(/\/admin\/product\/delete\//);

    // 削除実行
    await page.getByRole("button", { name: "削除" }).click();

    // ローディング終了待ち
    await expect(
      page.getByText("削除しています...")
    ).toBeHidden();

    // 完了画面
    await expect(
      page.getByRole("heading", { name: "商品削除（完了）" })
    ).toBeVisible();

    await expect(
      page.getByText("商品を削除しました")
    ).toBeVisible();

    await expect(
      page.getByText(productName)
    ).toBeVisible();

    // 商品検索画面へ戻る
    await page.getByRole("button", { name: "商品検索へ戻る" }).click();

    await expect(page).toHaveURL("/admin/product");

    // 一覧に表示されないこと
    await expect(page.getByText(productName)).not.toBeVisible();
  });
});