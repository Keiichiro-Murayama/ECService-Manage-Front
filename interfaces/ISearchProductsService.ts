import type { Category } from "@/models/Category";
import type { Product } from "@/models/Product";

/**
 * 商品検索画面の初期表示データ
 */
export type ProductSearchInitialData = {
  categories: Category[];
  products: Product[];
};

/**
 * 商品検索サービスインターフェース
 */
export interface ISearchProductsService {
  /**
   * 商品検索画面の初期表示データを取得する
   *
   * カテゴリ一覧と全商品一覧を取得する。
   *
   * @returns カテゴリ一覧と商品一覧
   */
  getInitialData(): Promise<ProductSearchInitialData>;

  /**
   * 商品を検索する
   *
   * カテゴリUUIDが指定された場合はカテゴリ別に検索し、
   * 指定されなかった場合は全商品を取得する。
   *
   * @param categoryUuid カテゴリUUID
   * @returns 検索結果の商品一覧
   */
  search(categoryUuid?: string): Promise<Product[]>;
}