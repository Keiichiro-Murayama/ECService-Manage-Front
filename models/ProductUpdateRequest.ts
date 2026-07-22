/**
 * ProductUpdateRequest
 * 商品情報の更新リクエストに対応するデータ構造を定義します。
 */

export interface ProductUpdateRequest {
  /** 商品UUID */
  productUuid: string;
  /** 商品の価格 */
  price: number;
  /** 商品の在庫数 */
  stock: number;
  /** 商品のカテゴリID */
  categoryId: string;
  /** 商品の画像URL */
  imageUrl: string;
}
