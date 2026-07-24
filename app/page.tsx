import {
  Inbox,
  LaptopMinimalCheck,
  ReceiptText,
  User,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MenuCard from "@/components/api/menu/MenuCard";

type MenuCardItem = {
  title: string;
  actions: { label: string; href: string }[];
  icon: LucideIcon;
};

const menuCards: MenuCardItem[] = [
  {
    title: "商品管理",
    actions: [
      { label: "商品登録", href: "/admin/product/add" },
      { label: "商品検索", href: "/admin/product/" },
    ],
    icon: LaptopMinimalCheck,
  },
  {
    title: "カテゴリ管理",
    actions: [{ label: "カテゴリ登録", href: "/admin/category/add" }],
    icon: Inbox,
  },
  {
    title: "注文管理",
    actions: [{ label: "購入履歴検索", href: "/admin/order/search" }],
    icon: ReceiptText,
  },
  {
    title: "アカウント管理",
    actions: [{ label: "アカウント登録", href: "/admin/account/form" }],
    icon: User,
  },
];

export default function MenuPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold pb-4">メニューページ</h1>
      <div className="grid w-full grid-cols-1 gap-8 justify-items-center md:grid-cols-2 xl:grid-cols-4">
        {menuCards.map((card) => (
          <MenuCard
            key={card.title}
            title={card.title}
            actions={card.actions}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}
