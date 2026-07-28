import { test, expect } from "@playwright/test";


test.describe("商品カテゴリ登録", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/admin/category/add");
    });


    test("正常にカテゴリを登録できる", async ({ page }) => {

        // E2E用テストデータ
        // Date.now()で一意なカテゴリ名を作成し、
        // 既存データとの重複を防止する
        const categoryName =
            `E2Eカテゴリ_${Date.now()}`;


        await page
            .getByLabel("カテゴリ名")
            .fill(categoryName);


        await page.getByRole("button", {
            name: "入力内容を確認する",
        }).click();


        await expect(
            page.getByRole("heading", {
                name: "商品カテゴリ登録（確認）",
            }),
        ).toBeVisible();


        await expect(
            page.getByText(categoryName),
        ).toBeVisible();


        await page.getByRole("button", {
            name: "登録",
        }).click();


        await expect(
            page.getByRole("heading", {
                name: "商品カテゴリ登録完了",
            }),
        ).toBeVisible();


        await expect(
            page.getByText(categoryName),
        ).toBeVisible();

    });


    test("カテゴリ名未入力の場合は確認画面へ進めない", async ({ page }) => {

        await page.getByRole("button", {
            name: "入力内容を確認する",
        }).click();


        await expect(
            page.getByText(
                "カテゴリ名を入力してください",
            ),
        ).toBeVisible();


        await expect(page)
            .toHaveURL(/admin\/category\/add/);

    });


    test("31文字以上入力するとエラーになる", async ({ page }) => {

        await page
            .getByLabel("カテゴリ名")
            .fill("あ".repeat(31));


        await page.getByRole("button", {
            name: "入力内容を確認する",
        }).click();


        await expect(page)
            .toHaveURL(/admin\/category\/add/);

    });


    test("重複カテゴリは登録できない", async ({ page }) => {

        await page
            .getByLabel("カテゴリ名")
            .fill("雑貨");


        await page.getByRole("button", {
            name: "入力内容を確認する",
        }).click();


        await page.getByRole("button", {
            name: "登録",
        }).click();


        await expect(
            page.getByText(
                "このカテゴリ名は既に登録されています。",
            ),
        ).toBeVisible();


        await expect(page)
            .toHaveURL(/admin\/category\/add/);

    });


    test("確認画面の戻るボタンで入力画面へ戻る", async ({ page }) => {

        await page
            .getByLabel("カテゴリ名")
            .fill("テストカテゴリ");


        await page.getByRole("button", {
            name: "入力内容を確認する",
        }).click();


        await page.getByRole("button", {
            name: "戻る",
        }).click();


        await expect(
            page.getByRole("heading", {
                name: "商品カテゴリ新規登録",
            }),
        ).toBeVisible();


        await expect(
            page.getByLabel("カテゴリ名"),
        ).toHaveValue("テストカテゴリ");

    });


    test("確認画面のキャンセルでホームへ戻る", async ({ page }) => {

        await page
            .getByLabel("カテゴリ名")
            .fill("テストカテゴリ");


        await page.getByRole("button", {
            name: "入力内容を確認する",
        }).click();


        await page.getByRole("button", {
            name: "キャンセル",
        }).click();


        await expect(page)
            .toHaveURL("/");

    });


    test("さらにカテゴリを登録で入力画面へ戻る", async ({ page }) => {

        // E2E用テストデータ
        // 一意な名前を使用して重複登録を防止する
        const categoryName =
            `E2Eカテゴリ_${Date.now()}`;


        await page
            .getByLabel("カテゴリ名")
            .fill(categoryName);


        await page.getByRole("button", {
            name: "入力内容を確認する",
        }).click();


        await page.getByRole("button", {
            name: "登録",
        }).click();


        await page.getByRole("button", {
            name: "さらにカテゴリを登録",
        }).click();


        await expect(
            page.getByRole("heading", {
                name: "商品カテゴリ新規登録",
            }),
        ).toBeVisible();


        await expect(
            page.getByLabel("カテゴリ名"),
        ).toHaveValue("");

    });


    test("ホームへ戻るボタンでホームへ遷移する", async ({ page }) => {

        // E2E用テストデータ
        // 一意な名前を使用して重複を防止する
        const categoryName =
            `E2Eカテゴリ_${Date.now()}`;


        await page
            .getByLabel("カテゴリ名")
            .fill(categoryName);


        await page.getByRole("button", {
            name: "入力内容を確認する",
        }).click();


        await page.getByRole("button", {
            name: "登録",
        }).click();


        await page.getByRole("button", {
            name: "ホームへ戻る",
        }).click();


        await expect(page)
            .toHaveURL("/");

    });

});