import { expect, test } from "@playwright/test";

test.describe("担当者アカウント登録", () => {
    test("正常な内容を入力するとアカウントを登録できる", async ({
        page,
    }) => {
        const accountName =
            `e2e${Date.now().toString().slice(-10)}`;

        await page.goto("/admin/account/form");

        await expect(
            page.getByRole("heading", {
                name: "担当者アカウント登録",
            })
        ).toBeVisible();

        await page.getByRole("combobox").click();

        await page.getByRole("option", {
            name: "山田太郎",
        }).click();

        await page
            .getByLabel("アカウント名")
            .fill(accountName);

        await page
            .getByLabel("パスワード")
            .fill("Password123");

        await page.getByRole("button", {
            name: "確認",
        }).click();

        await expect(
            page.getByText("入力内容の確認")
        ).toBeVisible();

        await expect(
            page.getByText("山田太郎")
        ).toBeVisible();

        await expect(
            page.getByText(accountName)
        ).toBeVisible();

        await page.getByRole("button", {
            name: "登録",
        }).click();

        await expect(
            page.getByText("登録が完了しました")
        ).toBeVisible();
    });
});