"use client";

import { Button } from "@/components/ui/button";

type Props = {
    categoryName: string;
    isLoading: boolean;
    onBack: () => void;
    onSubmit: () => Promise<void>;
    onCancel: () => void;
};

/**
 * 商品カテゴリ登録確認画面
 */
export const CategoryRegisterConfirm = ({
    categoryName,
    isLoading,
    onCancel,
    onBack,
    onSubmit,
}: Props) => {
    return (
        <main className="min-h-screen bg-white text-slate-800">
            <section className="mx-auto flex min-h-[325px] max-w-5xl flex-col items-center px-6 py-10">

                {/* タイトル */}
                <h1 className="mb-10 text-3xl font-bold">
                    商品カテゴリ登録（確認）
                </h1>

                {/* 確認内容 */}
                <div className="mb-8 grid grid-cols-[140px_1fr] gap-x-6 gap-y-3 text-xl">
                    <p className="text-right">カテゴリ名</p>
                    <p>{categoryName}</p>
                </div>

                {/* ボタン */}
                <div className="flex items-center gap-3">

                    {/* キャンセル */}
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        キャンセル
                    </Button>

                    {/* 戻る */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        disabled={isLoading}
                    >
                        戻る
                    </Button>

                    {/* 登録 */}
                    <Button
                        type="button"
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "登録中..." : "登録"}
                    </Button>

                </div>

            </section>
        </main>
    );
};