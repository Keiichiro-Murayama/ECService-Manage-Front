import type { Metadata } from "next";

import { OrderStatusUpdate } from
  "@/components/api/orders/status/update/OrderStatusUpdate";

/**
 * メタデータ
 */
export const metadata: Metadata = {
  title: "注文ステータス更新",
};

/**
 * 注文ステータス更新ページのprops
 */
interface OrderStatusUpdatePageProps {
  params: Promise<{
    orderUuid: string;
  }>;
}

/**
 * 注文ステータス更新ページ
 */
export default async function OrderStatusUpdatePage({
  params,
}: OrderStatusUpdatePageProps) {
  const { orderUuid } = await params;

  return (
    <OrderStatusUpdate
      orderUuid={orderUuid}
    />
  );
}