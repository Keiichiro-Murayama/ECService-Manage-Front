"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { IUpdateProductService } from "@/interfaces/IUpdateProductService";
import type { Category } from "@/models/Category";
import type { ProductDetail } from "@/models/ProductDetail";
import type { ProductUpdateRequest } from "@/models/ProductUpdateRequest";
import {
  productUpdateSchema,
  type ProductUpdateFormInput,
  type ProductUpdateFormValues,
} from "@/schemas/productUpdateSchema";

/**
 * 商品修正画面の表示段階
 */
type UpdateProductStep =
  | "input"
  | "confirm"
  | "complete";

/**
 * 商品修正フォームの初期値
 */
const DEFAULT_VALUES: ProductUpdateFormInput = {
  productName: "",
  price: "",
  stock: "",
  categoryUuid: "",
};

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
 * 商品修正画面の状態と処理を管理するカスタムHook
 *
 * @param productUuid 商品UUID
 */
export const useUpdateProduct = (
  productUuid: string,
) => {
  /**
   * DIコンテナから商品修正サービスを取得する
   */
  const updateProductService = useMemo(
    () =>
      container.get<IUpdateProductService>(
        TYPES.IUpdateProductService,
      ),
    [],
  );

  /**
   * 修正対象の商品情報
   */
  const [product, setProduct] =
    useState<ProductDetail | null>(null);

  /**
   * カテゴリ一覧
   */
  const [categories, setCategories] = useState<
    Category[]
  >([]);

  /**
   * 現在の表示段階
   */
  const [step, setStep] =
    useState<UpdateProductStep>("input");

  /**
   * 確認画面へ渡す入力内容
   */
  const [
    confirmedValues,
    setConfirmedValues,
  ] =
    useState<ProductUpdateFormValues | null>(
      null,
    );

  /**
   * 初期表示データを取得中かどうか
   */
  const [
    isInitializing,
    setIsInitializing,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<
    ProductUpdateFormInput,
    unknown,
    ProductUpdateFormValues
  >({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  /**
   * 選択中のカテゴリUUID
   */
  const selectedCategoryUuid =
    watch("categoryUuid");

  /**
   * 選択中のカテゴリ
   */
  const selectedCategory = useMemo(
    () =>
      categories.find(
        (category) =>
          category.categoryUuid ===
          selectedCategoryUuid,
      ),
    [
      categories,
      selectedCategoryUuid,
    ],
  );

  /**
   * 商品情報とカテゴリ一覧を取得する
   */
  const initialize =
    useCallback(async (): Promise<void> => {
      setIsInitializing(true);
      clearErrors();
      setProduct(null);
      setCategories([]);
      setConfirmedValues(null);
      setStep("input");

      try {
        const initialData =
          await updateProductService.getInitialData(
            productUuid,
          );

        setProduct(initialData.product);
        setCategories(initialData.categories);

        reset({
          productName:
            initialData.product.productName,
          price: String(initialData.product.price),
          stock: String(initialData.product.stock),
          categoryUuid:
            initialData.product.categoryUuid,
        });
      } catch (error: unknown) {
        console.error(
          "商品修正画面の初期表示に失敗しました。",
          error,
        );

        setError("root", {
          type: "server",
          message: getErrorMessage(
            error,
            "商品情報の取得に失敗しました。",
          ),
        });
      } finally {
        setIsInitializing(false);
      }
    }, [
      clearErrors,
      productUuid,
      reset,
      setError,
      updateProductService,
    ]);

  /**
   * 商品カテゴリを変更する
   */
  const handleCategoryChange = useCallback(
    (categoryUuid: string): void => {
      setValue(
        "categoryUuid",
        categoryUuid,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        },
      );

      clearErrors("categoryUuid");
    },
    [
      clearErrors,
      setValue,
    ],
  );

  /**
   * 確認画面へ進む
   */
  const confirmProduct:
    SubmitHandler<ProductUpdateFormValues> =
    useCallback(
      (
        values: ProductUpdateFormValues,
      ): void => {
        clearErrors();
        setConfirmedValues(values);
        setStep("confirm");
      },
      [clearErrors],
    );

  /**
   * 確認ボタン処理
   */
  const handleConfirm =
    handleSubmit(confirmProduct);

  /**
   * 入力画面へ戻る
   */
  const handleBack = useCallback((): void => {
    clearErrors();
    setStep("input");
  }, [clearErrors]);

  /**
   * 商品情報を更新する
   */
  const updateProduct:
    SubmitHandler<ProductUpdateFormValues> =
    useCallback(
      async (
        values: ProductUpdateFormValues,
      ): Promise<void> => {
        clearErrors();

        if (product === null) {
          setError("root", {
            type: "server",
            message:
              "更新対象の商品情報を確認できませんでした。",
          });

          return;
        }

        try {
          const request: ProductUpdateRequest = {
            productUuid:
              product.productUuid,
            productName:
              values.productName.trim(),
            price: values.price,
            stock: values.stock,
            categoryUuid:
              values.categoryUuid,

            /*
             * 現在の商品画像を変更せず、
             * 既存の画像URLをそのまま送信する。
             */
            imageUrl: product.imageUrl,
          };

          await updateProductService.update(
            product.productUuid,
            request,
          );

          setConfirmedValues(values);
          setStep("complete");
        } catch (error: unknown) {
          console.error(
            "商品の更新に失敗しました。",
            error,
          );

          setError("root", {
            type: "server",
            message: getErrorMessage(
              error,
              "商品の更新に失敗しました。",
            ),
          });
        }
      },
      [
        clearErrors,
        product,
        setError,
        updateProductService,
      ],
    );

  /**
   * 更新ボタン処理
   */
  const handleUpdate =
    handleSubmit(updateProduct);

  /**
   * 初期表示時に商品情報を取得する
   */
  useEffect(() => {
    void initialize();
  }, [initialize]);

  return {
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

    isLoading:
      isInitializing ||
      isSubmitting,

    handleCategoryChange,
    handleConfirm,
    handleBack,
    handleUpdate,
    initialize,
  };
};