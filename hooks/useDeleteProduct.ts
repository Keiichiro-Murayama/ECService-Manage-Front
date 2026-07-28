"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type {
  DeleteProductConfirmationData,
  IDeleteProductService,
} from "@/interfaces/IDeleteProductService";

/**
 * 商品情報取得時の状態
 */
type ProductLoadState = {
  /**
   * この状態が対象としている商品UUID
   */
  productUuid: string;

  /**
   * 削除対象の商品情報
   */
  product: DeleteProductConfirmationData | null;

  /**
   * 商品情報を取得中かどうか
   */
  isLoading: boolean;

  /**
   * API処理で発生したエラーメッセージ
   */
  error: string | null;
};

/**
 * 例外から画面表示用のエラーメッセージを取得する
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
 * 商品削除確認画面の状態と処理を管理するカスタムフック
 *
 * @param productUuid 削除対象の商品UUID
 */
export const useDeleteProduct = (
  productUuid: string,
) => {
  /**
   * DIコンテナから商品削除サービスを取得する
   */
  const deleteProductService = useMemo(
    () =>
      container.get<IDeleteProductService>(
        TYPES.IDeleteProductService,
      ),
    [],
  );

  /**
   * 前後の空白を除去した商品UUID
   */
  const normalizedProductUuid =
    productUuid.trim();

  /**
   * 商品UUIDに関する入力エラー
   *
   * propsから計算できる値なのでstateでは管理しない
   */
  const uuidError =
    normalizedProductUuid === ""
      ? "商品UUIDが指定されていません。"
      : null;

  /**
   * 商品情報の取得状態
   */
  const [loadState, setLoadState] =
    useState<ProductLoadState>(() => ({
      productUuid: normalizedProductUuid,
      product: null,
      isLoading: normalizedProductUuid !== "",
      error: null,
    }));

  /**
   * 商品削除処理中かどうか
   */
  const [isDeleting, setIsDeleting] =
    useState(false);

  /**
   * loadStateが現在の商品UUIDに対応しているか
   */
  const isCurrentProduct =
    loadState.productUuid ===
    normalizedProductUuid;

  /**
   * 商品削除確認画面の表示データを再取得する
   *
   * 再読み込みボタンなどのイベントから呼び出す
   */
  const initialize =
    useCallback(async (): Promise<void> => {
      if (normalizedProductUuid === "") {
        return;
      }

      setLoadState({
        productUuid: normalizedProductUuid,
        product: null,
        isLoading: true,
        error: null,
      });

      try {
        const confirmationData =
          await deleteProductService
            .getConfirmationData(
              normalizedProductUuid,
            );

        setLoadState({
          productUuid: normalizedProductUuid,
          product: confirmationData,
          isLoading: false,
          error: null,
        });
      } catch (caughtError: unknown) {
        console.error(
          "商品削除確認画面の初期表示データ取得に失敗しました。",
          caughtError,
        );

        setLoadState({
          productUuid: normalizedProductUuid,
          product: null,
          isLoading: false,
          error: getErrorMessage(
            caughtError,
            "商品情報の取得に失敗しました。",
          ),
        });
      }
    }, [
      deleteProductService,
      normalizedProductUuid,
    ]);

  /**
   * 商品削除を実行する
   *
   * @returns 削除に成功した場合true、失敗した場合false
   */
  const deleteProduct =
    useCallback(async (): Promise<boolean> => {
      if (normalizedProductUuid === "") {
        return false;
      }

      setIsDeleting(true);

      setLoadState((previousState) => ({
        ...previousState,
        productUuid: normalizedProductUuid,
        error: null,
      }));

      try {
        await deleteProductService.execute(
          normalizedProductUuid,
        );

        return true;
      } catch (caughtError: unknown) {
        console.error(
          "商品の削除に失敗しました。",
          caughtError,
        );

        setLoadState((previousState) => ({
          ...previousState,
          productUuid: normalizedProductUuid,
          error: getErrorMessage(
            caughtError,
            "商品の削除に失敗しました。",
          ),
        }));

        return false;
      } finally {
        setIsDeleting(false);
      }
    }, [
      deleteProductService,
      normalizedProductUuid,
    ]);

  /**
   * 画面初期表示時または商品UUID変更時に
   * 削除対象の商品情報を取得する
   */
  useEffect(() => {
    if (normalizedProductUuid === "") {
      return;
    }

    /**
     * 画面遷移後やアンマウント後に
     * stateを更新しないためのフラグ
     */
    let cancelled = false;

    const requestedProductUuid =
      normalizedProductUuid;

    /*
     * Effect内では同期的にsetStateを呼ばず、
     * APIのPromiseが完了した後にstateを更新する。
     */
    deleteProductService
      .getConfirmationData(
        requestedProductUuid,
      )
      .then((confirmationData) => {
        if (cancelled) {
          return;
        }

        setLoadState({
          productUuid: requestedProductUuid,
          product: confirmationData,
          isLoading: false,
          error: null,
        });
      })
      .catch((caughtError: unknown) => {
        if (cancelled) {
          return;
        }

        console.error(
          "商品削除確認画面の初期表示データ取得に失敗しました。",
          caughtError,
        );

        setLoadState({
          productUuid: requestedProductUuid,
          product: null,
          isLoading: false,
          error: getErrorMessage(
            caughtError,
            "商品情報の取得に失敗しました。",
          ),
        });
      });

    /**
     * コンポーネントのアンマウント時、
     * または商品UUID変更時に古い取得結果を無視する
     */
    return () => {
      cancelled = true;
    };
  }, [
    deleteProductService,
    normalizedProductUuid,
  ]);

  return {
    /**
     * UUIDが正常で、現在のUUIDに対応する商品のみ返す
     */
    product:
      uuidError === null &&
      isCurrentProduct
        ? loadState.product
        : null,

    /**
     * UUIDが正常で、まだ現在の商品情報がない場合も
     * 読み込み中として扱う
     */
    isLoading:
      uuidError === null &&
      (
        !isCurrentProduct ||
        loadState.isLoading
      ),

    isDeleting,

    /**
     * UUIDエラーを優先して返す
     */
    error:
      uuidError ??
      (
        isCurrentProduct
          ? loadState.error
          : null
      ),

    initialize,
    deleteProduct,
  };
};