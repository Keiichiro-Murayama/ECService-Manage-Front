import { test, expect } from "@playwright/test";
test.use({ storageState: "e2e/.auth/admin.json" });
test.describe("BP012～BP014 新商品登録機能のE2Eテスト", () => {
    test.beforeEach(async () => { });

    test("正常系: 確認画面へ遷移できること", async ({ page }) => {
        await page.goto("/admin/product/add");
        await expect(page.getByText("カテゴリを取得しています。")).toBeHidden();
        await expect(page.locator("#productName")).toBeEnabled();
        await page.waitForTimeout(1000);
        await page.locator("#productName").fill("ショルダーバッグ"); await page.locator("#price").fill("5000");
        await page.locator("#stock").fill("20");
        await page.getByRole("combobox").click(); await page.getByRole("option", { name: "雑貨" }).click();
        await page.locator("#productImage").setInputFiles("e2e/assets/bag.jpg");
        await page.getByRole("button", { name: "確認" }).click();
        await expect(page.getByText("新商品登録確認")).toBeVisible();
        await expect(page.getByText("ショルダーバッグ")).toBeVisible();
        await expect(page.getByText("5,000円")).toBeVisible();
        await expect(page.getByText("20個")).toBeVisible();
        await expect(page.getByText("雑貨")).toBeVisible();
    });

    test("正常系: 戻るボタンで入力画面へ戻れること", async ({ page }) => {
        await page.goto("/admin/product/add");

        await expect(
            page.getByText("カテゴリを取得しています。")
        ).toBeHidden();

        await expect(page.locator("#productName")).toBeEnabled();

        await page.waitForTimeout(1000);

        await page.locator("#productName").fill("ショルダーバッグ");
        await page.locator("#price").fill("5000");
        await page.locator("#stock").fill("20");

        await page.getByRole("combobox").click();
        await page.getByRole("option", { name: "雑貨" }).click();

        await page
            .locator("#productImage")
            .setInputFiles("e2e/assets/bag.jpg");

        await page.getByRole("button", { name: "確認" }).click();

        await expect(
            page.getByText("新商品登録確認")
        ).toBeVisible();

        // 戻る
        await page.getByRole("button", { name: "戻る" }).click();

        // 入力画面
        await expect(
            page.getByText("新商品登録")
        ).toBeVisible();

        // 入力内容が保持されていること
        await expect(page.locator("#productName")).toHaveValue(
            "ショルダーバッグ",
        );
        await expect(page.locator("#price")).toHaveValue("5000");
        await expect(page.locator("#stock")).toHaveValue("20");
    });

    test("正常系: 商品を登録できること", async ({ page }) => {
        const productName =
            `ショルダーバッグ${Date.now().toString().slice(-4)}`; await page.goto("/admin/product/add");

        await expect(
            page.getByText("カテゴリを取得しています。")
        ).toBeHidden();

        await expect(page.locator("#productName")).toBeEnabled();

        await page.waitForTimeout(1000);


        await page.locator("#productName").fill(productName);
        await page.locator("#price").fill("5000");
        await page.locator("#stock").fill("20");

        await page.getByRole("combobox").click();
        await page.getByRole("option", { name: "雑貨" }).click();

        await page
            .locator("#productImage")
            .setInputFiles("e2e/assets/bag.jpg");

        await page.getByRole("button", { name: "確認" }).click();

        await expect(
            page.getByText("新商品登録確認")
        ).toBeVisible();

        // 登録
        await page.getByRole("button", { name: "登録" }).click();

        // 完了画面
        await expect(
            page.getByText("新商品登録完了")
        ).toBeVisible();

        await expect(
            page.getByText("商品を登録しました")
        ).toBeVisible();

        // 商品検索画面へ戻る
        await page
            .getByRole("button", {
                name: "商品検索へ戻る",
            })
            .click();

        await expect(page).toHaveURL("/admin/product");

        // 一覧に登録商品が表示されること
        await expect(
            page.getByText(productName)
        ).toBeVisible();
    });

    test("異常系: 在庫数が1001個の場合はエラーとなり確認画面へ遷移しないこと", async ({
        page,
    }) => {
        await page.goto("/admin/product/add");
        await page.waitForTimeout(1000);
        // ローディング終了待ち
        await expect(
            page.getByText("カテゴリを取得しています。")
        ).toBeHidden();

        await expect(page.locator("#productName")).toBeEnabled();

        // 入力
        await page.locator("#productName").fill("ショルダーバッグ");
        await page.locator("#price").fill("5000");
        await page.locator("#stock").fill("1001");

        await page.getByRole("combobox").click();
        await page.getByRole("option", { name: "雑貨" }).click();

        await page
            .locator("#productImage")
            .setInputFiles("e2e/assets/bag.jpg");

        // 確認
        await page.getByRole("button", { name: "確認" }).click();

        // エラーメッセージ表示
        await expect(
            page.getByText("在庫数は1,000個以下で入力してください。")
        ).toBeVisible();

        // 入力画面のままであること
        await expect(
            page.getByText("新商品登録")
        ).toBeVisible();

        // 確認画面へ遷移していないこと
        await expect(
            page.getByText("新商品登録確認")
        ).not.toBeVisible();
    });

})