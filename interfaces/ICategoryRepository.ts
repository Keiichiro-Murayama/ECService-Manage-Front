import type { Category } from "../models/Category";

export interface ICategoryRepository {
  /**カテゴリ一覧を取得する*/
  getAllCategories(): Promise<Category[]>;
  /** カテゴリを登録する */
  addCategory(newCategoryName: string): Promise<void>;
}
