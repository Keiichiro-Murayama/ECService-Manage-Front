import { TYPES } from "@/di/types";
import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { IProductRepository } from "@/interfaces/IProductRepository";
import type { IRegisterProductService } from "@/interfaces/IRegisterProductService";
import type { Category } from "@/models/Category";
import type { ProductRegisterRequest } from "@/models/ProductRegisterRequest";
import { inject, injectable } from "inversify";

/**
 * 新商品登録画面で使用する処理を統括するサービス
 */
@injectable()
export class RegisterProductService
  implements IRegisterProductService
{
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
   * 商品画像を含む新商品を登録する
   *
   * @param product 登録する商品情報
   */
  async register(
    product: ProductRegisterRequest,
  ): Promise<void> {
    await this.productRepository.addProduct(product); //石原:変更 商品情報と画像を商品登録処理へ一括で渡す
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