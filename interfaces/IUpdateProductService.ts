import type { Category } from "@/models/Category";
import type { ProductDetail } from "@/models/ProductDetail";
import type { ProductUpdateRequest } from "@/models/ProductUpdateRequest";

/**
 * 商品修正画面の初期表示データ
 */
export type UpdateProductInitialData = {
  /** 修正対象の商品情報 */
  product: ProductDetail;

  /** 商品カテゴリ一覧 */
  categories: Category[];
};

/**
 * 商品修正サービスのインターフェース
 */
export interface IUpdateProductService {
  /**
   * 商品修正画面の初期表示データを取得する
   *
   * @param productUuid 商品UUID
   */
  getInitialData(
    productUuid: string,
  ): Promise<UpdateProductInitialData>;

  /**
   * 商品情報を更新する
   *
   * @param productUuid 商品UUID
   * @param product 更新する商品情報
   */
  update(
    productUuid: string,
    product: ProductUpdateRequest,
  ): Promise<void>;
}