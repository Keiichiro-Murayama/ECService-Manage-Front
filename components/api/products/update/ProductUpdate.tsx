"use client";

import { useRouter } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface ProductUpdateProps {
  productUuid: string;
}

const formatPrice = (
  price: number,
): string =>
  `${new Intl.NumberFormat(
    "ja-JP",
  ).format(price)}円`;

/**
 * 商品修正画面
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
    selectedImage,
    confirmedValues,
    imagePreviewUrl,

    step,
    isInitializing,
    isSubmitting,
    isLoading,

    handleCategoryChange,
    handleImageChange,
    handleConfirm,
    handleBack,
    handleUpdate,
    initialize,
  } = useUpdateProduct(
    productUuid,
  );

  const goToProductSearch = (): void => {
    router.push("/admin/product");
  };

  if (isInitializing) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Card>
          <CardContent className="p-10 text-center">
            商品情報を読み込んでいます。
          </CardContent>
        </Card>
      </main>
    );
  }

  if (product === null) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {errors.root?.message ??
              "商品情報を取得できませんでした。"}
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => {
              void initialize();
            }}
          >
            再読み込み
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={goToProductSearch}
          >
            商品検索へ戻る
          </Button>
        </div>
      </main>
    );
  }

  if (step === "input") {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              商品修正
            </CardTitle>
          </CardHeader>

          <CardContent>
            {errors.root !== undefined && (
              <Alert
                variant="destructive"
                className="mb-6"
              >
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
                  maxLength={20}
                  disabled={isLoading}
                  {...register(
                    "productName",
                  )}
                />

                {errors.productName && (
                  <p className="text-sm text-destructive">
                    {
                      errors.productName
                        .message
                    }
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
                  disabled={isLoading}
                  {...register("price")}
                />

                {errors.price && (
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
                  disabled={isLoading}
                  {...register("stock")}
                />

                {errors.stock && (
                  <p className="text-sm text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  商品カテゴリ
                </Label>

                <Select
                  value={
                    selectedCategoryUuid
                  }
                  onValueChange={
                    handleCategoryChange
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
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

                {errors.categoryUuid && (
                  <p className="text-sm text-destructive">
                    {
                      errors.categoryUuid
                        .message
                    }
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">
                  商品画像
                </Label>

                {imagePreviewUrl !== "" && (
                  <div className="flex justify-center rounded-md border p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreviewUrl}
                      alt="商品画像プレビュー"
                      className="max-h-72 max-w-full object-contain"
                    />
                  </div>
                )}

                <Input
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg"
                  disabled={isLoading}
                  onChange={
                    handleImageChange
                  }
                />

                <p className="text-sm text-muted-foreground">
                  変更しない場合は、画像を選択する必要はありません。
                </p>

                {errors.image && (
                  <p className="text-sm text-destructive">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    goToProductSearch
                  }
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

  if (
    step === "confirm" &&
    confirmedValues !== null
  ) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              商品修正確認
            </CardTitle>
          </CardHeader>

          <CardContent>
            {errors.root !== undefined && (
              <Alert
                variant="destructive"
                className="mb-6"
              >
                <AlertDescription>
                  {errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleUpdate}
              className="space-y-6"
            >
              <dl className="grid gap-4 sm:grid-cols-[160px_1fr]">
                <dt className="font-semibold">
                  商品名
                </dt>
                <dd>
                  {
                    confirmedValues
                      .productName
                  }
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
                  {
                    confirmedValues.stock
                  }
                  個
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
                  <div className="rounded-md border p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreviewUrl}
                      alt="更新後の商品画像"
                      className="mx-auto max-h-72 max-w-full object-contain"
                    />
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedImage !== null
                      ? "新しい画像へ変更します。"
                      : "現在の画像を使用します。"}
                  </p>
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

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            商品修正完了
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              商品情報を更新しました。
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={
                goToProductSearch
              }
            >
              商品検索へ戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};