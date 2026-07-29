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

/**
 * 完了画面のProps
 */
type Props = {
  /** 登録した社員名 */
  employeeName: string;

  /** 登録したアカウント名 */
  accountName: string;

  /** 続けて新しい登録を始める */
  onRegisterAnother: () => void;

  /** 完了画面を閉じる */
  onClose: () => void;
};

/**
 * 担当者アカウント登録完了画面
 */
export default function EmployeeAccountRegisterComplete({
  employeeName,
  accountName,
  onRegisterAnother,
  onClose,
}: Props) {
  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            アカウント登録完了
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle2 />

            <AlertTitle>
              アカウントを登録しました
            </AlertTitle>

            <AlertDescription>
              担当者アカウントの登録が完了しました。
            </AlertDescription>
          </Alert>

          <dl className="grid grid-cols-1 gap-4 rounded-md border p-4 sm:grid-cols-[160px_1fr] sm:gap-x-6">
            <dt className="font-semibold">
              社員名
            </dt>

            <dd className="break-words">
              {employeeName}
            </dd>

            <dt className="font-semibold">
              アカウント名
            </dt>

            <dd className="break-words">
              {accountName}
            </dd>
          </dl>

          <p className="text-muted-foreground">
            {employeeName}
            さんのアカウント名は
            「{accountName}」
            になりました。
          </p>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onRegisterAnother}
            >
              続けて新規登録する
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
}