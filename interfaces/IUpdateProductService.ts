import type { Category } from "@/models/Category";
import type { ProductDetail } from "@/models/ProductDetail";
import type { ProductUpdateRequest } from "@/models/ProductUpdateRequest";

/**
 * 商品修正画面の初期表示データ
 */
export interface UpdateProductInitialData {
  product: ProductDetail;
  categories: Category[];
}

/**
 * 商品修正サービス
 */
export interface IUpdateProductService {
  /**
   * 商品情報とカテゴリ一覧を取得する
   */
  getInitialData(
    productUuid: string,
  ): Promise<UpdateProductInitialData>;

  /**
   * 商品情報を更新する
   */
  update(
    productUuid: string,
    product: ProductUpdateRequest,
    newImage: File | null,
  ): Promise<void>;
}