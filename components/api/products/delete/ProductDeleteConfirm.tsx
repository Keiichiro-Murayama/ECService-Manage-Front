"use client";

import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ImageOff,
  LoaderCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";

/**
 * 削除完了画面へ渡す商品名を保存するキー
 */
const DELETED_PRODUCT_NAME_KEY =
  "deletedProductName";

/**
 * 商品削除確認コンポーネントのprops
 */
type ProductDeleteConfirmProps = {
  /**
   * 削除対象の商品UUID
   */
  productUuid: string;
};

/**
 * 金額を日本円形式へ変換する
 *
 * @param price 商品価格
 * @returns カンマ区切りの金額
 */
const formatPrice = (price: number): string => {
  return `${new Intl.NumberFormat(
    "ja-JP",
  ).format(price)}円`;
};

/**
 * BP007 商品削除（確認）画面
 *
 * @param productUuid 削除対象の商品UUID
 */
export const ProductDeleteConfirm = ({
  productUuid,
}: ProductDeleteConfirmProps) => {
  const router = useRouter();

  const {
    product,
    isLoading,
    isDeleting,
    error,
    initialize,
    deleteProduct,
  } = useDeleteProduct(productUuid);

  /**
   * 商品検索画面へ戻る
   */
  const goBackToProductSearch = (): void => {
    router.push("/admin/product");
  };

  /**
   * 商品を削除する
   */
  const handleDelete =
    async (): Promise<void> => {
      if (
        product === null ||
        isDeleting
      ) {
        return;
      }

      const deletedProductName =
        product.productName;

      const succeeded =
        await deleteProduct();

      if (!succeeded) {
        return;
      }

      /*
       * 完了画面で削除した商品名を表示するため、
       * sessionStorageへ一時的に保存する。
       */
      sessionStorage.setItem(
        DELETED_PRODUCT_NAME_KEY,
        deletedProductName,
      );

      router.push(
        "/admin/product/delete/complete",
      );
    };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        商品削除（確認）
      </h1>

      {/* 読み込み中 */}
      {isLoading && (
        <Card>
          <CardContent className="flex min-h-48 items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LoaderCircle className="size-5 animate-spin" />
              <span>
                商品情報を読み込んでいます。
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* エラーメッセージ */}
      {!isLoading && error !== null && (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle />

            <AlertTitle>
              商品情報を取得できませんでした
            </AlertTitle>

            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void initialize();
              }}
            >
              <RefreshCw />
              再読み込み
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={
                goBackToProductSearch
              }
            >
              <ArrowLeft />
              商品検索へ戻る
            </Button>
          </div>
        </div>
      )}

      {/* 商品削除確認 */}
      {!isLoading &&
        error === null &&
        product !== null && (
          <Card>
            <CardHeader>
              <CardTitle>
                以下の商品を削除しますか？
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                削除する商品に間違いがないか確認してください。
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-[280px_1fr]">
                {/* 商品画像 */}
                <div className="flex min-h-56 items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
                  {product.imageUrl.trim() !==
                  "" ? (
                    /*
                     * 外部URLの商品画像を表示するため、
                     * 通常のimgタグを使用する。
                     */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="max-h-72 w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ImageOff className="size-10" />
                      <span className="text-sm">
                        商品画像はありません
                      </span>
                    </div>
                  )}
                </div>

                {/* 商品情報 */}
                <dl className="divide-y rounded-lg border">
                  <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-4">
                    <dt className="font-medium">
                      商品名
                    </dt>

                    <dd>
                      {product.productName}
                    </dd>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-4">
                    <dt className="font-medium">
                      単価
                    </dt>

                    <dd>
                      {formatPrice(
                        product.price,
                      )}
                    </dd>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-4">
                    <dt className="font-medium">
                      在庫数
                    </dt>

                    <dd>
                      {product.stock}
                    </dd>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-4">
                    <dt className="font-medium">
                      商品カテゴリ
                    </dt>

                    <dd>
                      {product.categoryName}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* 削除確認メッセージ */}
              <Alert variant="destructive">
                <AlertCircle />

                <AlertTitle>
                  削除前に確認してください
                </AlertTitle>

                <AlertDescription>
                  この操作を実行すると、商品検索画面には表示されなくなります。
                </AlertDescription>
              </Alert>

              {/* 操作ボタン */}
              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDeleting}
                  onClick={
                    goBackToProductSearch
                  }
                >
                  <ArrowLeft />
                  キャンセル
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={() => {
                    void handleDelete();
                  }}
                >
                  {isDeleting ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}

                  {isDeleting
                    ? "削除しています..."
                    : "削除"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </main>
  );
};