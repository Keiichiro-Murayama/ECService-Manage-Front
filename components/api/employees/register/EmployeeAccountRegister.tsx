"use client";

import type {
  FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import {
  CircleAlert,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRegisterEmployeeAccount } from "@/hooks/useRegisterEmployeeAccount";

import { EmployeeAccountRegisterConfirm } from "./EmployeeAccountRegisterConfirm";
import EmployeeAccountRegisterComplete from "./EmployeeAccountRegisterComplete";

/**
 * 担当者アカウント登録画面
 */
export const EmployeeAccountRegister = () => {
  const router = useRouter();

  const {
    employees,
    formData,
    errors,

    step,
    isLoading,
    isInitializing,

    selectedEmployee,

    registeredEmployeeName,
    registeredAccountName,

    handleChange,
    handleEmployeeChange,
    handleSubmit,
    handleConfirm,
    handleBack,
    resetForm,
    loadUnregisteredEmployees,
  } = useRegisterEmployeeAccount();

  /**
   * 入力フォーム送信
   */
  const onSubmit = (
    event:
      FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    handleConfirm();
  };

  /**
   * 確認画面
   */
  if (step === "confirm") {
    return (
      <EmployeeAccountRegisterConfirm
        employeeName={
          selectedEmployee?.employeeName ??
          ""
        }
        accountName={
          formData.accountName
        }
        password={formData.password}
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
   * 完了画面
   *
   * employeesから再検索せず、
   * 登録成功時に保存した氏名を使用する。
   */
  if (step === "complete") {
    return (
      <EmployeeAccountRegisterComplete
        employeeName={
          registeredEmployeeName
        }
        accountName={
          registeredAccountName
        }
        onRegisterAnother={
          resetForm
        }
        onClose={() =>
          router.push("/")
        }
      />
    );
  }

  /**
   * 入力画面
   */
  return (
    <div className="container mx-auto max-w-lg py-10">
      <h1 className="mb-6 text-2xl font-bold">
        アカウント新規登録
      </h1>

      {isInitializing && (
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" />

          <span>
            未登録社員一覧を読み込んでいます。
          </span>
        </div>
      )}

      {errors.system && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-1 text-sm text-red-500">
            <CircleAlert className="h-4 w-4" />

            <span>
              {errors.system}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void loadUnregisteredEmployees();
            }}
            disabled={isLoading}
          >
            再読み込み
          </Button>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-6"
        noValidate
      >
        {/* 社員選択 */}
        <div className="space-y-2">
          <Label htmlFor="employeeUuid">
            社員名
          </Label>

          <Select
            value={
              formData.employeeUuid
            }
            onValueChange={
              handleEmployeeChange
            }
            disabled={isLoading}
          >
            <SelectTrigger
              id="employeeUuid"
              className={
                errors.employeeUuid
                  ? "border-red-500"
                  : ""
              }
            >
              <SelectValue placeholder="社員を選択してください" />
            </SelectTrigger>

            <SelectContent>
              {employees.map(
                (employee) => (
                  <SelectItem
                    key={
                      employee.employeeUuid
                    }
                    value={
                      employee.employeeUuid
                    }
                  >
                    {
                      employee.employeeName
                    }
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          {errors.employeeUuid && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <CircleAlert className="h-4 w-4" />

              <span>
                {errors.employeeUuid}
              </span>
            </div>
          )}
        </div>

        {/* アカウント名 */}
        <div className="space-y-2">
          <Label htmlFor="accountName">
            アカウント名
          </Label>

          <Input
            id="accountName"
            name="accountName"
            type="text"
            value={
              formData.accountName
            }
            onChange={handleChange}
            placeholder="例：account01"
            autoComplete="off"
            disabled={isLoading}
            className={
              errors.accountName
                ? "border-red-500"
                : ""
            }
          />

          {errors.accountName && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <CircleAlert className="h-4 w-4" />

              <span>
                {errors.accountName}
              </span>
            </div>
          )}
        </div>

        {/* パスワード */}
        <div className="space-y-2">
          <Label htmlFor="password">
            パスワード
          </Label>

          <Input
            id="password"
            name="password"
            type="password"
            value={
              formData.password
            }
            onChange={handleChange}
            placeholder="半角英数字5～20文字"
            autoComplete="new-password"
            disabled={isLoading}
            className={
              errors.password
                ? "border-red-500"
                : ""
            }
          />

          {errors.password && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <CircleAlert className="h-4 w-4" />

              <span>
                {errors.password}
              </span>
            </div>
          )}
        </div>

        {/* 登録APIエラー */}
        {errors.submit && (
          <div className="flex items-center gap-1 text-sm text-red-500">
            <CircleAlert className="h-4 w-4" />

            <span>
              {errors.submit}
            </span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push("/")
            }
            disabled={isLoading}
          >
            キャンセル
          </Button>

          <Button
            type="submit"
            className="w-48"
            disabled={
              isLoading ||
              employees.length === 0
            }
          >
            入力内容を確認する
          </Button>
        </div>
      </form>
    </div>
  );
};