"use client";

import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ImageOff,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";

/**
 * 商品修正コンポーネントのprops
 */
type ProductUpdateProps = {
  /** 修正対象の商品UUID */
  productUuid: string;
};

/**
 * 金額を日本円形式へ変換する
 */
const formatPrice = (
  price: number,
): string => {
  return `${new Intl.NumberFormat(
    "ja-JP",
  ).format(price)}円`;
};

/**
 * BP009～BP011 商品修正画面
 */
export const ProductUpdate = ({
  productUuid,
}: ProductUpdateProps) => {
  const router = useRouter();

  const {
    register,
    errors,

    product,
    categories,
    selectedCategory,
    selectedCategoryUuid,
    confirmedValues,

    step,
    isInitializing,
    isSubmitting,
    isLoading,

    handleCategoryChange,
    handleConfirm,
    handleBack,
    handleUpdate,
    initialize,
  } = useUpdateProduct(productUuid);

  /**
   * 商品検索画面へ戻る
   */
  const goToProductSearch = (): void => {
    router.push("/admin/product");
  };

  /**
   * 初期表示中
   */
  if (isInitializing) {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
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
      </main>
    );
  }

  /**
   * 初期表示失敗
   */
  if (product === null) {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle />

            <AlertTitle>
              商品情報を取得できませんでした
            </AlertTitle>

            <AlertDescription>
              {errors.root?.message ??
                "商品情報の取得に失敗しました。"}
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
              onClick={goToProductSearch}
            >
              <ArrowLeft />
              商品検索へ戻る
            </Button>
          </div>
        </div>
      </main>
    );
  }

  /**
   * BP009 商品修正入力画面
   */
  if (step === "input") {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              商品修正
            </CardTitle>
          </CardHeader>

          <CardContent>
            {errors.root !== undefined && (
              <Alert
                variant="destructive"
                className="mb-6"
              >
                <AlertCircle />

                <AlertTitle>
                  エラーが発生しました
                </AlertTitle>

                <AlertDescription>
                  {errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleConfirm}
              className="space-y-6"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="productName">
                  商品名
                </Label>

                <Input
                  id="productName"
                  type="text"
                  maxLength={20}
                  disabled={isLoading}
                  aria-invalid={
                    errors.productName !== undefined
                  }
                  {...register("productName")}
                />

                {errors.productName !==
                  undefined && (
                  <p className="text-sm text-destructive">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  価格
                </Label>

                <Input
                  id="price"
                  type="number"
                  min={0}
                  max={1_000_000}
                  step={1}
                  disabled={isLoading}
                  aria-invalid={
                    errors.price !== undefined
                  }
                  {...register("price")}
                />

                {errors.price !== undefined && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">
                  在庫数
                </Label>

                <Input
                  id="stock"
                  type="number"
                  min={0}
                  max={1_000}
                  step={1}
                  disabled={isLoading}
                  aria-invalid={
                    errors.stock !== undefined
                  }
                  {...register("stock")}
                />

                {errors.stock !== undefined && (
                  <p className="text-sm text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryUuid">
                  商品カテゴリ
                </Label>

                <Select
                  value={selectedCategoryUuid}
                  onValueChange={
                    handleCategoryChange
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger
                    id="categoryUuid"
                    aria-invalid={
                      errors.categoryUuid !==
                      undefined
                    }
                  >
                    <SelectValue placeholder="カテゴリを選択してください" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map(
                      (category) => (
                        <SelectItem
                          key={
                            category.categoryUuid
                          }
                          value={
                            category.categoryUuid
                          }
                        >
                          {category.name}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>

                {errors.categoryUuid !==
                  undefined && (
                  <p className="text-sm text-destructive">
                    {
                      errors.categoryUuid
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>商品画像</Label>

                <div className="flex min-h-56 items-center justify-center overflow-hidden rounded-md border bg-muted/30 p-4">
                  {product.imageUrl.trim() !==
                  "" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="max-h-72 max-w-full rounded-md object-contain"
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

                <p className="text-sm text-muted-foreground">
                  商品画像は現在登録されている画像を使用します。
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToProductSearch}
                  disabled={isLoading}
                >
                  キャンセル
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  確認
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  /**
   * 確認情報が存在しない場合
   */
  if (
    step === "confirm" &&
    confirmedValues === null
  ) {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <Alert variant="destructive">
          <AlertCircle />

          <AlertTitle>
            入力内容を確認できませんでした
          </AlertTitle>

          <AlertDescription>
            入力画面へ戻り、もう一度入力してください。
          </AlertDescription>
        </Alert>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={handleBack}
          >
            入力画面へ戻る
          </Button>
        </div>
      </main>
    );
  }

  /**
   * BP010 商品修正確認画面
   */
  if (
    step === "confirm" &&
    confirmedValues !== null
  ) {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              商品修正確認
            </CardTitle>
          </CardHeader>

          <CardContent>
            {errors.root !== undefined && (
              <Alert
                variant="destructive"
                className="mb-6"
              >
                <AlertCircle />

                <AlertTitle>
                  商品を更新できませんでした
                </AlertTitle>

                <AlertDescription>
                  {errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleUpdate}
              className="space-y-6"
              noValidate
            >
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr] sm:gap-x-6">
                <dt className="font-semibold">
                  商品名
                </dt>

                <dd>
                  {confirmedValues.productName}
                </dd>

                <dt className="font-semibold">
                  価格
                </dt>

                <dd>
                  {formatPrice(
                    confirmedValues.price,
                  )}
                </dd>

                <dt className="font-semibold">
                  在庫数
                </dt>

                <dd>
                  {confirmedValues.stock}個
                </dd>

                <dt className="font-semibold">
                  商品カテゴリ
                </dt>

                <dd>
                  {selectedCategory?.name ??
                    "カテゴリ情報なし"}
                </dd>

                <dt className="font-semibold">
                  商品画像
                </dt>

                <dd>
                  {product.imageUrl.trim() !==
                  "" ? (
                    <div className="flex justify-center rounded-md border bg-muted/30 p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt={
                          confirmedValues.productName
                        }
                        className="max-h-72 max-w-full rounded-md object-contain"
                      />
                    </div>
                  ) : (
                    "画像なし"
                  )}
                </dd>
              </dl>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  戻る
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <LoaderCircle className="animate-spin" />
                  )}

                  {isSubmitting
                    ? "更新中..."
                    : "更新"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  /**
   * BP011 商品修正完了画面
   */
  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            商品修正完了
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle2 />

            <AlertTitle>
              商品情報を更新しました
            </AlertTitle>

            <AlertDescription>
              商品情報の修正が完了しました。
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={goToProductSearch}
            >
              商品検索へ戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};