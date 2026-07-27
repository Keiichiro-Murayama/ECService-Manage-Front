import type { OrderHistory } from "@/models/OrderHistory";

/**
 * 購入履歴検索サービスインターフェース
 */
export interface ISearchOrderHistoriesService {
  /**
   * 購入履歴検索画面の初期表示データを取得する
   *
   * @returns 全購入履歴
   */
  getInitialData(): Promise<OrderHistory[]>;

  /**
   * 指定した条件で購入履歴を検索する
   *
   * @param purchaseDate 購入日（yyyy-MM-dd）
   * @param customerAccountName 顧客アカウント名
   * @returns 検索条件に一致する購入履歴一覧
   */
  search(
    purchaseDate?: string,
    customerAccountName?: string,
  ): Promise<OrderHistory[]>;
}