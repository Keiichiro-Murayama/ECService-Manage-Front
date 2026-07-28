import { test, expect, Page } from "@playwright/test";

test.use({ storageState: "e2e/.auth/admin.json" });

/**
 * 商品一覧から指定商品の修正画面を開く
 */
async function openEditPage(
    page: Page,
    productName: string,
) {
    const row = page.locator("tr").filter({
        has: page.getByText(productName),
    });

    await expect(row).toBeVisible();

    await row
        .getByRole("button", { name: "修正" })
        .click();
}

test.describe("BP009～BP011 商品修正機能のE2Eテスト", () => {

    test("正常系: 修正画面に商品情報が表示されること", async ({ page }) => {

        await page.goto("/admin/product");

        await openEditPage(page, "ペンケースC");

        await expect(
            page.locator("#productName")
        ).toBeVisible();

        await expect(page.locator("#productName"))
            .not.toHaveValue("");

        await expect(page.locator("#price"))
            .not.toHaveValue("");

        await expect(page.locator("#stock"))
            .not.toHaveValue("");
    });

    test("正常系: 確認画面へ遷移できること", async ({ page }) => {

        await page.goto("/admin/product");

        await openEditPage(page, "ペンケースC");

        await expect(page.locator("#productName"))
            .toBeEnabled();

        await page.waitForTimeout(1000);

        await page.locator("#productName").fill("テスト商品");
        await page.locator("#price").fill("3000");
        await page.locator("#stock").fill("15");

        await page.getByRole("combobox").click();
        await page.getByRole("option", { name: "文具" }).click();

        await page.getByRole("button", { name: "確認" }).click();

        await expect(
            page.getByText("商品修正確認")
        ).toBeVisible();

        await expect(page.getByText("テスト商品")).toBeVisible();
        await expect(page.getByText("3,000円")).toBeVisible();
        await expect(page.getByText("15個")).toBeVisible();
        await expect(page.getByText("文具", { exact: true })).toBeVisible();
    });

    test("正常系: 戻るボタンで入力画面へ戻れること", async ({ page }) => {

        await page.goto("/admin/product");

        await openEditPage(page, "ペンケースC");

        await page.waitForTimeout(1000);

        await page.locator("#productName").fill("テスト商品");
        await page.locator("#price").fill("3000");
        await page.locator("#stock").fill("15");

        await page.getByRole("combobox").click();
        await page.getByRole("option", { name: "文具" }).click();

        await page.getByRole("button", { name: "確認" }).click();

        await expect(
            page.getByText("商品修正確認")
        ).toBeVisible();

        await page.getByRole("button", { name: "戻る" }).click();

        await expect(
            page.locator("#productName")
        ).toBeVisible();

        await expect(page.locator("#productName"))
            .toHaveValue("テスト商品");

        await expect(page.locator("#price"))
            .toHaveValue("3000");

        await expect(page.locator("#stock"))
            .toHaveValue("15");
    });

    test("正常系: 商品を更新できること", async ({ page }) => {

        await page.goto("/admin/product");

        await openEditPage(page, "ペンケースC");

        await page.waitForTimeout(1000);

        await page.locator("#price").fill("3000");
        await page.locator("#stock").fill("15");

        await page.getByRole("combobox").click();
        await page.getByRole("option", { name: "文具" }).click();

        await page.getByRole("button", { name: "確認" }).click();

        await expect(
            page.getByText("商品修正確認")
        ).toBeVisible();

        await page.getByRole("button", { name: "更新" }).click();

        await expect(
            page.getByText("商品修正完了")
        ).toBeVisible();

        await expect(
            page.getByText("商品情報を更新しました")
        ).toBeVisible();

        await page
            .getByRole("button", {
                name: "商品検索へ戻る",
            })
            .click();

        await expect(page).toHaveURL("/admin/product");

    });

    test("異常系: 在庫数が1001個の場合はエラーとなり確認画面へ遷移しないこと", async ({ page }) => {

        await page.goto("/admin/product");

        await openEditPage(page, "ペンケースC");

        await page.waitForTimeout(1000);

        await page.locator("#stock").fill("1001");

        await page.getByRole("button", { name: "確認" }).click();

        await expect(
            page.getByText("在庫数は1,000個以下で入力してください。")
        ).toBeVisible();

        await expect(
            page.locator("#productName")
        ).toBeVisible();

        await expect(
            page.getByText("商品修正確認")
        ).not.toBeVisible();
    });

});