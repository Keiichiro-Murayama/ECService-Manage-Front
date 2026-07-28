import {
  inject,
  injectable,
} from "inversify";

import { TYPES } from "@/di/types";

import type { IOrderRepository } from
  "@/interfaces/IOrderRepository";

import type { IUpdateOrderStatusService } from
  "@/interfaces/IUpdateOrderStatusService";

import type { OrderStatusUpdateData } from
  "@/models/OrderStatusUpdateData";

import type { UpdateOrderStatusResponse } from
  "@/models/UpdateOrderStatusResponse";

/**
 * 注文ステータス更新処理を管理するサービス
 */
@injectable()
export class UpdateOrderStatusService
  implements IUpdateOrderStatusService
{
  /**
   * コンストラクタ
   */
  constructor(
    @inject(TYPES.IOrderRepository)
    private readonly orderRepository:
      IOrderRepository,
  ) {}

  /**
   * 注文ステータス更新画面の初期表示情報を取得する
   */
  async getInitialData(
    orderUuid: string,
  ): Promise<OrderStatusUpdateData> {
    const normalizedOrderUuid =
      this.normalizeOrderUuid(orderUuid);

    return this.orderRepository
      .getOrderStatusUpdateData(
        normalizedOrderUuid,
      );
  }

  /**
   * 注文ステータスを更新する
   */
  async update(
    orderUuid: string,
    orderStatusId: number,
  ): Promise<UpdateOrderStatusResponse> {
    const normalizedOrderUuid =
      this.normalizeOrderUuid(orderUuid);

    if (
      !Number.isInteger(orderStatusId) ||
      orderStatusId < 1
    ) {
      throw new Error(
        "注文ステータスを選択してください。",
      );
    }

    return this.orderRepository
      .updateOrderStatus(
        normalizedOrderUuid,
        orderStatusId,
      );
  }

  /**
   * 注文UUIDを検証して前後の空白を除去する
   */
  private normalizeOrderUuid(
    orderUuid: string,
  ): string {
    const normalizedOrderUuid =
      orderUuid.trim();

    if (normalizedOrderUuid === "") {
      throw new Error(
        "注文UUIDが指定されていません。",
      );
    }

    return normalizedOrderUuid;
  }
}