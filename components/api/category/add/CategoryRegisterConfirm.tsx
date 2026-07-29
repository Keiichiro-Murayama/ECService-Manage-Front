"use client";

import {
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  /** 登録するカテゴリ名 */
  categoryName: string;

  /** 登録処理中かどうか */
  isLoading: boolean;

  /** 入力画面へ戻る */
  onBack: () => void;

  /** カテゴリを登録する */
  onSubmit: () => Promise<void>;

  /** 登録を中止する */
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
    <main className="mx-auto w-full max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            商品カテゴリ登録確認
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <dl className="grid grid-cols-1 gap-4 rounded-md border p-4 sm:grid-cols-[160px_1fr] sm:gap-x-6">
              <dt className="font-semibold">
                カテゴリ名
              </dt>

              <dd className="break-words">
                {categoryName}
              </dd>
            </dl>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isLoading}
              >
                キャンセル
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isLoading}
              >
                戻る
              </Button>

              <Button
                type="button"
                onClick={() => {
                  void onSubmit();
                }}
                disabled={isLoading}
              >
                {isLoading && (
                  <LoaderCircle className="animate-spin" />
                )}

                {isLoading
                  ? "登録中..."
                  : "登録"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};