"use client";

import type {
  FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import {
  CircleAlert,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRegisterCategory } from "@/hooks/useRegisterCategory";

import { CategoryRegisterComplete } from "./CategoryRegisterComplete";
import { CategoryRegisterConfirm } from "./CategoryRegisterConfirm";

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
   * 入力フォームを送信する
   */
  const onSubmit = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    handleConfirm();
  };

  /**
   * 登録完了画面
   */
  if (step === "complete") {
    return (
      <CategoryRegisterComplete
        categoryName={formData.name}
        onClose={() =>
          router.push("/")
        }
        onRegisterMore={resetForm}
      />
    );
  }

  /**
   * 登録確認画面
   */
  if (step === "confirm") {
    return (
      <CategoryRegisterConfirm
        categoryName={formData.name}
        isLoading={isLoading}
        onBack={handleBack}
        onSubmit={handleSubmit}
        onCancel={() =>
          router.push("/")
        }
      />
    );
  }

  /**
   * 登録入力画面
   */
  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            商品カテゴリ新規登録
          </CardTitle>
        </CardHeader>

        <CardContent>
          {errors.submit && (
            <Alert
              variant="destructive"
              className="mb-6"
            >
              <CircleAlert />

              <AlertDescription>
                {errors.submit}
              </AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={onSubmit}
            className="space-y-6"
            noValidate
          >
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
                disabled={isLoading}
                aria-invalid={
                  errors.name !== undefined
                }
              />

              {errors.name && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <CircleAlert className="h-4 w-4" />

                  <span>
                    {errors.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() =>
                  router.push("/")
                }
              >
                キャンセル
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
              >
                入力内容を確認する
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};