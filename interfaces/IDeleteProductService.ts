import type { ProductDetail } from "@/models/ProductDetail";

/**
 * 商品削除確認画面に表示する商品情報
 */
export type DeleteProductConfirmationData = ProductDetail & {
  /**
   * 商品カテゴリ名
   */
  categoryName: string;
};

/**
 * 商品削除サービスインターフェース
 */
export interface IDeleteProductService {
  /**
   * 商品削除確認画面に表示する情報を取得する
   *
   * @param productUuid 商品UUID
   * @returns 削除対象の商品情報
   */
  getConfirmationData(
    productUuid: string,
  ): Promise<DeleteProductConfirmationData>;

  /**
   * 商品を削除する
   *
   * @param productUuid 商品UUID
   */
  execute(productUuid: string): Promise<void>;
}