"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { ISearchOrderHistoriesService } from
  "@/interfaces/ISearchOrderHistoriesService";
import type { OrderHistory } from
  "@/models/OrderHistory";

/**
 * 1ページに表示する購入履歴数
 */
const ITEMS_PER_PAGE = 10;

/**
 * 例外から画面表示用のメッセージを取得する
 *
 * @param error 発生した例外
 * @param fallbackMessage 既定のエラーメッセージ
 * @returns 画面に表示するエラーメッセージ
 */
const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (
    error instanceof Error &&
    error.message.trim() !== ""
  ) {
    return error.message;
  }

  return fallbackMessage;
};

/**
 * 購入履歴検索画面の状態と処理を管理するカスタムフック
 */
export const usePurchaseHistorySearch = () => {
  /**
   * DIコンテナから購入履歴検索サービスを取得する
   */
  const searchOrderHistoriesService = useMemo(
    () =>
      container.get<ISearchOrderHistoriesService>(
        TYPES.ISearchOrderHistoriesService,
      ),
    [],
  );

  /**
   * 購入履歴一覧
   */
  const [orderHistories, setOrderHistories] =
    useState<OrderHistory[]>([]);

  /**
   * 検索条件の購入日
   */
  const [purchaseDate, setPurchaseDate] =
    useState<string>("");

  /**
   * 検索条件の顧客アカウント名
   */
  const [
    customerAccountName,
    setCustomerAccountName,
  ] = useState<string>("");

  /**
   * API通信中かどうか
   */
  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  /**
   * 画面表示用エラーメッセージ
   */
  const [error, setError] =
    useState<string | null>(null);

  /**
   * 検索ボタンが押されたかどうか
   *
   * 初期表示0件と検索結果0件のメッセージを
   * 切り替えるために使用する。
   */
  const [hasSearched, setHasSearched] =
    useState<boolean>(false);

  /**
   * 現在表示しているページ番号
   */
  const [currentPage, setCurrentPage] =
    useState<number>(1);

  /**
   * 購入履歴検索画面の初期表示データを取得する
   */
  const initialize =
    useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setHasSearched(false);

      try {
        const initialOrderHistories =
          await searchOrderHistoriesService
            .getInitialData();

        setOrderHistories(initialOrderHistories);
        setCurrentPage(1);
      } catch (caughtError: unknown) {
        console.error(
          "購入履歴検索画面の初期表示データ取得に失敗しました。",
          caughtError,
        );

        setOrderHistories([]);
        setCurrentPage(1);
        setError(
          getErrorMessage(
            caughtError,
            "注文情報の取得に失敗しました",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }, [searchOrderHistoriesService]);

  /**
   * 入力された条件で購入履歴を検索する
   */
  const search =
    useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const searchedOrderHistories =
          await searchOrderHistoriesService.search(
            purchaseDate || undefined,
            customerAccountName || undefined,
          );

        setOrderHistories(searchedOrderHistories);
        setCurrentPage(1);
      } catch (caughtError: unknown) {
        console.error(
          "購入履歴の検索に失敗しました。",
          caughtError,
        );

        setOrderHistories([]);
        setCurrentPage(1);
        setError(
          getErrorMessage(
            caughtError,
            "注文情報の取得に失敗しました",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      customerAccountName,
      purchaseDate,
      searchOrderHistoriesService,
    ]);

  /**
   * 総ページ数
   *
   * 購入履歴が0件の場合もページ数は1として扱う。
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      orderHistories.length / ITEMS_PER_PAGE,
    ),
  );

  /**
   * 現在のページに表示する購入履歴一覧
   */
  const displayedOrderHistories = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return orderHistories.slice(
      startIndex,
      endIndex,
    );
  }, [currentPage, orderHistories]);

  /**
   * 表示ページを変更する
   *
   * @param page 表示するページ番号
   */
  const changePage = useCallback(
    (page: number): void => {
      const normalizedPage = Math.min(
        Math.max(page, 1),
        totalPages,
      );

      setCurrentPage(normalizedPage);
    },
    [totalPages],
  );

  /**
   * 購入履歴検索画面の初回表示時に全件取得する
   */
  useEffect(() => {
    const animationFrameId =
      window.requestAnimationFrame(() => {
        void initialize();
      });

    return () => {
      window.cancelAnimationFrame(
        animationFrameId,
      );
    };
  }, [initialize]);

  return {
    orderHistories,
    displayedOrderHistories,
    purchaseDate,
    customerAccountName,
    isLoading,
    error,
    hasSearched,
    currentPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    setPurchaseDate,
    setCustomerAccountName,
    search,
    changePage,
    initialize,
  };
};