import type { Metadata } from "next";

import { ProductSearch } from "@/components/api/products/search/ProductSearch";

/**
 * 商品検索画面のメタデータ
 */
export const metadata: Metadata = {
  title: "商品検索",
  description: "管理者向けの商品検索画面です。",
};

/**
 * BP006 商品検索ページ
 *
 * URL: /admin/product
 */
export default function ProductSearchPage() {
  return <ProductSearch />;
}