import type { Metadata } from "next";

import { ProductDeleteConfirm } from
  "@/components/api/products/delete/ProductDeleteConfirm";

/**
 * ページタイトル
 */
export const metadata: Metadata = {
  title: "商品削除（確認）",
};

/**
 * 商品削除確認ページのprops
 */
type ProductDeletePageProps = {
  /**
   * URLの動的パラメータ
   */
  params: Promise<{
    productUuid: string;
  }>;
};

/**
 * BP007 商品削除（確認）ページ
 *
 * URL:
 * /admin/product/delete/{productUuid}
 */
export default async function ProductDeletePage({
  params,
}: ProductDeletePageProps) {
  /**
   * URLから商品UUIDを取得する
   */
  const { productUuid } = await params;

  return (
    <ProductDeleteConfirm
      productUuid={productUuid}
    />
  );
}