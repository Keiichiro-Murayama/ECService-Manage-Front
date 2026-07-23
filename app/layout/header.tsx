"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { signOut } from "next-auth/react";
import { PencilRuler } from "lucide-react";

type HeaderProps = {
  showControls?: boolean;
};

const productItems = [
  {
    title: "商品登録",
    href: "/",
  },
  {
    title: "商品検索",
    href: "/",
  },
];

const categoryItems = [
  {
    title: "商品カテゴリ登録",
    href: "/",
  },
];

const orderItems = [
  {
    title: "購入履歴検索",
    href: "/",
  },
  {
    title: "注文ステータス更新",
    href: "/",
  },
];

const accountItems = [
  {
    title: "アカウント登録",
    href: "/",
  },
];

function ListItem({
  title,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="leading-none font-medium">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

function MenuGroup({
  label,
  items,
}: {
  label: string;
  items: { title: string; href: string }[];
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-md">{label}</NavigationMenuTrigger>
      <NavigationMenuContent className="bg-tertiary shadow-xl data-[motion=from-end]:slide-in-from-right-0 data-[motion=from-start]:slide-in-from-left-0 data-[motion=to-end]:slide-out-to-right-0 data-[motion=to-start]:slide-out-to-left-0 group-data-[viewport=false]/navigation-menu:data-open:animate-none group-data-[viewport=false]/navigation-menu:data-closed:animate-none group-data-[viewport=false]/navigation-menu:data-open:opacity-100 group-data-[viewport=false]/navigation-menu:data-closed:opacity-0 transition-opacity duration-150">
        <ul className="grid gap-2 p-1 md:w-[150px]">
          {items.map((item) => (
            <ListItem
              key={item.title}
              title={item.title}
              href={item.href}
            ></ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

export default function Header({ showControls = true }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b-3 border-b-primary py-4 text-primary">
      <div className="px-4 font-bold">
        <PencilRuler className="inline-block mr-2" />
        <span className="px-1 py-1">フルネス文具 管理画面</span>
      </div>

      {showControls && (
        <nav className="px-4">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-1">
              <MenuGroup label="商品管理" items={productItems} />
              <MenuGroup label="カテゴリ管理" items={categoryItems} />
              <MenuGroup label="注文管理" items={orderItems} />
              <MenuGroup label="アカウント管理" items={accountItems} />
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      )}

      {showControls && (
        <div className="px-4 font-bold">
          <button
            className="text-secondary-foreground rounded-md bg-secondary px-2 py-1 hover:bg-secondary/80 hover:text-secondary-foreground/80"
            onClick={() => {
              signOut({ callbackUrl: "/api/login" });
            }}
          >
            ログアウト
          </button>
        </div>
      )}
    </header>
  );
}
