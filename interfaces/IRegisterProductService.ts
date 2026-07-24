import type { Category } from "@/models/Category";
import type { ProductRegisterRequest } from "@/models/ProductRegisterRequest";

/**
 * 新商品登録サービスのインターフェース
 */
export interface IRegisterProductService {
  /**
   * 商品カテゴリ一覧を取得する
   *
   * @returns 商品カテゴリ一覧
   */
  getCategories(): Promise<Category[]>;

  /**
   * 商品画像をアップロードする
   *
   * @param imageFile アップロードする画像ファイル
   * @returns アップロード後の画像URL
   */
  uploadProductImage(
    imageFile: File,
  ): Promise<string>;

  /**
   * 新しい商品を登録する
   *
   * @param product 登録する商品情報
   */
  register(
    product: ProductRegisterRequest,
  ): Promise<void>;
}

// ✧
//  ⢠⣤⣤⣀ ⠀⠀⠀⠀ ⣀⣤⣤⡄
// ⢸⣿⣿⣿⣿⣦⣄⣀⣠⣴⣿⣿⣿⣿⡇⠀⠀⠀⠀⊹
// ⣸⣿⣿⣿⣿⣿⡽⣿⣯⣿⣿⣿⣿⣿⣇
// ⢻⣿⣿⣿⠿⣻⣵⡟⣮⣟⠿⣿⣿⣿⡟
// ⠀⠀⠀⠀⣼⣿⡿ ⠀⢿⣿⣷⡀
// ⊹⠀⣠⣾⣿⣿⠃ ⠀⠈⢿⣿⣿⣦⡀
// ⠀⠈⠉⠹⡿⠁⠀⠀⠀⠀⠈⢻⡇⠉⠉

// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ₊˚⊹

