import type { Metadata } from "next";

import { ProductDeleteComplete } from
  "@/components/api/products/delete/ProductDeleteComplete";

/**
 * ページタイトル
 */
export const metadata: Metadata = {
  title: "商品削除（完了）",
};

/**
 * BP008 商品削除（完了）ページ
 *
 * URL:
 * /admin/product/delete/complete
 */
export default function ProductDeleteCompletePage() {
  return <ProductDeleteComplete />;
}