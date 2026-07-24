"use client";

import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import { useRegisterProduct } from "@/hooks/useRegisterProduct";

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

/**
 * 金額を日本円形式へ変換する
 *
 * @param price 商品価格
 * @returns 日本円形式の文字列
 */
const formatPrice = (
  price: number,
): string => {
  return `${new Intl.NumberFormat(
    "ja-JP",
  ).format(price)}円`;
};

/**
 * ファイルサイズをMB表記へ変換する
 *
 * @param fileSize ファイルサイズ
 * @returns MB形式の文字列
 */
const formatFileSize = (
  fileSize: number,
): string => {
  return `${(
    fileSize /
    1024 /
    1024
  ).toFixed(2)}MB`;
};

/**
 * 新商品登録画面
 */
export const ProductRegister = () => {
  const router = useRouter();

  const {
    register,
    errors,

    categories,
    selectedCategory,
    selectedCategoryUuid,
    selectedImage,
    confirmedValues,
    imagePreviewUrl,
    imageInputKey,

    step,
    isInitializing,
    isSubmitting,
    isLoading,

    handleCategoryChange,
    handleImageChange,
    handleConfirm,
    handleBack,
    handleRegister,
    resetForm,
  } = useRegisterProduct();

  /**
   * 商品検索画面へ戻る
   */
  const goToProductSearch = (): void => {
    router.push("/admin/product");
  };

  /**
   * BP012 新商品登録入力画面
   */
  if (step === "input") {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              新商品登録
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
                  placeholder="商品名を入力してください"
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
                  placeholder="価格を入力してください"
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
                  placeholder="在庫数を入力してください"
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

                {isInitializing && (
                  <p className="text-sm text-muted-foreground">
                    カテゴリを取得しています。
                  </p>
                )}

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
                <Label htmlFor="productImage">
                  商品画像
                </Label>

                <Input
                  key={imageInputKey}
                  id="productImage"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  aria-invalid={
                    errors.image !== undefined
                  }
                />

                <p className="text-sm text-muted-foreground">
                  PNG形式またはJPEG形式の画像を選択してください。
                  最大ファイルサイズは2MBです。
                </p>

                {errors.image !== undefined && (
                  <p className="text-sm text-destructive">
                    {errors.image.message}
                  </p>
                )}

                {imagePreviewUrl !== "" &&
                  selectedImage !== null && (
                    <div className="space-y-3 pt-2">
                      <p className="text-sm font-medium">
                        画像プレビュー
                      </p>

                      <div className="flex justify-center rounded-md border bg-muted/30 p-4">
                        <img
                          src={imagePreviewUrl}
                          alt="選択した商品画像のプレビュー"
                          className="max-h-72 max-w-full rounded-md object-contain"
                        />
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          ファイル名：
                          {selectedImage.name}
                        </p>

                        <p>
                          ファイルサイズ：
                          {formatFileSize(
                            selectedImage.size,
                          )}
                        </p>
                      </div>
                    </div>
                  )}
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
                  {isInitializing && (
                    <LoaderCircle className="animate-spin" />
                  )}

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
   * 確認情報が存在しない場合は入力画面へ戻す
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
   * BP013 新商品登録確認画面
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
              新商品登録確認
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
                  商品を登録できませんでした
                </AlertTitle>

                <AlertDescription>
                  {errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleRegister}
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
                  {imagePreviewUrl !== "" ? (
                    <div className="space-y-3">
                      <div className="flex justify-center rounded-md border bg-muted/30 p-4">
                        <img
                          src={imagePreviewUrl}
                          alt="登録する商品画像"
                          className="max-h-72 max-w-full rounded-md object-contain"
                        />
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          ファイル名：
                          {
                            confirmedValues
                              .image.name
                          }
                        </p>

                        <p>
                          ファイルサイズ：
                          {formatFileSize(
                            confirmedValues
                              .image.size,
                          )}
                        </p>
                      </div>
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
                    ? "登録中..."
                    : "登録"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  /**
   * BP014 新商品登録完了画面
   */
  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            新商品登録完了
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle2 />

            <AlertTitle>
              商品を登録しました
            </AlertTitle>

            <AlertDescription>
              新商品の登録が完了しました。
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
            >
              続けて登録
            </Button>

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