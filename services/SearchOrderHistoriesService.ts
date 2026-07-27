import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type { IOrderRepository } from
  "@/interfaces/IOrderRepository";
import type { ISearchOrderHistoriesService } from
  "@/interfaces/ISearchOrderHistoriesService";
import type { OrderHistory } from
  "@/models/OrderHistory";

/**
 * 購入履歴検索画面で必要となる処理を管理するサービス
 */
@injectable()
export class SearchOrderHistoriesService
  implements ISearchOrderHistoriesService
{
  /**
   * コンストラクタ
   *
   * @param orderRepository 注文リポジトリ
   */
  constructor(
    @inject(TYPES.IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  /**
   * 購入履歴検索画面の初期表示データを取得する
   *
   * @returns 全購入履歴
   */
  async getInitialData(): Promise<OrderHistory[]> {
    return await this.orderRepository
      .searchOrderHistories();
  }

  /**
   * 指定した条件で購入履歴を検索する
   *
   * 検索条件の前後にある空白を除去してRepositoryへ渡す。
   *
   * @param purchaseDate 購入日（yyyy-MM-dd）
   * @param customerAccountName 顧客アカウント名
   * @returns 検索条件に一致する購入履歴一覧
   */
  async search(
    purchaseDate?: string,
    customerAccountName?: string,
  ): Promise<OrderHistory[]> {
    const normalizedPurchaseDate =
      purchaseDate?.trim() || undefined;

    const normalizedCustomerAccountName =
      customerAccountName?.trim() || undefined;

    return await this.orderRepository
      .searchOrderHistories(
        normalizedPurchaseDate,
        normalizedCustomerAccountName,
      );
  }
}