import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { IProductRepository } from "@/interfaces/IProductRepository";
import type {
  IUpdateProductService,
  UpdateProductInitialData,
} from "@/interfaces/IUpdateProductService";
import type { ProductUpdateRequest } from "@/models/ProductUpdateRequest";

/**
 * 商品修正処理を管理するサービス
 */
@injectable()
export class UpdateProductService
  implements IUpdateProductService
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
   * 商品修正画面の初期表示データを取得する
   *
   * @param productUuid 商品UUID
   */
  async getInitialData(
    productUuid: string,
  ): Promise<UpdateProductInitialData> {
    const normalizedProductUuid =
      this.normalizeProductUuid(productUuid);

    const [product, categories] = await Promise.all([
      this.productRepository.getProductDetail(
        normalizedProductUuid,
      ),
      this.categoryRepository.getAllCategories(),
    ]);

    return {
      product,
      categories,
    };
  }

  /**
   * 商品情報を更新する
   *
   * @param productUuid 商品UUID
   * @param product 更新する商品情報
   */
  async update(
    productUuid: string,
    product: ProductUpdateRequest,
  ): Promise<void> {
    const normalizedProductUuid =
      this.normalizeProductUuid(productUuid);

    await this.productRepository.updateProduct(
      normalizedProductUuid,
      product,
    );
  }

  /**
   * 商品UUIDを検証する
   *
   * @param productUuid 商品UUID
   */
  private normalizeProductUuid(
    productUuid: string,
  ): string {
    const normalizedProductUuid = productUuid.trim();

    if (normalizedProductUuid === "") {
      throw new Error(
        "商品UUIDが指定されていません。",
      );
    }

    return normalizedProductUuid;
  }
}