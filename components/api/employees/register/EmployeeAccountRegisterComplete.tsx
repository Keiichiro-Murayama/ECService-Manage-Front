"use client";

import { Button } from "@/components/ui/button";

/**
 * 完了画面のprops
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
    <main className="min-h-screen bg-white text-slate-800">
      <section className="mx-auto flex min-h-[325px] max-w-5xl flex-col items-center px-6 py-10">
        <h1 className="mb-10 text-3xl font-bold">
          アカウント登録完了
        </h1>

        <p className="mb-8 text-xl">
          <span className="font-semibold">
            {employeeName}
          </span>
          さんのアカウント名は
          <span className="font-semibold">
            「{accountName}」
          </span>
          になりました。
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={
              onRegisterAnother
            }
          >
            続けて新規登録する
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            閉じる
          </Button>
        </div>
      </section>
    </main>
  );
}