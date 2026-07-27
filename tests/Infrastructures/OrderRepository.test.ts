import { describe, it, expect, vi, beforeEach } from "vitest";

import { OrderRepository } from "@/infrastructures/OrderRepository";


describe("OrderRepository", () => {
    let repository: OrderRepository;


    beforeEach(() => {
        repository = new OrderRepository();

        // fetchモックをリセット
        vi.resetAllMocks();
    });


    /**
     * 正常系
     */
    describe("searchOrderHistories 正常系", () => {

        it("条件なしで購入履歴を取得できる", async () => {

            const mockData = [
                {
                    orderId: "001",
                    customerName: "山田太郎",
                },
            ];


            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json: vi.fn().mockResolvedValue(mockData),
                }),
            );


            const result =
                await repository.searchOrderHistories();


            expect(fetch)
                .toHaveBeenCalledWith(
                    "/proxy-api/orders",
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );


            expect(result)
                .toEqual(mockData);
        });



        it("購入日を指定して検索できる", async () => {

            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json: vi.fn().mockResolvedValue([]),
                }),
            );


            await repository.searchOrderHistories(
                "2026-07-27",
            );


            expect(fetch)
                .toHaveBeenCalledWith(
                    "/proxy-api/orders?PurchaseDate=2026-07-27",
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
        });



        it("顧客アカウント名を指定して検索できる", async () => {

            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json: vi.fn().mockResolvedValue([]),
                }),
            );


            await repository.searchOrderHistories(
                undefined,
                "test-user",
            );


            expect(fetch)
                .toHaveBeenCalledWith(
                    "/proxy-api/orders?CustomerAccountName=test-user",
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
        });



        it("購入日と顧客名を指定して検索できる", async () => {

            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json: vi.fn().mockResolvedValue([]),
                }),
            );


            await repository.searchOrderHistories(
                "2026-07-27",
                "test-user",
            );


            expect(fetch)
                .toHaveBeenCalledWith(
                    "/proxy-api/orders?PurchaseDate=2026-07-27&CustomerAccountName=test-user",
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
        });

    });



    /**
     * 異常系
     */
    describe("searchOrderHistories 異常系", () => {


        it("APIが500エラーの場合例外になる", async () => {

            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    status: 500,
                    json:
                        vi.fn().mockResolvedValue({}),
                }),
            );


            await expect(
                repository.searchOrderHistories(),
            )
                .rejects
                .toThrow(
                    "購入履歴の検索に失敗しました。(status : 500)",
                );

        });



        it("APIエラー時にmessageがある場合その内容を返す", async () => {

            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    status: 400,
                    json:
                        vi.fn().mockResolvedValue({
                            message:
                                "購入履歴が存在しません",
                        }),
                }),
            );


            await expect(
                repository.searchOrderHistories(),
            )
                .rejects
                .toThrow(
                    "購入履歴が存在しません",
                );

        });



        it("APIエラー時にmessageがない場合fallbackMessageを返す", async () => {

            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    status: 400,
                    json:
                        vi.fn().mockResolvedValue({}),
                }),
            );


            await expect(
                repository.searchOrderHistories(),
            )
                .rejects
                .toThrow(
                    "購入履歴の検索に失敗しました。(status : 400)",
                );

        });



        it("APIレスポンスがJSONではない場合fallbackMessageを返す", async () => {

            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: false,
                    status: 500,
                    json:
                        vi.fn().mockRejectedValue(
                            new Error("invalid json"),
                        ),
                }),
            );


            await expect(
                repository.searchOrderHistories(),
            )
                .rejects
                .toThrow(
                    "購入履歴の検索に失敗しました。(status : 500)",
                );

        });



        it("API成功でも配列以外の場合エラーになる", async () => {

            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    json:
                        vi.fn().mockResolvedValue({
                            orderId: "001",
                        }),
                }),
            );


            await expect(
                repository.searchOrderHistories(),
            )
                .rejects
                .toThrow(
                    "購入履歴検索APIのレスポンス形式が不正です。",
                );

        });

    });


});