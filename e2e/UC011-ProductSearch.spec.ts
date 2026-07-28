import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/admin.json" });

test.describe("BP006 商品検索機能のE2Eテスト", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/admin/product");
    });

    test("正常系: カテゴリを選択して検索し、該当商品が表示されること", async ({ page }) => {
        // 1. カテゴリプルダウンを開いて項目を選択
        await page.getByRole("combobox", { name: "商品カテゴリ" }).click();
        await page.getByRole("option", { name: "文具" }).click(); // DBに存在する実際のカテゴリ名

        // 2. 検索ボタンを押下
        await page.getByRole("button", { name: "カテゴリ検索" }).click();

        // 3. 検証: プルダウンの表示テキストが保持されていること
        await expect(
            page.getByRole("combobox", { name: "商品カテゴリ" })
        ).toHaveText("文具");

        // 4. 検証: 商品一覧のテーブルに要素が存在すること
        await expect(page.getByRole("table")).toBeVisible();
    });

    test("異常系: 該当商品がない場合、メッセージが表示されること", async ({ page }) => {
        await page.getByRole("combobox", { name: "商品カテゴリ" }).click();
        await page.getByRole("option", { name: "テスト１（E2E用）" }).click();
        await page.getByRole("button", { name: "カテゴリ検索" }).click();

        // ローディング終了を待つ
        await expect(
            page.getByText("商品情報を読み込んでいます。")
        ).toBeHidden();

        // メッセージの表示確認
        await expect(
            page.getByText("該当する商品情報がありません。")
        ).toBeVisible();
    });

    test("正常系: 10件を超える場合、ページネーションで2ページ目に切り替えられること", async ({ page }) => {
        // 1. 初期表示（全商品）のままカテゴリ検索を押下
        await page.getByRole("button", { name: "カテゴリ検索" }).click();

        // 2. 1ページ目の表示件数確認
        const rows = page.locator("tbody tr");
        await expect(rows).toHaveCount(10);

        // 3. 2ページ目のリンクをクリック（linkに変更）
        await page.getByRole("link", { name: "2" }).click();

        // 4. 2ページ目に遷移し、商品一覧が正しく表示されていること（件数が0件でないこと）
        await expect(rows).not.toHaveCount(0);
    });

    test("正常系: 初期表示で全商品が表示されること", async ({ page }) => {
        await expect(page.getByRole("table")).toBeVisible();

        const rows = page.locator("tbody tr");
        await expect(rows.first()).toBeVisible();
    });


});