"use client";

import { useRegisterCategory } from "@/hooks/useRegisterCategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryRegisterConfirm } from "./CategoryRegisterConfirm";
import { CategoryRegisterComplete } from "./CategoryRegisterComplete";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * 商品カテゴリ登録画面
 */
export const CategoryRegister = () => {
    const router = useRouter();

const {
    formData,
    errors,
    isLoading,
    step,
    handleChange,
    handleConfirm,
    handleBack,
    handleSubmit,
    resetForm,
} = useRegisterCategory();

    /**
     * フォーム送信
     */
    const onSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ): void => {
        e.preventDefault();
        handleConfirm();
    };

if (step === "complete") {
    return (
        <CategoryRegisterComplete
            categoryName={formData.name}
            onClose={() => router.push("/")}
            onRegisterMore={resetForm}
        />
    );
}

    /**
     * 確認画面
     */
    if (step === "confirm") {
        return (
            <CategoryRegisterConfirm
                categoryName={formData.name}
                isLoading={isLoading}
                onBack={handleBack}
                onSubmit={handleSubmit}
                onCancel={() => router.push("/")}
            />
        );
    }



    /**
     * 入力画面
     */
    return (
        <div className="container mx-auto max-w-lg py-10">

            <h1 className="mb-6 text-2xl font-bold">
                商品カテゴリ新規登録
            </h1>

            <form
                onSubmit={onSubmit}
                className="space-y-6"
            >

                {/* カテゴリ名 */}
                <div className="space-y-2">

                    <Label htmlFor="name">
                        カテゴリ名
                    </Label>

                    <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="カテゴリ名を入力してください"
                        className={
                            errors.name
                                ? "border-red-500"
                                : ""
                        }
                    />

                    {errors.name && (
                        <div className="flex items-center gap-1 text-sm text-red-500">
                            <CircleAlert className="h-4 w-4" />
                            <span>{errors.name}</span>
                        </div>
                    )}

                </div>

                {/* 登録APIエラー */}
                {errors.submit && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                        <CircleAlert className="h-4 w-4" />
                        <span>{errors.submit}</span>
                    </div>
                )}

            </form>

            {/* ボタン */}
            <div className="flex justify-end gap-3 pt-4">

                <Button
                    type="button"
                    className="w-48"
                    onClick={handleConfirm}
                >
                    入力内容を確認する
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => router.push("/")}
                >
                    キャンセル
                </Button>

            </div>

        </div>
    );
};