"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useProductSearch } from "@/hooks/useProductSearch";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  AlertCircle,
  ImageOff,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

/**
 * 全商品を表すプルダウンの値
 *
 * SelectItemには空文字を設定できないため、
 * 画面上ではこの値を使用する。
 */
const ALL_CATEGORIES_VALUE = "__all__";

/**
 * 金額を日本円形式に変換する
 *
 * @param price 商品価格
 * @returns カンマ区切りの金額
 */
const formatPrice = (price: number): string => {
  return `${new Intl.NumberFormat("ja-JP").format(price)}円`;
};

/**
 * 商品検索画面
 */
export const ProductSearch = () => {
  const router = useRouter();

  const {
    categories,
    products,
    displayedProducts,
    selectedCategoryUuid,
    isLoading,
    error,
    currentPage,
    totalPages,
    selectCategory,
    search,
    changePage,
  } = useProductSearch();

  /**
   * カテゴリ検索を実行する
   *
   * @param event フォーム送信イベント
   */
  const handleSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void search();
  };

  /**
   * 選択カテゴリを変更する
   *
   * @param value プルダウンで選択された値
   */
  const handleCategoryChange = (value: string): void => {
    if (value === ALL_CATEGORIES_VALUE) {
      selectCategory("");
      return;
    }

    selectCategory(value);
  };

  /**
   * 新商品登録画面へ遷移する
   */
  const goToAddPage = (): void => {
    router.push("/admin/product/add");
  };

  /**
   * 商品修正画面へ遷移する
   *
   * @param productUuid 商品UUID
   */
  const goToEditPage = (productUuid: string): void => {
    router.push(
      `/admin/product/edit/${encodeURIComponent(productUuid)}`,
    );
  };

  /**
   * 商品削除確認画面へ遷移する
   *
   * @param productUuid 商品UUID
   */
  const goToDeletePage = (productUuid: string): void => {
    router.push(
      `/admin/product/delete/${encodeURIComponent(productUuid)}`,
    );
  };

  /**
   * ページ番号一覧
   */
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* タイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">商品検索</h1>
      </div>

      {/* 検索条件 */}
      <section className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-4 md:flex-row md:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium"
            >
              商品カテゴリ
            </label>

            <Select
              value={
                selectedCategoryUuid || ALL_CATEGORIES_VALUE
              }
              onValueChange={handleCategoryChange}
              disabled={isLoading}
            >
              <SelectTrigger
                id="category"
                className="w-full"
                aria-label="商品カテゴリ"
              >
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={ALL_CATEGORIES_VALUE}>
                  全商品
                </SelectItem>

                {categories.map((category) => (
                  <SelectItem
                    key={category.categoryUuid}
                    value={category.categoryUuid}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="md:min-w-32"
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Search />
            )}
            カテゴリ検索
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={goToAddPage}
            disabled={isLoading}
            className="md:min-w-32"
          >
            <Plus />
            商品追加
          </Button>
        </form>
      </section>

      {/* エラーメッセージ */}
      {error !== null && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle />
          <AlertTitle>商品情報を取得できませんでした</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 商品件数 */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">商品一覧</h2>

        {!isLoading && error === null && (
          <p className="text-sm text-muted-foreground">
            {products.length}件
          </p>
        )}
      </div>

      {/* 商品一覧 */}
      <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-36 text-center">
                商品画像
              </TableHead>
              <TableHead>商品名</TableHead>
              <TableHead className="w-40 text-right">
                単価
              </TableHead>
              <TableHead className="w-28 text-center">
                修正
              </TableHead>
              <TableHead className="w-28 text-center">
                削除
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* 読み込み中 */}
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-48 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <LoaderCircle className="animate-spin" />
                    商品情報を読み込んでいます。
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* エラー発生時 */}
            {!isLoading && error !== null && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  商品情報を表示できません。
                </TableCell>
              </TableRow>
            )}

            {/* 検索結果0件 */}
            {!isLoading &&
              error === null &&
              displayedProducts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    該当する商品情報がありません。
                  </TableCell>
                </TableRow>
              )}

            {/* 商品一覧 */}
            {!isLoading &&
              error === null &&
              displayedProducts.map((product) => (
                <TableRow key={product.productUuid}>
                  <TableCell>
                    <div className="flex justify-center">
                      {product.imageUrl.trim() !== "" ? (
                        <div
                          role="img"
                          aria-label={`${product.productName}の商品画像`}
                          className="h-[100px] w-[100px] rounded-md border bg-white bg-contain bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url("${product.imageUrl}")`,
                          }}
                        />
                      ) : (
                        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-md border bg-muted">
                          <ImageOff
                            className="text-muted-foreground"
                            aria-label="商品画像なし"
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatPrice(product.price)}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        goToEditPage(product.productUuid)
                      }
                    >
                      <Pencil />
                      修正
                    </Button>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        goToDeletePage(product.productUuid)
                      }
                    >
                      <Trash2 />
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </section>

      {/* ページネーション */}
      {!isLoading &&
        error === null &&
        totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="前へ"
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    changePage(currentPage - 1);
                  }}
                />
              </PaginationItem>

              {pageNumbers.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(event) => {
                      event.preventDefault();
                      changePage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="次へ"
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    changePage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
    </main>
  );
};