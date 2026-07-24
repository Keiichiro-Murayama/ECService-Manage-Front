"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  House,
  LoaderCircle,
  Search,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 削除確認画面から渡された商品名を保存するキー
 */
const DELETED_PRODUCT_NAME_KEY =
  "deletedProductName";

/**
 * サーバー側での仮の値
 */
const SERVER_SNAPSHOT =
  "__SERVER_SNAPSHOT__";

/**
 * sessionStorageの変更購読
 *
 * 今回は画面表示時の値を取得するだけなので、
 * 実際の購読処理は行わない。
 */
const subscribe = (): (() => void) => {
  return () => {};
};

/**
 * ブラウザ側のsessionStorageから商品名を取得する
 */
const getSnapshot = (): string => {
  return (
    sessionStorage.getItem(
      DELETED_PRODUCT_NAME_KEY,
    ) ?? ""
  );
};

/**
 * サーバー側レンダリング時の値
 */
const getServerSnapshot = (): string => {
  return SERVER_SNAPSHOT;
};

/**
 * BP008 商品削除（完了）画面
 */
export const ProductDeleteComplete = () => {
  const router = useRouter();

  /**
   * 削除確認画面で保存した商品名を取得する
   */
  const deletedProductName =
    useSyncExternalStore(
      subscribe,
      getSnapshot,
      getServerSnapshot,
    );

  /**
   * sessionStorageを削除して指定画面へ遷移する
   */
  const navigateTo = (path: string): void => {
    sessionStorage.removeItem(
      DELETED_PRODUCT_NAME_KEY,
    );

    router.push(path);
  };

  /**
   * サーバー側レンダリング直後
   */
  if (
    deletedProductName === SERVER_SNAPSHOT
  ) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <Card>
          <CardContent className="flex min-h-48 items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LoaderCircle className="size-5 animate-spin" />

              <span>
                完了情報を読み込んでいます。
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  /**
   * 削除操作を経由せず直接アクセスした場合
   */
  if (deletedProductName === "") {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TriangleAlert className="text-destructive" />
              不正なアクセスです
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              削除完了情報が見つかりません。
              商品検索画面から操作をやり直してください。
            </p>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  navigateTo("/admin/product");
                }}
              >
                <Search />
                商品検索へ戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        商品削除（完了）
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" />
            商品を削除しました
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <p className="text-lg">
            「
            <span className="font-semibold">
              {deletedProductName}
            </span>
            」を削除しました。
          </p>

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                navigateTo("/admin");
              }}
            >
              <House />
              メニューへ
            </Button>

            <Button
              type="button"
              onClick={() => {
                navigateTo("/admin/product");
              }}
            >
              <Search />
              商品検索へ戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};