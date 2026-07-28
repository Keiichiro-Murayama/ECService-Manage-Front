import { TYPES } from "@/di/types";
import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { IProductRepository } from "@/interfaces/IProductRepository";
import type {
  ISearchProductsService,
  ProductSearchInitialData,
} from "@/interfaces/ISearchProductsService";
import type { Product } from "@/models/Product";
import { inject, injectable } from "inversify";

/**
 * 商品検索画面で必要となる処理を統括するサービス
 */
@injectable()
export class SearchProductsService
  implements ISearchProductsService
{
  /**
   * コンストラクタ
   *
   * @param productRepository 商品リポジトリ
   * @param categoryRepository カテゴリリポジトリ
   */
  constructor(
    @inject(TYPES.IProductRepository)
    private readonly productRepository: IProductRepository,

    @inject(TYPES.ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  /**
   * 商品検索画面の初期表示データを取得する
   *
   * カテゴリ一覧と全商品一覧を並行して取得する。
   *
   * @returns カテゴリ一覧と全商品一覧
   */
  async getInitialData(): Promise<ProductSearchInitialData> {
    const [categories, products] = await Promise.all([
      this.categoryRepository.getAllCategories(),
      this.productRepository.searchProducts(),
    ]);

    return {
      categories,
      products,
    };
  }

  /**
   * 商品を検索する
   *
   * カテゴリUUIDが指定されている場合はカテゴリ別検索を行い、
   * 未指定の場合は全商品を取得する。
   *
   * @param categoryUuid カテゴリUUID
   * @returns 検索結果の商品一覧
   */
  async search(categoryUuid?: string): Promise<Product[]> {
    const normalizedCategoryUuid = categoryUuid?.trim();

    return await this.productRepository.searchProducts(
      normalizedCategoryUuid || undefined,
    );
  }
}