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
   * 商品画像を含む新しい商品を登録する
   *
   * @param product 登録する商品情報
   */
  register(
    product: ProductRegisterRequest,
  ): Promise<void>; //石原:変更 商品情報と画像を商品登録APIへ一括送信する
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