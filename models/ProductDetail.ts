/**
 * 商品情報を表すインターフェース
 * 商品詳細取得APIのレスポンスに対応するデータ構造を定義します。
 */
export interface ProductDetail {
  /** 商品のUUID */
  productUuid: string;
  /** 商品名 */
  productName: string;
  /** 商品の価格 */
  price: number;
  /** 商品の在庫数 */
  stock: number;
  /** 商品のカテゴリID */
  categoryUuid: string;
  /** 商品の画像URL */
  imageUrl: string;
}
