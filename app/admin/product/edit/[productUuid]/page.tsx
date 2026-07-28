import type { Metadata } from "next";

import { ProductUpdate } from "@/components/api/products/update/ProductUpdate";

export const metadata: Metadata = {
  title: "商品修正",
};

interface ProductUpdatePageProps {
  params: Promise<{
    productUuid: string;
  }>;
}

/**
 * 商品修正ページ
 */
export default async function ProductUpdatePage({
  params,
}: ProductUpdatePageProps) {
  const {
    productUuid,
  } = await params;

  return (
    <ProductUpdate
      productUuid={productUuid}
    />
  );
}