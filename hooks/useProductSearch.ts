"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { ISearchProductsService } from "@/interfaces/ISearchProductsService";
import type { Category } from "@/models/Category";
import type { Product } from "@/models/Product";


/**
 * 1ページに表示する商品数
 */
const ITEMS_PER_PAGE = 10;

/**
 * 例外から画面表示用のメッセージを取得する
 *
 * @param error 発生した例外
 * @param fallbackMessage メッセージを取得できない場合の既定値
 * @returns 画面に表示するエラーメッセージ
 */
const getErrorMessage = (
    error: unknown,
    fallbackMessage: string,
): string => {
    if (error instanceof Error && error.message.trim() !== "") {
        return error.message;
    }

    return fallbackMessage;
};

/**
 * 商品検索画面の状態と処理を管理するカスタムフック
 */
export const useProductSearch = () => {
    /**
     * DIコンテナから商品検索サービスを取得する
     */
    const searchProductsService = useMemo(
        () =>
            container.get<ISearchProductsService>(
                TYPES.ISearchProductsService,
            ),
        [],
    );

    /**
     * カテゴリ一覧
     */
    const [categories, setCategories] = useState<Category[]>([]);

    /**
     * 商品一覧
     */
    const [products, setProducts] = useState<Product[]>([]);

    /**
     * 選択中のカテゴリUUID
     *
     * 空文字の場合は全商品検索を表す。
     */
    const [selectedCategoryUuid, setSelectedCategoryUuid] =
        useState<string>("");

    /**
     * API通信中かどうか
     */
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * 画面表示用エラーメッセージ
     */
    const [error, setError] = useState<string | null>(null);

    /**
     * 現在表示しているページ番号
     */
    const [currentPage, setCurrentPage] = useState<number>(1);

    /**
     * 商品検索画面の初期表示データを取得する
     */
    const initialize = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const initialData =
                await searchProductsService.getInitialData();

            setCategories(initialData.categories);
            setProducts(initialData.products);
            setCurrentPage(1);
        } catch (error: unknown) {
            console.error(
                "商品検索画面の初期表示データ取得に失敗しました。",
                error,
            );

            setCategories([]);
            setProducts([]);
            setCurrentPage(1);

            setError(
                getErrorMessage(
                    error,
                    "商品情報の取得に失敗しました",
                ),
            );
        } finally {
            setIsLoading(false);
        }
    }, [searchProductsService]);

    /**
     * 選択されたカテゴリの商品を検索する
     */
    const search = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const searchedProducts =
                await searchProductsService.search(
                    selectedCategoryUuid || undefined,
                );

            setProducts(searchedProducts);
            setCurrentPage(1);
        } catch (error: unknown) {
            console.error("商品検索に失敗しました。", error);

            setProducts([]);
            setCurrentPage(1);

            setError(
                getErrorMessage(
                    error,
                    "商品情報の取得に失敗しました",
                ),
            );
        } finally {
            setIsLoading(false);
        }
    }, [searchProductsService, selectedCategoryUuid]);

    /**
     * 選択カテゴリを変更する
     *
     * @param categoryUuid 選択されたカテゴリUUID
     */
    const selectCategory = useCallback(
        (categoryUuid: string): void => {
            setSelectedCategoryUuid(categoryUuid);
        },
        [],
    );

    /**
     * 総ページ数
     *
     * 商品が0件の場合もページ数は1として扱う。
     */
    const totalPages = Math.max(
        1,
        Math.ceil(products.length / ITEMS_PER_PAGE),
    );

    /**
     * 現在のページに表示する商品一覧
     */
    const displayedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        return products.slice(startIndex, endIndex);
    }, [products, currentPage]);

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
     * 商品検索画面の初回表示時にデータを取得する
     */
    useEffect(() => {
        void initialize();
    }, [initialize]);

    return {
        categories,
        products,
        displayedProducts,
        selectedCategoryUuid,
        isLoading,
        error,
        currentPage,
        totalPages,
        itemsPerPage: ITEMS_PER_PAGE,
        selectCategory,
        search,
        changePage,
        initialize,
    };
};