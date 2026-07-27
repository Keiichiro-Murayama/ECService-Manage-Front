/**
 * 商品登録情報を表すインターフェース
 * 商品登録APIのリクエストに対応するデータ構造を定義します。
 */
export interface ProductRegisterRequest {
  /** 商品名 */
  productName: string;

  /** 商品の価格 */
  price: number;

  /** 商品の在庫数 */
  stock: number;

  /** 商品のカテゴリID */
  categoryUuid: string;

  /** 登録する商品画像 */
  image: File; //石原:変更 画像URLではなく選択した画像ファイルを保持する
}