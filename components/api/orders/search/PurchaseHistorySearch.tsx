"use client";

import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  LoaderCircle,
  Pencil,
  Search,
} from "lucide-react";

import { usePurchaseHistorySearch } from
  "@/hooks/usePurchaseHistorySearch";
import { Alert, AlertDescription, AlertTitle } from
  "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * 購入日時を日本の表示形式に変換する
 *
 * APIがUTCまたは日本時間のオフセット付き日時を返した場合も、
 * Asia/Tokyoの日時として表示する。
 *
 * @param purchaseDate ISO 8601形式の購入日時
 * @returns 日本語形式の購入日時
 */
const formatPurchaseDate = (
  purchaseDate: string,
): string => {
  const date = new Date(purchaseDate);

  if (Number.isNaN(date.getTime())) {
    return purchaseDate;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

/**
 * BP015 購入履歴検索画面
 */
export const PurchaseHistorySearch = () => {
  const router = useRouter();

  const {
    orderHistories,
    displayedOrderHistories,
    purchaseDate,
    customerAccountName,
    isLoading,
    error,
    hasSearched,
    currentPage,
    totalPages,
    setPurchaseDate,
    setCustomerAccountName,
    search,
    changePage,
  } = usePurchaseHistorySearch();

  /**
   * 購入履歴検索を実行する
   *
   * @param event フォーム送信イベント
   */
  const handleSearch = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    void search();
  };

  /**
   * 購入日を変更する
   *
   * @param event 入力変更イベント
   */
  const handlePurchaseDateChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setPurchaseDate(event.target.value);
  };

  /**
   * 顧客アカウント名を変更する
   *
   * @param event 入力変更イベント
   */
  const handleCustomerAccountNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setCustomerAccountName(event.target.value);
  };

  /**
   * 注文ステータス更新画面へ遷移する
   *
   * @param orderUuid 注文UUID
   */
  const goToStatusUpdatePage = (
    orderUuid: string,
  ): void => {
    router.push(
      `/admin/order/status/update/${encodeURIComponent(
        orderUuid,
      )}`,
    );
  };

  /**
   * ページ番号一覧
   */
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  /**
   * 購入履歴0件時のメッセージ
   */
  const emptyMessage = hasSearched
    ? "該当する注文が見つかりませんでした"
    : "注文が登録されていません";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      {/* タイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          購入履歴検索
        </h1>
      </div>

      {/* 検索条件 */}
      <section className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="grid gap-4 md:grid-cols-[minmax(12rem,1fr)_minmax(16rem,2fr)_auto] md:items-end"
        >
          <div>
            <label
              htmlFor="purchaseDate"
              className="mb-2 block text-sm font-medium"
            >
              購入日
            </label>

            <Input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={handlePurchaseDateChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="customerAccountName"
              className="mb-2 block text-sm font-medium"
            >
              顧客アカウント名
            </label>

            <Input
              id="customerAccountName"
              name="customerAccountName"
              type="text"
              value={customerAccountName}
              onChange={
                handleCustomerAccountNameChange
              }
              maxLength={30}
              placeholder="顧客アカウント名を入力"
              autoComplete="off"
              disabled={isLoading}
            />
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
            検索
          </Button>
        </form>
      </section>

      {/* エラーメッセージ */}
      {error !== null && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle />
          <AlertTitle>
            注文情報の取得に失敗しました
          </AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* 購入履歴件数 */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          購入履歴一覧
        </h2>

        {!isLoading && error === null && (
          <p className="text-sm text-muted-foreground">
            {orderHistories.length}件
          </p>
        )}
      </div>

      {/* 購入履歴一覧 */}
      <section className="overflow-x-auto rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-52">
                購入日時
              </TableHead>
              <TableHead className="min-w-48">
                顧客アカウント名
              </TableHead>
              <TableHead className="min-w-72">
                注文内容
              </TableHead>
              <TableHead className="min-w-36">
                注文ステータス
              </TableHead>
              <TableHead className="w-36 text-center">
                ステータス更新
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
                    注文情報を読み込んでいます。
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
                  注文情報を表示できません。
                </TableCell>
              </TableRow>
            )}

            {/* 購入履歴0件 */}
            {!isLoading &&
              error === null &&
              displayedOrderHistories.length ===
                0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}

            {/* 購入履歴一覧 */}
            {!isLoading &&
              error === null &&
              displayedOrderHistories.map(
                (orderHistory) => (
                  <TableRow
                    key={orderHistory.orderUuid}
                  >
                    <TableCell className="whitespace-nowrap">
                      {formatPurchaseDate(
                        orderHistory.purchaseDate,
                      )}
                    </TableCell>

                    <TableCell className="font-medium">
                      {
                        orderHistory
                          .customerAccountName
                      }
                    </TableCell>

                    <TableCell className="whitespace-pre-wrap">
                      {orderHistory.orderContent}
                    </TableCell>

                    <TableCell>
                      {orderHistory.orderStatus}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          goToStatusUpdatePage(
                            orderHistory.orderUuid,
                          )
                        }
                      >
                        <Pencil />
                        更新
                      </Button>
                    </TableCell>
                  </TableRow>
                ),
              )}
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
                  aria-disabled={
                    currentPage === 1
                  }
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
                    isActive={
                      page === currentPage
                    }
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
                  aria-disabled={
                    currentPage === totalPages
                  }
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