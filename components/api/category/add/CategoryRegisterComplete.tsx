"use client";

import { Button } from "@/components/ui/button";

type Props = {
    categoryName: string;
    onClose: () => void;
    onRegisterMore: () => void;
};
export const CategoryRegisterComplete = ({
    categoryName,
    onClose,
    onRegisterMore,
}: Props) => {
    return (
        <div className="flex flex-col items-center py-10">
            <h1 className="mb-6 text-3xl font-bold">
                商品カテゴリ登録完了
            </h1>

            <p className="mb-8">
                以下のカテゴリを登録しました。</p>

      <div className="mb-8 grid grid-cols-[140px_1fr] gap-x-6 gap-y-3 text-xl">
                    <p className="text-right">カテゴリ名</p>
                    <p>{categoryName}</p>
                </div>

                <Button
        variant="outline"
        onClick={onRegisterMore}
    >
        さらにカテゴリを登録
    </Button>
    
            <Button onClick={onClose}>
                ホームへ戻る
            </Button>
        </div>
    );
};