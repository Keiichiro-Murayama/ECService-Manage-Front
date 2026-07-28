/**
 * 購入履歴検索APIから返される注文情報
 */
export interface OrderHistory {
  /**
   * 注文UUID
   */
  orderUuid: string;

  /**
   * 購入日時
   *
   * APIからISO 8601形式の文字列で返される。
   */
  purchaseDate: string;

  /**
   * 顧客アカウント名
   */
  customerAccountName: string;

  /**
   * 注文内容
   */
  orderContent: string;

  /**
   * 注文ステータス
   */
  orderStatus: string;
}