/**
 * カテゴリを表すモデル
 * GET /api/admin/categories で取得されるカテゴリの配列の一つ分の型
 */
export interface Category {
  /** カテゴリのUUID */
  categoryUuid: string;
  /** カテゴリ名 */
  name: string;
}
