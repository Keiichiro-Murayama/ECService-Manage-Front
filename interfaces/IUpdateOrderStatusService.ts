import type { OrderStatusUpdateData } from
  "@/models/OrderStatusUpdateData";

import type { UpdateOrderStatusResponse } from
  "@/models/UpdateOrderStatusResponse";

/**
 * 注文ステータス更新サービス
 */
export interface IUpdateOrderStatusService {
  /**
   * 注文ステータス更新画面の初期表示情報を取得する
   *
   * @param orderUuid 注文UUID
   */
  getInitialData(
    orderUuid: string,
  ): Promise<OrderStatusUpdateData>;

  /**
   * 注文ステータスを更新する
   *
   * @param orderUuid 注文UUID
   * @param orderStatusId 更新後の注文ステータスID
   */
  update(
    orderUuid: string,
    orderStatusId: number,
  ): Promise<UpdateOrderStatusResponse>;
}