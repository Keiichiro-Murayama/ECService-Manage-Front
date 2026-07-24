/**
 * 商品UUIDによる商品検索APIのレスポンスに対応するデータ構造を定義します。
 */
export interface SearchProductsByProductUuidResponse {
  /** 商品UUID*/
  productUuid: string;
  /** 商品名 */
  productName: string;
  /** 商品の価格 */
  price: number;
  /** 商品の画像URL */
  imageUrl: string;
}
