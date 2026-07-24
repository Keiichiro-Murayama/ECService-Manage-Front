import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { IRegisterCategoryService } from "@/interfaces/IRegisterCategoryService";
import type { Category } from "@/models/Category";
import { ChangeEvent, useCallback, useState } from "react";

/**
 * 商品カテゴリ登録画面の状態管理とイベントハンドリングを行うカスタムHook
 */
export const useRegisterCategory = () => {
    // DIコンテナからサービスを取得する
    const service = container.get<IRegisterCategoryService>(
        TYPES.IRegisterCategoryService
    );

    // -----------------------------
    // State
    // -----------------------------

    // 入力フォーム
    const [formData, setFormData] = useState<Category>({
        categoryUuid: "",
        name: "",
    });

    // エラーメッセージ
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // 通信中フラグ
    const [isLoading, setIsLoading] = useState(false);

    // 登録成功フラグ
    const [isSuccess, setIsSuccess] = useState(false);

    // 現在表示している画面
    // input：入力画面
    // confirm：確認画面
    const [step, setStep] = useState<
        "input" | "confirm" | "complete"
    >("input");
    /**
     * フォームを初期化する
     */
    const resetForm = useCallback(() => {
        setFormData({
            categoryUuid: "",
            name: "",
        });

        setErrors({});
        setIsSuccess(false);
        setStep("input");
    }, []);

    /**
     * 入力値変更
     */
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;

            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        []
    );

    /**
     * 確認画面へ進む
     */
    const handleConfirm = useCallback(() => {
        const newErrors: { [key: string]: string } = {};

        // 必須チェック
        if (!formData.name.trim()) {
            newErrors.name = "カテゴリ名を入力してください";
        }

        setErrors(newErrors);

        // エラーが無ければ確認画面へ
        if (Object.keys(newErrors).length === 0) {
            setStep("confirm");
        }
    }, [formData]);

    /**
     * 入力画面へ戻る
     */
    const handleBack = useCallback(() => {
        setStep("input");
    }, []);

    /**
     * カテゴリ登録
     */
/**
 * カテゴリ登録
 */
const handleSubmit = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
        await service.execute(formData);

        setIsSuccess(true);

        setStep("complete");
    } catch (error: any) {
        setErrors((prev) => ({
            ...prev,
            submit: error.message,
        }));

        // 入力値はそのままで入力画面へ戻る
        setStep("input");
    } finally {
        setIsLoading(false);
    }
}, [formData, service]);

    const handleRegisterMore = () => {
    setFormData({
         categoryUuid: "",
        name: "",
    });

    setErrors({});

    setStep("input");
};

    return {
        formData,
        errors,
        isLoading,
        isSuccess,
        step,
        handleChange,
        handleConfirm,
        handleBack,
        handleSubmit,
        resetForm,
        handleRegisterMore,
    };
};