import { describe, it, expect, vi, beforeEach } from "vitest";

import { ProductRepository } from "@/infrastructures/ProductRepository";
import { ProductRegisterRequest } from "@/models/ProductRegisterRequest";
import { ProductUpdateRequest } from "@/models/ProductUpdateRequest";

describe("ProductRepository", () => {

    let repository: ProductRepository;


    beforeEach(() => {
        repository = new ProductRepository();

        vi.resetAllMocks();
    });



    describe("searchProducts", () => {


        it("商品一覧を取得できる", async () => {

            const mockProducts = [
                {
                    productUuid: "001",
                    productName: "商品A",
                },
            ];


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json:
                        vi.fn().mockResolvedValue(mockProducts),
                }),
            );


            const result =
                await repository.searchProducts();


            expect(fetch)
                .toHaveBeenCalledWith(
                    "/proxy-api/products",
                    {
                        credentials: "include",
                    },
                );


            expect(result)
                .toEqual(mockProducts);

        });



        it("カテゴリUUID指定で商品検索できる", async () => {


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json:
                        vi.fn().mockResolvedValue([]),
                }),
            );


            await repository.searchProducts(
                "category-001",
            );


            expect(fetch)
                .toHaveBeenCalledWith(
                    "/proxy-api/products?categoryUuid=category-001",
                    {
                        credentials: "include",
                    },
                );

        });



        it("商品検索APIが配列以外の場合エラーになる", async () => {


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json:
                        vi.fn().mockResolvedValue({
                            productUuid: "001",
                        }),
                }),
            );


            await expect(
                repository.searchProducts(),
            )
                .rejects
                .toThrow(
                    "商品検索APIのレスポンス形式が不正です。",
                );

        });



        it("商品検索APIが失敗した場合エラーになる", async () => {


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    status: 500,
                }),
            );


            await expect(
                repository.searchProducts(),
            )
                .rejects
                .toThrow(
                    "商品の検索に失敗しました。(status : 500)",
                );

        });

    });





    describe("getProductDetail", () => {


        it("商品詳細を取得できる", async () => {


            const mockDetail = {
                productUuid: "001",
                productName: "商品A",
            };


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json:
                        vi.fn().mockResolvedValue(mockDetail),
                }),
            );


            const result =
                await repository.getProductDetail(
                    "001",
                );


            expect(fetch)
                .toHaveBeenCalledWith(
                    "/proxy-api/products/info?productUuid=001",
                    {
                        credentials: "include",
                    },
                );


            expect(result)
                .toEqual(mockDetail);

        });



        it("商品詳細取得に失敗した場合エラーになる", async () => {


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    status: 404,
                }),
            );


            await expect(
                repository.getProductDetail("001"),
            )
                .rejects
                .toThrow(
                    "商品の詳細取得に失敗しました。(status : 404)",
                );

        });


    });





    describe("addProduct", () => {


        it("商品登録時にFormDataで送信される", async () => {


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                }),
            );


            const image =
                new File(
                    ["image"],
                    "test.png",
                    {
                        type: "image/png",
                    },
                );


            const request = {

                productName: "商品A",

                price: 1000,

                stock: 10,

                categoryUuid: "category001",

                image,

            };


            await repository.addProduct(
                request,
            );


            const fetchMock =
                vi.mocked(fetch);


            const call =
                fetchMock.mock.calls[0];


            expect(call[0])
                .toBe(
                    "/proxy-api/products",
                );


            expect(call[1]?.method)
                .toBe("POST");


            expect(call[1]?.credentials)
                .toBe("include");


            expect(
                call[1]?.body,
            )
                .toBeInstanceOf(FormData);



            const body =
                call[1]?.body as FormData;


            expect(
                body.get("productName"),
            )
                .toBe("商品A");


            expect(
                body.get("price"),
            )
                .toBe("1000");


            expect(
                body.get("stock"),
            )
                .toBe("10");


            expect(
                body.get("categoryUuid"),
            )
                .toBe("category001");


            expect(
                body.get("image"),
            )
                .toBe(image);

        });





        it("商品登録失敗時にステータスエラーになる", async () => {


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    status: 400,
                    json:
                        vi.fn().mockResolvedValue({}),
                }),
            );


            const request: ProductRegisterRequest = {
                productName: "商品A",
                price: 1000,
                stock: 10,
                categoryUuid: "001",
                image: new File(
                    ["image"],
                    "test.png",
                ),
            };

            await expect(
                repository.addProduct(request),
            )
                .rejects
                .toThrow(
                    "商品の登録に失敗しました。(status : 400)",
                );

        });





        it("商品登録APIがmessageを返した場合その内容を返す", async () => {


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    status: 409,
                    json:
                        vi.fn().mockResolvedValue({
                            message:
                                "商品名が重複しています",
                        }),
                }),
            );


            const request: ProductRegisterRequest = {
                productName: "商品A",
                price: 1000,
                stock: 10,
                categoryUuid: "001",
                image: new File(
                    ["image"],
                    "test.png",
                ),
            };

            await expect(
                repository.addProduct(request),
            )
                .rejects
                .toThrow(
                    "商品名が重複しています",
                );

        });


    });






    describe("updateProduct", () => {


        it("商品更新が成功する", async () => {

            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                }),
            );


            const update = {
                productUuid: "001",
                productName: "変更商品",
                price: 2000,
                stock: 20,
                categoryUuid: "category001",
                imageUrl: "https://example.com/image.png",
            };


            await repository.updateProduct(
                "001",
                update,
            );


            expect(fetch)
                .toHaveBeenCalledWith(
                    "/proxy-api/products/update?productUuid=001",
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(update),
                        credentials: "include",
                    },
                );

        });


        it("商品更新失敗時エラーになる", async () => {
            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    status: 500,
                }),
            );

            const request: ProductUpdateRequest = {
                productUuid: "001",
                productName: "商品A",
                price: 1000,
                stock: 10,
                categoryUuid: "001",
                imageUrl: "test.png",
            };

            await expect(
                repository.updateProduct(
                    "001",
                    request,
                ),
            )
                .rejects
                .toThrow(
                    "商品の更新に失敗しました。(status : 500)",
                );
        });


    });






    describe("deleteProduct", () => {


        it("商品削除が成功する", async () => {


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                }),
            );


            await repository.deleteProduct(
                "001",
            );


            expect(fetch)
                .toHaveBeenCalledWith(
                    "/proxy-api/products/delete?productUuid=001",
                    {
                        method: "DELETE",
                        credentials: "include",
                    },
                );


        });



        it("商品削除失敗時エラーになる", async () => {


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    status: 500,
                }),
            );


            await expect(
                repository.deleteProduct("001"),
            )
                .rejects
                .toThrow(
                    "商品の削除に失敗しました。(status : 500)",
                );


        });


    });


});