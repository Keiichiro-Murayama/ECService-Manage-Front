import "reflect-metadata";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { IOrderRepository } from "@/interfaces/IOrderRepository";
import type { OrderStatusUpdateData } from "@/models/OrderStatusUpdateData";
import type { UpdateOrderStatusResponse } from "@/models/UpdateOrderStatusResponse";
import { UpdateOrderStatusService } from "@/services/UpdateOrderStatusService";

/**
 * 注文Repositoryのモックを作成する
 */
const createOrderRepositoryMock = () =>
  ({
    searchOrderHistories:
      vi.fn<
        IOrderRepository["searchOrderHistories"]
      >(),

    getOrderStatusUpdateData:
      vi.fn<
        IOrderRepository["getOrderStatusUpdateData"]
      >(),

    updateOrderStatus:
      vi.fn<
        IOrderRepository["updateOrderStatus"]
      >(),
  }) satisfies IOrderRepository;

describe("UpdateOrderStatusService", () => {
  let orderRepository:
    ReturnType<
      typeof createOrderRepositoryMock
    >;

  let service:
    UpdateOrderStatusService;

  const orderUuid =
    "11111111-1111-1111-1111-111111111111";

  const initialData:
    OrderStatusUpdateData = {
      orderUuid,

      orderDate:
        "2026-07-28T10:00:00Z",

      customerAccountName:
        "customer01",

      orderContent:
        "商品A × 1",

      currentOrderStatusId: 1,

      currentOrderStatusName:
        "注文受付",

      orderStatuses: [
        {
          orderStatusId: 1,
          orderStatusName:
            "注文受付",
        },
        {
          orderStatusId: 2,
          orderStatusName:
            "発送準備中",
        },
        {
          orderStatusId: 3,
          orderStatusName:
            "発送済み",
        },
      ],
    };

  const updateResponse:
    UpdateOrderStatusResponse = {
      orderUuid,

      orderStatusId: 2,

      orderStatusName:
        "発送準備中",

      updatedAt:
        "2026-07-28T11:00:00Z",
    };

  beforeEach(() => {
    orderRepository =
      createOrderRepositoryMock();

    service =
      new UpdateOrderStatusService(
        orderRepository,
      );
  });

  describe("getInitialData", () => {
    it(
      "注文UUIDの前後の空白を除去して初期表示情報を取得する",
      async () => {
        orderRepository
          .getOrderStatusUpdateData
          .mockResolvedValue(
            initialData,
          );

        const result =
          await service.getInitialData(
            `  ${orderUuid}  `,
          );

        expect(result).toEqual(
          initialData,
        );

        expect(
          orderRepository
            .getOrderStatusUpdateData,
        ).toHaveBeenCalledTimes(1);

        expect(
          orderRepository
            .getOrderStatusUpdateData,
        ).toHaveBeenCalledWith(
          orderUuid,
        );
      },
    );

    it(
      "注文UUIDが空の場合はエラーにする",
      async () => {
        await expect(
          service.getInitialData(
            "   ",
          ),
        ).rejects.toThrow(
          "注文UUIDが指定されていません。",
        );

        expect(
          orderRepository
            .getOrderStatusUpdateData,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "初期表示情報の取得に失敗した場合はRepositoryのエラーを通知する",
      async () => {
        const repositoryError =
          new Error(
            "注文情報の取得に失敗しました。",
          );

        orderRepository
          .getOrderStatusUpdateData
          .mockRejectedValue(
            repositoryError,
          );

        await expect(
          service.getInitialData(
            orderUuid,
          ),
        ).rejects.toBe(
          repositoryError,
        );

        expect(
          orderRepository
            .getOrderStatusUpdateData,
        ).toHaveBeenCalledWith(
          orderUuid,
        );
      },
    );
  });

  describe("update", () => {
    it(
      "注文UUIDとステータスIDをRepositoryへ渡して更新する",
      async () => {
        orderRepository
          .updateOrderStatus
          .mockResolvedValue(
            updateResponse,
          );

        const result =
          await service.update(
            `  ${orderUuid}  `,
            2,
          );

        expect(result).toEqual(
          updateResponse,
        );

        expect(
          orderRepository
            .updateOrderStatus,
        ).toHaveBeenCalledTimes(1);

        expect(
          orderRepository
            .updateOrderStatus,
        ).toHaveBeenCalledWith(
          orderUuid,
          2,
        );
      },
    );

    it(
      "注文UUIDが空の場合は更新しない",
      async () => {
        await expect(
          service.update(
            "   ",
            2,
          ),
        ).rejects.toThrow(
          "注文UUIDが指定されていません。",
        );

        expect(
          orderRepository
            .updateOrderStatus,
        ).not.toHaveBeenCalled();
      },
    );

    it.each([
      {
        orderStatusId: 0,
        caseName:
          "0の場合",
      },
      {
        orderStatusId: -1,
        caseName:
          "負数の場合",
      },
      {
        orderStatusId: 1.5,
        caseName:
          "小数の場合",
      },
    ])(
      "注文ステータスIDが$caseNameはエラーにする",
      async ({
        orderStatusId,
      }) => {
        await expect(
          service.update(
            orderUuid,
            orderStatusId,
          ),
        ).rejects.toThrow(
          "注文ステータスを選択してください。",
        );

        expect(
          orderRepository
            .updateOrderStatus,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "更新に失敗した場合はRepositoryのエラーを通知する",
      async () => {
        const repositoryError =
          new Error(
            "注文ステータスの更新に失敗しました。",
          );

        orderRepository
          .updateOrderStatus
          .mockRejectedValue(
            repositoryError,
          );

        await expect(
          service.update(
            orderUuid,
            2,
          ),
        ).rejects.toBe(
          repositoryError,
        );

        expect(
          orderRepository
            .updateOrderStatus,
        ).toHaveBeenCalledWith(
          orderUuid,
          2,
        );
      },
    );
  });
});