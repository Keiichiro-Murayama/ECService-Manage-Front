import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type {
  DeleteProductConfirmationData,
  IDeleteProductService,
} from "@/interfaces/IDeleteProductService";
import type { IProductRepository } from "@/interfaces/IProductRepository";

/**
 * 商品削除処理を管理するサービス
 */
@injectable()
export class DeleteProductService implements IDeleteProductService {
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
   * 商品削除確認画面に表示する情報を取得する
   *
   * @param productUuid 商品UUID
   * @returns 削除対象の商品情報
   */
  async getConfirmationData(
    productUuid: string,
  ): Promise<DeleteProductConfirmationData> {
    const normalizedProductUuid =
      this.normalizeProductUuid(productUuid);

    /*
     * 商品詳細とカテゴリ一覧は互いに依存しないため、
     * Promise.allを使って並行して取得する。
     */
    const [product, categories] = await Promise.all([
      this.productRepository.getProductDetail(
        normalizedProductUuid,
      ),
      this.categoryRepository.getAllCategories(),
    ]);

    /*
     * 商品が持っているcategoryUuidと一致するカテゴリを探す。
     */
    const category = categories.find(
      (item) =>
        item.categoryUuid === product.categoryUuid,
    );

    /*
     * 商品詳細に、確認画面で表示するカテゴリ名を追加する。
     */
    return {
      ...product,
      categoryName: category?.name ?? "カテゴリ不明",
    };
  }

  /**
   * 商品削除を実行する
   *
   * @param productUuid 商品UUID
   */
  async execute(productUuid: string): Promise<void> {
    const normalizedProductUuid =
      this.normalizeProductUuid(productUuid);

    await this.productRepository.deleteProduct(
      normalizedProductUuid,
    );
  }

  /**
   * 商品UUIDを検証して前後の空白を除去する
   *
   * @param productUuid 商品UUID
   * @returns 正規化した商品UUID
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