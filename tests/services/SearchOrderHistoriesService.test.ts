import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { IOrderRepository } from
  "@/interfaces/IOrderRepository";
import type { OrderHistory } from
  "@/models/OrderHistory";
import { SearchOrderHistoriesService } from
  "@/services/SearchOrderHistoriesService";

/**
 * 購入履歴のテストデータ
 */
const ORDER_HISTORIES: OrderHistory[] = [
  {
    orderUuid:
      "550e8400-e29b-41d4-a716-446655440000",
    purchaseDate:
      "2026-07-21T10:30:00+09:00",
    customerAccountName: "Yamada",
    orderContent:
      "高級ボールペン × 1、耐水ノート × 2",
    orderStatus: "注文受付",
  },
];

/**
 * 注文リポジトリのモックを生成する
 */
const createOrderRepositoryMock =
  (): IOrderRepository => {
    return {
      searchOrderHistories: vi.fn(),
    };
  };

describe("SearchOrderHistoriesService", () => {
  let orderRepository: IOrderRepository;
  let service: SearchOrderHistoriesService;

  beforeEach(() => {
    orderRepository =
      createOrderRepositoryMock();

    service =
      new SearchOrderHistoriesService(
        orderRepository,
      );
  });

  describe("getInitialData", () => {
    it(
      "初期表示時に検索条件なしで全購入履歴を取得する",
      async () => {
        // Arrange
        vi.mocked(
          orderRepository.searchOrderHistories,
        ).mockResolvedValue(ORDER_HISTORIES);

        // Act
        const result =
          await service.getInitialData();

        // Assert
        expect(result).toEqual(ORDER_HISTORIES);
        expect(
          orderRepository.searchOrderHistories,
        ).toHaveBeenCalledTimes(1);
        expect(
          orderRepository.searchOrderHistories,
        ).toHaveBeenCalledWith();
      },
    );

    it(
      "購入履歴が0件の場合は空配列を返す",
      async () => {
        // Arrange
        vi.mocked(
          orderRepository.searchOrderHistories,
        ).mockResolvedValue([]);

        // Act
        const result =
          await service.getInitialData();

        // Assert
        expect(result).toEqual([]);
      },
    );

    it(
      "購入履歴取得で例外が発生した場合、その例外を呼び出し元へ伝播する",
      async () => {
        // Arrange
        vi.mocked(
          orderRepository.searchOrderHistories,
        ).mockRejectedValue(
          new Error(
            "注文情報の取得に失敗しました",
          ),
        );

        // Act・Assert
        await expect(
          service.getInitialData(),
        ).rejects.toThrow(
          "注文情報の取得に失敗しました",
        );
      },
    );
  });

  describe("search", () => {
    it(
      "購入日と顧客アカウント名を指定した場合、AND検索条件としてRepositoryへ渡す",
      async () => {
        // Arrange
        vi.mocked(
          orderRepository.searchOrderHistories,
        ).mockResolvedValue(ORDER_HISTORIES);

        // Act
        const result = await service.search(
          "2026-07-21",
          "Yamada",
        );

        // Assert
        expect(result).toEqual(ORDER_HISTORIES);
        expect(
          orderRepository.searchOrderHistories,
        ).toHaveBeenCalledWith(
          "2026-07-21",
          "Yamada",
        );
      },
    );

    it(
      "購入日のみ指定した場合、顧客アカウント名を未指定としてRepositoryへ渡す",
      async () => {
        // Arrange
        vi.mocked(
          orderRepository.searchOrderHistories,
        ).mockResolvedValue(ORDER_HISTORIES);

        // Act
        await service.search(
          "2026-07-21",
        );

        // Assert
        expect(
          orderRepository.searchOrderHistories,
        ).toHaveBeenCalledWith(
          "2026-07-21",
          undefined,
        );
      },
    );

    it(
      "顧客アカウント名の前後に空白がある場合、空白を除去してRepositoryへ渡す",
      async () => {
        // Arrange
        vi.mocked(
          orderRepository.searchOrderHistories,
        ).mockResolvedValue(ORDER_HISTORIES);

        // Act
        await service.search(
          undefined,
          "  Yamada  ",
        );

        // Assert
        expect(
          orderRepository.searchOrderHistories,
        ).toHaveBeenCalledWith(
          undefined,
          "Yamada",
        );
      },
    );

    it(
      "検索条件が空白のみの場合、両方を未指定としてRepositoryへ渡す",
      async () => {
        // Arrange
        vi.mocked(
          orderRepository.searchOrderHistories,
        ).mockResolvedValue(ORDER_HISTORIES);

        // Act
        await service.search("   ", "   ");

        // Assert
        expect(
          orderRepository.searchOrderHistories,
        ).toHaveBeenCalledWith(
          undefined,
          undefined,
        );
      },
    );

    it(
      "購入履歴検索で例外が発生した場合、その例外を呼び出し元へ伝播する",
      async () => {
        // Arrange
        vi.mocked(
          orderRepository.searchOrderHistories,
        ).mockRejectedValue(
          new Error(
            "購入履歴の検索に失敗しました。",
          ),
        );

        // Act・Assert
        await expect(
          service.search(
            "2026-07-21",
            "Yamada",
          ),
        ).rejects.toThrow(
          "購入履歴の検索に失敗しました。",
        );
      },
    );
  });
});