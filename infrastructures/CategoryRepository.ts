import { Category } from "../models/Category";
import type { ICategoryRepository } from "../interfaces/ICategoryRepository";
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
    const response = await fetch(this.endpoint, { credentials: "include" });

    if (!response.ok) {
      throw new Error(
        `カテゴリの取得に失敗しました。(status : ${response.status})`,
      );
    }
    const data: Category[] = await response.json();
    return data;
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
