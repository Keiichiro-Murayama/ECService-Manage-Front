"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";

import type { IUpdateOrderStatusService } from
  "@/interfaces/IUpdateOrderStatusService";

import type {
  OrderStatusOption,
  OrderStatusUpdateData,
} from "@/models/OrderStatusUpdateData";

import type { UpdateOrderStatusResponse } from
  "@/models/UpdateOrderStatusResponse";

/**
 * 注文ステータス更新画面の表示段階
 */
type OrderStatusUpdateStep =
  | "input"
  | "confirm"
  | "complete";

/**
 * 例外から画面表示用メッセージを取得する
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
 * 注文ステータス更新画面の状態管理
 */
export const useUpdateOrderStatus = (
  orderUuid: string,
) => {
  const updateOrderStatusService =
    useMemo(
      () =>
        container.get<IUpdateOrderStatusService>(
          TYPES.IUpdateOrderStatusService,
        ),
      [],
    );

  /**
   * 注文情報
   */
  const [
    orderData,
    setOrderData,
  ] =
    useState<OrderStatusUpdateData | null>(
      null,
    );

  /**
   * 選択中の注文ステータスID
   */
  const [
    selectedOrderStatusId,
    setSelectedOrderStatusId,
  ] = useState<string>("");

  /**
   * 更新結果
   */
  const [
    updateResult,
    setUpdateResult,
  ] =
    useState<UpdateOrderStatusResponse | null>(
      null,
    );

  /**
   * 画面の表示段階
   */
  const [
    step,
    setStep,
  ] =
    useState<OrderStatusUpdateStep>(
      "input",
    );

  /**
   * 初期表示読み込み中
   */
  const [
    isLoading,
    setIsLoading,
  ] = useState<boolean>(false);

  /**
   * 更新処理中
   */
  const [
    isUpdating,
    setIsUpdating,
  ] = useState<boolean>(false);

  /**
   * エラーメッセージ
   */
  const [
    error,
    setError,
  ] = useState<string | null>(null);

  /**
   * 選択中の注文ステータス
   */
  const selectedOrderStatus =
    useMemo<OrderStatusOption | undefined>(
      () => {
        if (orderData === null) {
          return undefined;
        }

        const orderStatusId =
          Number(selectedOrderStatusId);

        return orderData.orderStatuses.find(
          (orderStatus) =>
            orderStatus.orderStatusId ===
            orderStatusId,
        );
      },
      [
        orderData,
        selectedOrderStatusId,
      ],
    );

  /**
   * 初期表示情報を取得する
   */
  const initialize =
    useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setOrderData(null);
      setUpdateResult(null);
      setStep("input");

      try {
        const initialData =
          await updateOrderStatusService
            .getInitialData(orderUuid);

        setOrderData(initialData);

        setSelectedOrderStatusId(
          String(
            initialData
              .currentOrderStatusId,
          ),
        );
      } catch (caughtError: unknown) {
        console.error(
          "注文ステータス更新情報の取得に失敗しました。",
          caughtError,
        );

        setError(
          getErrorMessage(
            caughtError,
            "注文情報の取得に失敗しました。",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      orderUuid,
      updateOrderStatusService,
    ]);

  /**
   * 注文ステータスを選択する
   */
  const changeOrderStatus =
    useCallback(
      (
        orderStatusId: string,
      ): void => {
        setSelectedOrderStatusId(
          orderStatusId,
        );

        setError(null);
      },
      [],
    );

  /**
   * 確認画面へ進む
   */
  const goToConfirm =
    useCallback((): void => {
      if (
        selectedOrderStatus === undefined
      ) {
        setError(
          "注文ステータスを選択してください。",
        );

        return;
      }

      setError(null);
      setStep("confirm");
    }, [selectedOrderStatus]);

  /**
   * 入力画面へ戻る
   */
  const backToInput =
    useCallback((): void => {
      setError(null);
      setStep("input");
    }, []);

  /**
   * 注文ステータスを更新する
   */
  const updateOrderStatus =
    useCallback(async (): Promise<void> => {
      if (
        selectedOrderStatus === undefined
      ) {
        setError(
          "注文ステータスを選択してください。",
        );

        return;
      }

      setIsUpdating(true);
      setError(null);

      try {
        const result =
          await updateOrderStatusService
            .update(
              orderUuid,
              selectedOrderStatus
                .orderStatusId,
            );

        setUpdateResult(result);
        setStep("complete");
      } catch (caughtError: unknown) {
        console.error(
          "注文ステータスの更新に失敗しました。",
          caughtError,
        );

        setError(
          getErrorMessage(
            caughtError,
            "注文ステータスの更新に失敗しました。",
          ),
        );
      } finally {
        setIsUpdating(false);
      }
    }, [
      orderUuid,
      selectedOrderStatus,
      updateOrderStatusService,
    ]);

  /**
   * 初期表示時に注文情報を取得する
   */
  useEffect(() => {
    const animationFrameId =
      window.requestAnimationFrame(
        () => {
          void initialize();
        },
      );

    return () => {
      window.cancelAnimationFrame(
        animationFrameId,
      );
    };
  }, [initialize]);

  return {
    orderData,
    selectedOrderStatusId,
    selectedOrderStatus,
    updateResult,

    step,
    isLoading,
    isUpdating,
    error,

    changeOrderStatus,
    goToConfirm,
    backToInput,
    updateOrderStatus,
    initialize,
  };
};