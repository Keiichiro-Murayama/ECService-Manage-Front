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
import type { IUpdateProductService } from "@/interfaces/IUpdateProductService";
import type { Category } from "@/models/Category";
import type { ProductDetail } from "@/models/ProductDetail";
import type { ProductUpdateRequest } from "@/models/ProductUpdateRequest";

import {
    productUpdateSchema,
    type ProductUpdateFormInput,
    type ProductUpdateFormValues,
} from "@/schemas/productUpdateSchema";

type UpdateProductStep =
    | "input"
    | "confirm"
    | "complete";

const DEFAULT_VALUES:
    ProductUpdateFormInput = {
    productName: "",
    price: "",
    stock: "",
    categoryUuid: "",
    image: null,
};

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
 * 商品修正画面の状態管理
 */
export const useUpdateProduct = (
    productUuid: string,
) => {
    const updateProductService = useMemo(
        () =>
            container.get<IUpdateProductService>(
                TYPES.IUpdateProductService,
            ),
        [],
    );

    const [
        product,
        setProduct,
    ] = useState<ProductDetail | null>(
        null,
    );

    const [
        categories,
        setCategories,
    ] = useState<Category[]>([]);

    const [
        step,
        setStep,
    ] = useState<UpdateProductStep>(
        "input",
    );

    const [
        confirmedValues,
        setConfirmedValues,
    ] =
        useState<ProductUpdateFormValues | null>(
            null,
        );

    const [
        imagePreviewUrl,
        setImagePreviewUrl,
    ] = useState<string>("");

    const [
        isInitializing,
        setIsInitializing,
    ] = useState<boolean>(false);

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
        resolver: zodResolver(
            productUpdateSchema,
        ),
        defaultValues: DEFAULT_VALUES,
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    const selectedCategoryUuid =
        watch("categoryUuid");

    const selectedImage =
        watch("image");

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
     * 初期表示
     */
    const initialize =
        useCallback(async (): Promise<void> => {
            setIsInitializing(true);
            clearErrors();

            try {
                const initialData =
                    await updateProductService
                        .getInitialData(productUuid);

                setProduct(
                    initialData.product,
                );

                setCategories(
                    initialData.categories,
                );

                reset({
                    productName:
                        initialData.product.productName,

                    price: String(
                        initialData.product.price,
                    ),

                    stock: String(
                        initialData.product.stock,
                    ),

                    categoryUuid:
                        initialData.product
                            .categoryUuid,

                    image: null,
                });
            } catch (error: unknown) {
                console.error(
                    "商品情報の取得に失敗しました。",
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
     * カテゴリ変更
     */
    const handleCategoryChange =
        useCallback(
            (
                categoryUuid: string,
            ): void => {
                setValue(
                    "categoryUuid",
                    categoryUuid,
                    {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                    },
                );
            },
            [setValue],
        );

    /**
     * 商品画像変更
     */
    const handleImageChange =
        useCallback(
            (
                event:
                    ChangeEvent<HTMLInputElement>,
            ): void => {
                const image =
                    event.target.files?.[0] ??
                    null;

                setValue(
                    "image",
                    image,
                    {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                    },
                );

                if (image === null) {
                    setImagePreviewUrl("");
                    return;
                }

                setImagePreviewUrl(
                    URL.createObjectURL(image),
                );
            },
            [setValue],
        );

    /**
     * 確認画面へ進む
     */
    const confirmProduct:
        SubmitHandler<ProductUpdateFormValues> =
        useCallback(
            (
                values:
                    ProductUpdateFormValues,
            ): void => {
                clearErrors();
                setConfirmedValues(values);
                setStep("confirm");
            },
            [clearErrors],
        );

    const handleConfirm =
        handleSubmit(confirmProduct);

    /**
     * 入力画面へ戻る
     */
    const handleBack =
        useCallback((): void => {
            clearErrors();
            setStep("input");
        }, [clearErrors]);

    /**
     * 商品更新
     */
    const updateProduct:
        SubmitHandler<ProductUpdateFormValues> =
        useCallback(
            async (
                values:
                    ProductUpdateFormValues,
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
                    const request:
                        ProductUpdateRequest = {
                        productUuid: product.productUuid,

                        productName:
                            values.productName.trim(),

                        price: values.price,

                        stock: values.stock,

                        categoryUuid:
                            values.categoryUuid,

                        /*
                         * Service内で新しい画像URLへ
                         * 差し替えるため現在値を渡す
                         */
                        imageUrl:
                            product.imageUrl,
                    };

                    await updateProductService
                        .update(
                            product.productUuid,
                            request,
                            values.image,
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

    const handleUpdate =
        handleSubmit(updateProduct);

    useEffect(() => {
        void initialize();
    }, [initialize]);

    /*
     * Blob形式のプレビューURLを解放する
     */
    useEffect(() => {
        return () => {
            if (
                imagePreviewUrl !== ""
            ) {
                URL.revokeObjectURL(
                    imagePreviewUrl,
                );
            }
        };
    }, [imagePreviewUrl]);

    return {
        register,
        errors,

        product,
        categories,
        selectedCategory,
        selectedCategoryUuid,
        selectedImage,
        confirmedValues,

        imagePreviewUrl:
            imagePreviewUrl ||
            product?.imageUrl ||
            "",

        step,
        isInitializing,
        isSubmitting,

        isLoading:
            isInitializing ||
            isSubmitting,

        handleCategoryChange,
        handleImageChange,
        handleConfirm,
        handleBack,
        handleUpdate,
        initialize,
    };
};