"use client";

import { useRouter } from "next/navigation";

import {
  Alert,
  AlertDescription,
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
 * 商品修正コンポーネントのProps
 */
interface ProductUpdateProps {
  /** 修正対象の商品UUID */
  productUuid: string;
}

/**
 * 商品の変更内容
 */
type ProductChange = {
  /** 項目名 */
  label: string;

  /** 変更前 */
  before: string;

  /** 変更後 */
  after: string;
};

/**
 * 金額を日本円形式に変換する
 */
const formatPrice = (
  price: number,
): string => {
  return `${new Intl.NumberFormat(
    "ja-JP",
  ).format(price)}円`;
};

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
  } = useUpdateProduct(productUuid);

  /**
   * 現在登録されている商品カテゴリ
   */
  const currentCategory =
    product !== null
      ? categories.find(
          (category) =>
            category.categoryUuid ===
            product.categoryUuid,
        )
      : undefined; //石原:追加

  /**
   * 変更された項目の一覧
   */
  const changes: ProductChange[] =
    product !== null &&
    confirmedValues !== null
      ? [
          product.productName !==
          confirmedValues.productName
            ? {
                label: "商品名",
                before:
                  product.productName,
                after:
                  confirmedValues.productName,
              }
            : null,

          product.price !==
          confirmedValues.price
            ? {
                label: "価格",
                before: formatPrice(
                  product.price,
                ),
                after: formatPrice(
                  confirmedValues.price,
                ),
              }
            : null,

          product.stock !==
          confirmedValues.stock
            ? {
                label: "在庫数",
                before:
                  `${product.stock}個`,
                after:
                  `${confirmedValues.stock}個`,
              }
            : null,

          product.categoryUuid !==
          confirmedValues.categoryUuid
            ? {
                label:
                  "商品カテゴリ",
                before:
                  currentCategory?.name ??
                  "不明",
                after:
                  selectedCategory?.name ??
                  "不明",
              }
            : null,

          selectedImage !== null
            ? {
                label: "商品画像",
                before:
                  "現在の商品画像",
                after:
                  selectedImage.name,
              }
            : null,
        ].filter(
          (
            change,
          ): change is ProductChange =>
            change !== null,
        )
      : []; //石原:追加

  /**
   * 商品検索画面へ戻る
   */
  const goToProductSearch =
    (): void => {
      router.push("/admin/product");
    };

  /**
   * 初期表示中
   */
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

  /**
   * 商品情報の取得失敗
   */
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
            onClick={
              goToProductSearch
            }
          >
            商品検索へ戻る
          </Button>
        </div>
      </main>
    );
  }

  /**
   * 商品修正入力画面
   */
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
            {errors.root !==
              undefined && (
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
              {/* 商品名 */}
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

                {errors.productName !==
                  undefined && (
                  <p className="text-sm text-destructive">
                    {
                      errors.productName
                        .message
                    }
                  </p>
                )}
              </div>

              {/* 価格 */}
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
                  {...register("price")}
                />

                {errors.price !==
                  undefined && (
                  <p className="text-sm text-destructive">
                    {
                      errors.price
                        .message
                    }
                  </p>
                )}
              </div>

              {/* 在庫数 */}
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
                  {...register("stock")}
                />

                {errors.stock !==
                  undefined && (
                  <p className="text-sm text-destructive">
                    {
                      errors.stock
                        .message
                    }
                  </p>
                )}
              </div>

              {/* 商品カテゴリ */}
              <div className="space-y-2">
                <Label htmlFor="categoryUuid">
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
                  <SelectTrigger id="categoryUuid">
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
                          {
                            category.name
                          }
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

              {/* 商品画像 */}
              <div className="space-y-2">
                <Label htmlFor="image">
                  商品画像
                </Label>

                {imagePreviewUrl !==
                  "" && (
                  <div className="flex justify-center rounded-md border p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        imagePreviewUrl
                      }
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
                  画像を変更しない場合は、
                  ファイルを選択する必要はありません。
                </p>

                {errors.image !==
                  undefined && (
                  <p className="text-sm text-destructive">
                    {
                      errors.image
                        .message
                    }
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

  /**
   * 商品修正確認画面
   */
  if (
    step === "confirm" &&
    confirmedValues !== null
  ) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              商品修正確認
            </CardTitle>
          </CardHeader>

          <CardContent>
            {errors.root !==
              undefined && (
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
              className="space-y-8"
              noValidate
            >
              {/* 変更内容 */}
              <section>
                <h2 className="mb-4 text-lg font-semibold">
                  変更内容
                </h2>

                {changes.length ===
                0 ? (
                  <Alert>
                    <AlertDescription>
                      変更された項目はありません。
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-hidden rounded-md border">
                    {/* 見出し */}
                    <div className="hidden grid-cols-[150px_1fr_50px_1fr] border-b bg-muted px-4 py-3 text-sm font-semibold md:grid">
                      <div>項目</div>

                      <div>
                        変更前
                      </div>

                      <div />

                      <div>
                        変更後
                      </div>
                    </div>

                    {/* 変更項目 */}
                    {changes.map(
                      (change) => (
                        <div
                          key={
                            change.label
                          }
                          className="border-b px-4 py-4 last:border-b-0 md:grid md:grid-cols-[150px_1fr_50px_1fr] md:items-center"
                        >
                          <div className="mb-3 font-semibold md:mb-0">
                            {
                              change.label
                            }
                          </div>

                          <div className="grid grid-cols-[80px_1fr] items-center gap-2 md:block">
                            <span className="text-sm font-semibold md:hidden">
                              変更前
                            </span>

                            <span className="break-words text-muted-foreground">
                              {
                                change.before
                              }
                            </span>
                          </div>

                          <div className="my-2 text-center text-xl font-bold md:my-0">
                            →
                          </div>

                          <div className="grid grid-cols-[80px_1fr] items-center gap-2 md:block">
                            <span className="text-sm font-semibold md:hidden">
                              変更後
                            </span>

                            <span className="break-words font-medium">
                              {
                                change.after
                              }
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </section>

              {/* 更新後の商品情報 */}
              <section>
                <h2 className="mb-4 text-lg font-semibold">
                  更新後の商品情報
                </h2>

                <dl className="grid gap-4 rounded-md border p-4 sm:grid-cols-[180px_1fr]">
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
                </dl>
              </section>

              {/* 更新後の商品画像 */}
              {imagePreviewUrl !==
                "" && (
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold">
                    更新後の商品画像
                  </h2>

                  <div className="rounded-md border p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        imagePreviewUrl
                      }
                      alt="更新後の商品画像"
                      className="mx-auto max-h-72 max-w-full object-contain"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {selectedImage !==
                    null
                      ? `「${selectedImage.name}」へ変更します。`
                      : "現在の商品画像を使用します。"}
                  </p>
                </section>
              )}

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
                  disabled={
                    isSubmitting ||
                    changes.length === 0
                  }
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

  /**
   * 商品修正完了画面
   */
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