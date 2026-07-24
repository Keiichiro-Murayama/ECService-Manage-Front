import type { Metadata } from "next";

import { ProductRegister } from "@/components/api/products/register/ProductRegister";

/**
 * 新商品登録画面のメタデータ
 */
export const metadata: Metadata = {
  title: "新商品登録",
  description: "管理者向けの新商品登録画面です。",
};

/**
 * BP012～BP014 新商品登録ページ
 *
 * URL: /admin/product/add
 */
export default function ProductRegisterPage() {
  return <ProductRegister />;
}