/**
 * 注文ステータスの選択肢
 */
export interface OrderStatusOption {
  /** 注文ステータスID */
  orderStatusId: number;

  /** 注文ステータス名 */
  orderStatusName: string;
}

/**
 * 注文ステータス更新画面の表示情報
 */
export interface OrderStatusUpdateData {
  /** 注文UUID */
  orderUuid: string;

  /** 購入日時 */
  orderDate: string;

  /** 顧客アカウント名 */
  customerAccountName: string;

  /** 注文内容 */
  orderContent: string;

  /** 現在の注文ステータスID */
  currentOrderStatusId: number;

  /** 現在の注文ステータス名 */
  currentOrderStatusName: string;

  /** 選択可能な注文ステータス一覧 */
  orderStatuses: OrderStatusOption[];
}