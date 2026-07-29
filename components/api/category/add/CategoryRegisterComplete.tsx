"use client";

import {
  CheckCircle2,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  /** 登録したカテゴリ名 */
  categoryName: string;

  /** ホームへ戻る */
  onClose: () => void;

  /** 続けてカテゴリを登録する */
  onRegisterMore: () => void;
};

/**
 * 商品カテゴリ登録完了画面
 */
export const CategoryRegisterComplete = ({
  categoryName,
  onClose,
  onRegisterMore,
}: Props) => {
  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            商品カテゴリ登録完了
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle2 />

            <AlertTitle>
              商品カテゴリを登録しました
            </AlertTitle>

            <AlertDescription>
              商品カテゴリの登録が完了しました。
            </AlertDescription>
          </Alert>

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
              variant="outline"
              onClick={onRegisterMore}
            >
              続けて登録
            </Button>

            <Button
              type="button"
              onClick={onClose}
            >
              ホームへ戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};