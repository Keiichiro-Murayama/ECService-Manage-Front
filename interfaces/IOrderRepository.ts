import type { OrderHistory } from "@/models/OrderHistory";
import type { OrderStatusUpdateData } from "@/models/OrderStatusUpdateData"; //石原:追加
import type { UpdateOrderStatusResponse } from "@/models/UpdateOrderStatusResponse"; //石原:追加

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

   /**
   * 注文ステータス更新画面の表示情報を取得する
   *
   * @param orderUuid 注文UUID
   */
  getOrderStatusUpdateData(
    orderUuid: string,
  ): Promise<OrderStatusUpdateData>; //石原:追加

  /**
   * 注文ステータスを更新する
   *
   * @param orderUuid 注文UUID
   * @param orderStatusId 更新後の注文ステータスID
   */
  updateOrderStatus(
    orderUuid: string,
    orderStatusId: number,
  ): Promise<UpdateOrderStatusResponse>; //石原:追加
}


