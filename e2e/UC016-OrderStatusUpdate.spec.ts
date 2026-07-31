import { test, expect } from '@playwright/test';

test.describe("注文ステータス更新 E2Eテスト（注文履歴からの遷移＆実DB連携）", () => {

    test("正常系：注文履歴一覧から更新画面へ遷移し、ステータスを更新して一覧に戻る一連フロー", async ({ page }) => {
        // 1. 注文履歴画面へアクセス
        await page.goto("/admin/order/search");

        // 一覧データ（API）の取得・レンダリング完了を待機
        await page.waitForLoadState("networkidle");

        // 2. 一覧の1行目のデータ行を取得し、「更新」ボタンをクリック
        const firstRow = page.locator("tbody tr").first();
        const updateButton = firstRow.getByRole("button", { name: "更新" });

        // ボタンが表示されていることを確認してクリック
        await expect(updateButton).toBeVisible();
        await updateButton.click();

        // 3. 注文ステータス更新画面へ遷移したことを確認
        await expect(page).toHaveURL(/\/admin\/order\/status\/update\/.+/);

        // --- 【入力画面】 ---
        // 見出しタグに限定せずテキストとして存在するか検証
        await expect(page.getByText("注文ステータス更新", { exact: true })).toBeVisible();

        // 変更後のステータスを選択（ドロップダウンを開く）
        await page.getByRole("combobox", { name: "変更後の注文ステータス" }).click();

        // オプション一覧から選択（2番目のステータスを選択）
        await page.getByRole("option").nth(1).click();

        // 「確認」ボタンをクリック
        await page.getByRole("button", { name: "確認" }).click();

        // --- 【確認画面】 ---
        await expect(page.getByText("注文ステータス更新確認")).toBeVisible();

        // 「更新」ボタンをクリック（実際のDB更新処理を実行）
        await page.getByRole("button", { name: "更新" }).click();

        // --- 【完了画面】 ---
        await expect(page.getByText("注文ステータス更新完了")).toBeVisible();

        // 4. 「購入履歴検索へ戻る」ボタンをクリックして一覧画面へ戻る
        await page.getByRole("button", { name: "購入履歴検索へ戻る" }).click();

        // 5. 検索画面に戻ったことを検証
        await expect(page).toHaveURL("/admin/order/search");
    });
    // --- 【追加1】キャンセルボタンの確認 ---
    test("正常系：更新画面でキャンセルボタンを押した場合、更新されずに一覧画面へ戻る", async ({ page }) => {
        await page.goto("/admin/order/search");
        await page.waitForLoadState("networkidle");

        // 1行目の更新ボタンをクリック
        const firstRow = page.locator("tbody tr").first();
        await firstRow.getByRole("button", { name: "更新" }).click();

        // 入力画面が表示されたことを確認
        await expect(page.getByText("注文ステータス更新", { exact: true })).toBeVisible();

        // キャンセルボタン（または「戻る」ボタン）をクリック
        // ※ 画面のボタン名に合わせて "キャンセル" や "戻る" に変更してください
        await page.getByRole("button", { name: "キャンセル" }).click();

        // 処理を実行せずに一覧画面へ戻ったことを検証
        await expect(page).toHaveURL("/admin/order/search");
    });


    // --- 【追加2】更新後のステータス表記の反映確認 ---
    test("正常系：ステータス更新完了後、一覧画面に戻った際に更新後のステータスが正しく表示されている", async ({ page }) => {
        await page.goto("/admin/order/search");
        await page.waitForLoadState("networkidle");

        // 1行目の更新ボタンをクリック
        const firstRow = page.locator("tbody tr").first();
        await firstRow.getByRole("button", { name: "更新" }).click();

        // 入力画面で新しいステータスを選択
        await page.getByRole("combobox", { name: "変更後の注文ステータス" }).click();

        // 例: ドロップダウンの特定のオプション（例: "発送準備中" などテキスト指定も可能）を選択
        const optionToSelect = page.getByRole("option").nth(1);
        const selectedText = (await optionToSelect.textContent())?.trim(); // 選択したテキストを取得
        await optionToSelect.click();

        // 確認 -> 更新
        await page.getByRole("button", { name: "確認" }).click();
        await page.getByRole("button", { name: "更新" }).click();

        // 完了画面から一覧へ戻る
        await page.getByRole("button", { name: "購入履歴検索へ戻る" }).click();
        await expect(page).toHaveURL("/admin/order/search");

        // 一覧の再読み込み完了を待機
        await page.waitForLoadState("networkidle");

        // 更新した1行目の「注文ステータス」列に、選択したステータス名が表示されているか検証
        if (selectedText) {
            const updatedRow = page.locator("tbody tr").first();
            await expect(updatedRow).toContainText(selectedText);
        }
    });

});