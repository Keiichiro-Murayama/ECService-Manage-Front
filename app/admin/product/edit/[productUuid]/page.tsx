import type { Metadata } from "next";

import { ProductUpdate } from "@/components/api/products/update/ProductUpdate";

/**
 * 商品修正画面のメタデータ
 */
export const metadata: Metadata = {
  title: "商品修正",
  description: "管理者向けの商品修正画面です。",
};

/**
 * 商品修正ページのprops
 */
type ProductUpdatePageProps = {
  /**
   * URLの動的パラメータ
   */
  params: Promise<{
    productUuid: string;
  }>;
};

/**
 * BP009～BP011 商品修正ページ
 *
 * URL:
 * /admin/product/edit/{productUuid}
 */
export default async function ProductUpdatePage({
  params,
}: ProductUpdatePageProps) {
  const { productUuid } = await params;

  return (
    <ProductUpdate
      productUuid={productUuid}
    />
  );
}