import type { Metadata } from "next";

import { PurchaseHistorySearch } from "@/components/api/orders/search/PurchaseHistorySearch";

/**
 * 購入履歴検索画面のメタデータ
 */
export const metadata: Metadata = {
  title: "購入履歴検索",
  description: "管理者向けの購入履歴検索画面です。",
};

/**
 * BP015 購入履歴検索ページ
 *
 * URL: /admin/order/search
 */
export default function PurchaseHistorySearchPage() {
  return <PurchaseHistorySearch />;
}