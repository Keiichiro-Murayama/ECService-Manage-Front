import { TYPES } from "@/di/types";
import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { IProductRepository } from "@/interfaces/IProductRepository";
import type { IRegisterProductService } from "@/interfaces/IRegisterProductService";
import type { Category } from "@/models/Category";
import type { ProductRegisterRequest } from "@/models/ProductRegisterRequest";
import { inject, injectable } from "inversify";

/**
 * 画像アップロードAPIのレスポンス
 */
type UploadProductImageResponse = {
  imageUrl: string;
};

/**
 * 新商品登録画面で使用する処理を統括するサービス
 */
@injectable()
export class RegisterProductService
  implements IRegisterProductService
{
  /**
   * 商品画像アップロードAPI
   */
  private readonly imageUploadEndpoint =
    "/proxy-api/product-images";

  /**
   * コンストラクタ
   *
   * @param productRepository 商品リポジトリ
   * @param categoryRepository 商品カテゴリリポジトリ
   */
  constructor(
    @inject(TYPES.IProductRepository)
    private readonly productRepository: IProductRepository,

    @inject(TYPES.ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  /**
   * 商品カテゴリ一覧を取得する
   *
   * @returns 商品カテゴリ一覧
   */
  async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.getAllCategories();
  }

  /**
   * 商品画像をアップロードする
   *
   * @param imageFile アップロードする画像ファイル
   * @returns アップロード後の画像URL
   */
  async uploadProductImage(
    imageFile: File,
  ): Promise<string> {
    const formData = new FormData();

    formData.append("image", imageFile);

    const response = await fetch(
      this.imageUploadEndpoint,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(
        `商品画像のアップロードに失敗しました。(status : ${response.status})`,
      );
    }

    const result =
      (await response.json()) as UploadProductImageResponse;

    if (
      typeof result.imageUrl !== "string" ||
      result.imageUrl.trim() === ""
    ) {
      throw new Error(
        "画像アップロードAPIから画像URLが返されませんでした。",
      );
    }

    return result.imageUrl;
  }

  /**
   * 新商品を登録する
   *
   * @param product 登録する商品情報
   */
  async register(
    product: ProductRegisterRequest,
  ): Promise<void> {
    await this.productRepository.addProduct(product);
  }
}

// ⠀⠀⠀⠀⢀⣠⣤⣤⣤⣀⠀⠀⠀⠀⣀⣠⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀
// ⠀⠀⣠⣿⠿⠛⠛⠛⠛⠛⢿⣷⣤⣾⠿⠛⠛⠙⠛⠛⠿⠗⠀⠀⠀⠀
// ⠀⣾⡿⠁⠀⠀⠀⠀⠀⠀⠀⠙⡿⠁⠀⢀⣤⣀⠀⠀⢀⣤⣶⡆⠀⠀
// ⢸⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀
// ⠸⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣧⣄⠀
// ⠀⢹⣿⠀⣿⣷⣄⣀⣤⡄⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⠷
// ⠀⠀⣁⣤⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠘⠛⠛⠛⠻⣿⣿⣿⠋⠉⠀⠀
// ⠀⠘⠻⢿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⢀⡀⠹⣿⡟⠀⠀⠀⠀
// ⠀⠀⠀⠀⢹⣿⠟⢙⠛⠛⠀⠀⠀⠀⠀⣀⣴⡿⠓⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠈⠁⠀⠈⠻⢿⣦⣄⠀⣠⣾⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

