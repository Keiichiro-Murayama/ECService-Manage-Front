"use client";

import {
  type ChangeEvent,
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
import type { IRegisterProductService } from "@/interfaces/IRegisterProductService";
import type { Category } from "@/models/Category";
import type { ProductRegisterRequest } from "@/models/ProductRegisterRequest";
import {
  productRegisterSchema,
  type ProductRegisterFormInput,
  type ProductRegisterFormValues,
} from "@/schemas/productRegisterSchema";

/**
 * 新商品登録画面の表示段階
 */
type RegisterProductStep =
  | "input"
  | "confirm"
  | "complete";

/**
 * 新商品登録フォームの初期値
 */
const DEFAULT_VALUES: ProductRegisterFormInput = {
  productName: "",
  price: "",
  stock: "",
  categoryUuid: "",
  image: null,
};

/**
 * 例外から画面表示用メッセージを取得する
 *
 * @param error 発生した例外
 * @param fallbackMessage 代替メッセージ
 * @returns 画面表示用メッセージ
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
 * 新商品登録画面の状態と処理を管理するカスタムHook
 */
export const useRegisterProduct = () => {
  /**
   * DIコンテナから新商品登録サービスを取得する
   */
  const registerProductService = useMemo(
    () =>
      container.get<IRegisterProductService>(
        TYPES.IRegisterProductService,
      ),
    [],
  );

  /**
   * 商品カテゴリ一覧
   */
  const [categories, setCategories] = useState<
    Category[]
  >([]);

  /**
   * カテゴリ一覧を取得中かどうか
   */
  const [
    isInitializing,
    setIsInitializing,
  ] = useState<boolean>(false);

  /**
   * 現在表示している画面
   */
  const [step, setStep] =
    useState<RegisterProductStep>("input");

  /**
   * 確認画面へ渡す検証済みの商品情報
   */
  const [
    confirmedValues,
    setConfirmedValues,
  ] =
    useState<ProductRegisterFormValues | null>(
      null,
    );

  /**
   * 選択した画像のプレビューURL
   */
  const [
    imagePreviewUrl,
    setImagePreviewUrl,
  ] = useState<string>("");

  /**
   * ファイル入力欄を初期化するためのキー
   */
  const [
    imageInputKey,
    setImageInputKey,
  ] = useState<number>(0);

  /**
   * react-hook-formの初期化
   *
   * 第1型引数：フォーム入力中の型
   * 第3型引数：zod検証後の型
   */
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
    ProductRegisterFormInput,
    unknown,
    ProductRegisterFormValues
  >({
    resolver: zodResolver(
      productRegisterSchema,
    ),
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
   * 選択中の画像ファイル
   */
  const selectedImage = watch("image");

  /**
   * 選択中の商品カテゴリ
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
   * 商品カテゴリ一覧を取得する
   */
  const initialize =
    useCallback(async (): Promise<void> => {
      setIsInitializing(true);

      /*
       * rootを含むフォーム全体のエラーを消す
       */
      clearErrors();

      try {
        const categoryList =
          await registerProductService.getCategories();

        setCategories(categoryList);
      } catch (error: unknown) {
        console.error(
          "商品カテゴリ一覧の取得に失敗しました。",
          error,
        );

        setCategories([]);

        /*
         * 特定項目ではなく、
         * フォーム全体のエラーとして設定する
         */
        setError("root", {
          type: "server",
          message: getErrorMessage(
            error,
            "商品カテゴリ一覧の取得に失敗しました。",
          ),
        });
      } finally {
        setIsInitializing(false);
      }
    }, [
      clearErrors,
      registerProductService,
      setError,
    ]);

  /**
   * 商品カテゴリを変更する
   *
   * shadcn/uiのSelectは通常のinputではないため、
   * setValueでreact-hook-formへ値を登録する
   *
   * @param categoryUuid 商品カテゴリUUID
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

      /*
       * カテゴリ項目のエラーだけを消す
       */
      clearErrors("categoryUuid");
    },
    [
      clearErrors,
      setValue,
    ],
  );

  /**
   * 商品画像を変更する
   *
   * ファイル入力はregisterではなく、
   * setValueでreact-hook-formへ値を登録する
   *
   * @param event ファイル入力イベント
   */
  const handleImageChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
    ): void => {
      const imageFile =
        event.target.files?.[0] ?? null;

      setValue(
        "image",
        imageFile,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        },
      );

      /*
       * 画像項目のエラーだけを消す
       */
      clearErrors("image");

      setImagePreviewUrl((previousUrl) => {
        if (previousUrl !== "") {
          URL.revokeObjectURL(
            previousUrl,
          );
        }

        if (imageFile === null) {
          return "";
        }

        return URL.createObjectURL(
          imageFile,
        );
      });
    },
    [
      clearErrors,
      setValue,
    ],
  );

  /**
   * 確認画面へ進む
   *
   * zodの検証を通過した値だけが渡される
   */
  const confirmProduct:
    SubmitHandler<ProductRegisterFormValues> =
    useCallback(
      (
        values: ProductRegisterFormValues,
      ): void => {
        /*
         * rootを含むフォーム全体のエラーを消す
         */
        clearErrors();

        setConfirmedValues(values);
        setStep("confirm");
      },
      [clearErrors],
    );

  /**
   * 確認画面へ進む処理
   */
  const handleConfirm =
    handleSubmit(confirmProduct);

  /**
   * 入力画面へ戻る
   */
  const handleBack = useCallback((): void => {
    /*
     * rootを含むフォーム全体のエラーを消す
     */
    clearErrors();

    setStep("input");
  }, [clearErrors]);

  /**
   * 商品を登録する
   *
   * 1. 商品画像をアップロードする
   * 2. 取得した画像URLを商品登録APIへ渡す
   */
  const registerProduct:
    SubmitHandler<ProductRegisterFormValues> =
    useCallback(
      async (
        values: ProductRegisterFormValues,
      ): Promise<void> => {
        /*
         * rootを含むフォーム全体のエラーを消す
         */
        clearErrors();

        try {
          /**
           * 商品画像を先にアップロードする
           */
          const imageUrl =
            await registerProductService
              .uploadProductImage(
                values.image,
              );

          /**
           * 商品登録APIへ渡すリクエスト
           */
          const request:
            ProductRegisterRequest = {
            productName:
              values.productName.trim(),

            price: values.price,

            stock: values.stock,

            categoryUuid:
              values.categoryUuid,

            imageUrl,
          };

          await registerProductService.register(
            request,
          );

          setConfirmedValues(values);
          setStep("complete");
        } catch (error: unknown) {
          console.error(
            "新商品登録に失敗しました。",
            error,
          );

          /*
           * APIエラーをフォーム全体のエラーへ設定する
           */
          setError("root", {
            type: "server",
            message: getErrorMessage(
              error,
              "新商品登録に失敗しました。",
            ),
          });
        }
      },
      [
        clearErrors,
        registerProductService,
        setError,
      ],
    );

  /**
   * 商品登録処理
   */
  const handleRegister =
    handleSubmit(registerProduct);

  /**
   * 入力内容を初期化する
   */
  const resetForm = useCallback((): void => {
    setImagePreviewUrl(
      (previousUrl) => {
        if (previousUrl !== "") {
          URL.revokeObjectURL(
            previousUrl,
          );
        }

        return "";
      },
    );

    reset(DEFAULT_VALUES);

    setConfirmedValues(null);
    setStep("input");

    /*
     * file inputはvalueを直接変更できないため、
     * keyを変更して再生成する
     */
    setImageInputKey(
      (previous) => previous + 1,
    );
  }, [reset]);

  /**
   * 初期表示時にカテゴリ一覧を取得する
   */
  useEffect(() => {
    void initialize();
  }, [initialize]);

  /**
   * コンポーネント破棄時に
   * 画像プレビューURLを解放する
   */
  useEffect(() => {
    return () => {
      if (imagePreviewUrl !== "") {
        URL.revokeObjectURL(
          imagePreviewUrl,
        );
      }
    };
  }, [imagePreviewUrl]);

  return {
    /**
     * react-hook-form
     */
    register,
    errors,

    /**
     * 画面データ
     */
    categories,
    selectedCategory,
    selectedCategoryUuid,
    selectedImage,
    confirmedValues,
    imagePreviewUrl,
    imageInputKey,

    /**
     * 画面状態
     */
    step,
    isInitializing,
    isSubmitting,

    isLoading:
      isInitializing ||
      isSubmitting,

    /**
     * イベント処理
     */
    handleCategoryChange,
    handleImageChange,
    handleConfirm,
    handleBack,
    handleRegister,
    resetForm,
    initialize,
  };
};