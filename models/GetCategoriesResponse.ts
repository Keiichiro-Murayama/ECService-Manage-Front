import type { Category } from "@/models/Category";

/**
 * カテゴリ一覧取得APIのレスポンス
 */
export interface GetCategoriesResponse {
  categories: Category[];
}