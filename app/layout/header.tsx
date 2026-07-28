"use client";

import * as React from "react";
import Link from "next/link";

import { useSession } from "next-auth/react"; //石原:追加

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  PencilRuler,
  UserRound,
} from "lucide-react"; 

import { useLogout } from "@/hooks/auth/useLogout";

type HeaderProps = {
  showControls?: boolean;
};

const productItems = [
  {
    title: "商品登録",
    href: "/admin/product/add",
  },
  {
    title: "商品検索",
    href: "/admin/product",
  },
];

const categoryItems = [
  {
    title: "商品カテゴリ登録",
    href: "/admin/category/add",
  },
];

const orderItems = [
  {
    title: "購入履歴検索",
    href: "/admin/order/search",
  },
];

const accountItems = [
  {
    title: "アカウント登録",
    href: "/admin/account/form",
  },
];

function ListItem({
  title,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="leading-none font-medium">
            {title}
          </div>
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
  items: {
    title: string;
    href: string;
  }[];
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-md">
        {label}
      </NavigationMenuTrigger>

      <NavigationMenuContent className="bg-tertiary shadow-xl data-[motion=from-end]:slide-in-from-right-0 data-[motion=from-start]:slide-in-from-left-0 data-[motion=to-end]:slide-out-to-right-0 data-[motion=to-start]:slide-out-to-left-0 group-data-[viewport=false]/navigation-menu:data-open:animate-none group-data-[viewport=false]/navigation-menu:data-closed:animate-none group-data-[viewport=false]/navigation-menu:data-open:opacity-100 group-data-[viewport=false]/navigation-menu:data-closed:opacity-0 transition-opacity duration-150">
        <ul className="grid gap-2 p-1 md:w-[150px]">
          {items.map((item) => (
            <ListItem
              key={item.title}
              title={item.title}
              href={item.href}
            />
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

export default function Header({
  showControls = true,
}: HeaderProps) {
  const { logout } = useLogout();

  /*
   * ログイン中のNextAuthセッションを取得する
   */
  const {
    data: session,
    status,
  } = useSession(); //石原:追加

  /*
   * ログイン中のアカウント名
   */
  const accountName =
    session?.user?.accountName?.trim() ??
    ""; //石原:追加

  return (
    <header className="flex items-center justify-between border-b-3 border-b-primary py-4 text-primary">
      <div
        className="cursor-pointer px-4 font-bold"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <PencilRuler className="mr-2 inline-block" />

        <span className="px-1 py-1">
          フルネス文具 管理画面
        </span>
      </div>

      {showControls && (
        <nav className="px-4">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-1">
              <MenuGroup
                label="商品管理"
                items={productItems}
              />

              <MenuGroup
                label="カテゴリ管理"
                items={categoryItems}
              />

              <MenuGroup
                label="注文管理"
                items={orderItems}
              />

              <MenuGroup
                label="アカウント管理"
                items={accountItems}
              />
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      )}

      {showControls && (
        <div className="flex items-center gap-3 px-4">
          {status === "authenticated" &&
            accountName !== "" && (
              <div className="flex max-w-56 items-center gap-1.5">
                <UserRound className="size-4 shrink-0" />

                <span
                  className="truncate text-sm font-medium"
                  title={accountName}
                >
                  ログイン中：
                  {accountName}
                </span>
              </div>
            )}

          <button
            type="button"
            className="rounded-md bg-secondary px-2 py-1 font-bold text-secondary-foreground hover:bg-secondary/80 hover:text-secondary-foreground/80"
            onClick={() => {
              void logout();
            }}
          >
            ログアウト
          </button>
        </div>
      )}
    </header>
  );
}