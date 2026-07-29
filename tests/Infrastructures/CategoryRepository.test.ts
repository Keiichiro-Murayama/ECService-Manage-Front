import { describe, it, expect, vi, beforeEach } from "vitest";


vi.mock("next-auth/react", () => ({
    getSession: vi.fn(),
}));
import { CategoryRepository } from "@/infrastructures/CategoryRepository";

describe("CategoryRepository", () => {

    let repository: CategoryRepository;

    beforeEach(() => {
        repository = new CategoryRepository();
        vi.restoreAllMocks();
    });

    describe("getAllCategories", () => {
       
        it("カテゴリ一覧を取得できる", async () => {

            const categories = [
                {
                    categoryUuid: "1",
                    name: "雑貨",
                },
            ];

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                json: async () => ({
                    categories,
                }),
            } as Response);

            const result =
                await repository.getAllCategories();

            expect(result).toEqual(categories);
        });

        it("取得に失敗した場合例外になる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 500,
            } as Response);

            await expect(
                repository.getAllCategories(),
            ).rejects.toThrow(
                "カテゴリの取得に失敗しました。(status : 500)",
            );
        });

        it("レスポンス形式が不正なら例外になる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                json: async () => ({}),
            } as Response);

            await expect(
                repository.getAllCategories(),
            ).rejects.toThrow(
                "カテゴリ一覧取得APIのレスポンス形式が不正です。",
            );
        });

    });

    describe("addCategory", () => {

        it("カテゴリを登録できる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
            } as Response);

            await expect(
                repository.addCategory("テストカテゴリ"),
            ).resolves.toBeUndefined();

        });

        it("400エラー", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 400,
            } as Response);

            await expect(
                repository.addCategory("あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほま"),
            ).rejects.toThrow(
                "カテゴリの形式が正しくありません。",
            );
        });

        it("401エラー", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 401,
            } as Response);

            await expect(
                repository.addCategory("テスト"),
            ).rejects.toThrow(
                "認証が切れています。",
            );
        });

        it("409エラー", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 409,
            } as Response);

            await expect(
                repository.addCategory("雑貨"),
            ).rejects.toThrow(
                "このカテゴリ名は既に登録されています。",
            );
        });

        it("500エラー", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 500,
            } as Response);

            await expect(
                repository.addCategory("テスト"),
            ).rejects.toThrow(
                "カテゴリの登録に失敗しました。(status: 500)",
            );
        });

    });

});