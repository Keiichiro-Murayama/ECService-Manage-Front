import { Category } from "../models/Category";
import type { ICategoryRepository } from "../interfaces/ICategoryRepository";
//小倉追加
import type { GetCategoriesResponse } from "@/models/GetCategoriesResponse";
import { injectable } from "inversify";

@injectable()
export class CategoryRepository implements ICategoryRepository {
  /**
   * APIエンドポイントのURL
   * Next.jsのAPIプロキシ(BFF)を経由してバックエンドAPIにアクセスするためのURL
   * フロントエンド側で呼び出すURL（相対パス）として使用されます。
   */
  private readonly endpoint: string = "/proxy-api/categories";

  /**
   * カテゴリ一覧を取得する
   * @returns カテゴリ一覧の配列
   */
  async getAllCategories(): Promise<Category[]> {
    const response = await fetch(this.endpoint, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `カテゴリの取得に失敗しました。(status : ${response.status})`,
      );
    }

    const data =
      (await response.json()) as Partial<GetCategoriesResponse>;

    if (!Array.isArray(data.categories)) {
      console.error(
        "カテゴリ一覧取得APIのレスポンス:",
        data,
      );

      throw new Error(
        "カテゴリ一覧取得APIのレスポンス形式が不正です。",
      );
    }

    return data.categories;
  }

  /**
   *　新しいカテゴリを追加する
   * @param newCategoryName
   */
  async addCategory(newCategoryName: string): Promise<void> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName: newCategoryName }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `カテゴリの登録に失敗しました。(status : ${response.status})`,
      );
    }
  }
}
