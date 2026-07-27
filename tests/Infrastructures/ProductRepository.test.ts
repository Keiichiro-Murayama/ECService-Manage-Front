import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductRepository } from "@/infrastructures/ProductRepository";

describe("ProductRepository", () => {

    let repository: ProductRepository;

    beforeEach(() => {
        repository = new ProductRepository();
        vi.restoreAllMocks();
    });

    describe("searchProducts", () => {

        it("商品一覧を取得できる", async () => {

            const products = [
                {
                    productUuid: "1",
                    productName: "ノートPC",
                },
            ];

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                json: async () => products,
            } as Response);

            const result =
                await repository.searchProducts();

            expect(result).toEqual(products);
        });

        it("カテゴリ指定で検索できる", async () => {

            const spy = vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                json: async () => [],
            } as Response);

            await repository.searchProducts("category001");

            expect(spy).toHaveBeenCalledWith(
                "/proxy-api/products?categoryUuid=category001",
                expect.any(Object),
            );
        });

        it("検索失敗で例外になる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 500,
            } as Response);

            await expect(
                repository.searchProducts(),
            ).rejects.toThrow(
                "商品の検索に失敗しました。(status : 500)",
            );
        });

        it("レスポンス形式が不正なら例外になる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                json: async () => ({}),
            } as Response);

            await expect(
                repository.searchProducts(),
            ).rejects.toThrow(
                "商品検索APIのレスポンス形式が不正です。",
            );
        });

    });

    describe("getProductDetail", () => {

        it("商品詳細を取得できる", async () => {

            const detail = {
                productUuid: "1",
                productName: "ノートPC",
            };

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                json: async () => detail,
            } as Response);

            const result =
                await repository.getProductDetail("1");

            expect(result).toEqual(detail);
        });

        it("APIエラーメッセージを取得できる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                json: async () => ({
                    message: "商品が存在しません。",
                }),
            } as Response);

            await expect(
                repository.getProductDetail("1"),
            ).rejects.toThrow(
                "商品が存在しません。",
            );
        });

    });

    describe("addProduct", () => {

        it("商品登録できる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
            } as Response);

            await expect(
                repository.addProduct({} as any),
            ).resolves.toBeUndefined();
        });

        it("登録失敗で例外になる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 500,
            } as Response);

            await expect(
                repository.addProduct({} as any),
            ).rejects.toThrow(
                "商品の登録に失敗しました。(status : 500)",
            );
        });

    });

    describe("updateProduct", () => {

        it("商品更新できる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
            } as Response);

            await expect(
                repository.updateProduct("1", {} as any),
            ).resolves.toBeUndefined();
        });

        it("更新失敗で例外になる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 500,
            } as Response);

            await expect(
                repository.updateProduct("1", {} as any),
            ).rejects.toThrow(
                "商品の更新に失敗しました。(status : 500)",
            );
        });

    });

    describe("deleteProduct", () => {

        it("商品削除できる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
            } as Response);

            await expect(
                repository.deleteProduct("1"),
            ).resolves.toBeUndefined();
        });

        it("削除失敗で例外になる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 500,
            } as Response);

            await expect(
                repository.deleteProduct("1"),
            ).rejects.toThrow(
                "商品の削除に失敗しました。(status : 500)",
            );
        });

    });

});