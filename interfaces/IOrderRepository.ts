import type { OrderHistory } from "@/models/OrderHistory";

/**
 * 注文リポジトリインターフェース
 */
export interface IOrderRepository {
  /**
   * 指定した条件で購入履歴を検索する
   *
   * @param purchaseDate 購入日（yyyy-MM-dd）
   * @param customerAccountName 顧客アカウント名
   * @returns 検索条件に一致する購入履歴一覧
   */
  searchOrderHistories(
    purchaseDate?: string,
    customerAccountName?: string,
  ): Promise<OrderHistory[]>;
}