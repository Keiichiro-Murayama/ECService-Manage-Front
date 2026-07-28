/**
 * 注文ステータス更新レスポンス
 */
export interface UpdateOrderStatusResponse {
  /** 注文UUID */
  orderUuid: string;

  /** 更新後の注文ステータスID */
  orderStatusId: number;

  /** 更新後の注文ステータス名 */
  orderStatusName: string;

  /** 更新日時 */
  updatedAt: string;
}