/**
 * 注文ステータス更新リクエスト
 */
export interface UpdateOrderStatusRequest {
  /** 更新後の注文ステータスID */
  orderStatusId: number;
}