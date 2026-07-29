"use client";

import type {
  FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import {
  CircleAlert,
  LoaderCircle,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRegisterEmployeeAccount } from "@/hooks/useRegisterEmployeeAccount";

import EmployeeAccountRegisterComplete from "./EmployeeAccountRegisterComplete";
import { EmployeeAccountRegisterConfirm } from "./EmployeeAccountRegisterConfirm";

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
   * 入力フォームを送信する
   */
  const onSubmit = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    handleConfirm();
  };

  /**
   * 登録確認画面
   */
  if (step === "confirm") {
    return (
      <EmployeeAccountRegisterConfirm
        employeeName={
          selectedEmployee?.employeeName ??
          ""
        }
        accountName={formData.accountName}
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
   * 登録完了画面
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
        onRegisterAnother={resetForm}
        onClose={() =>
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
            アカウント新規登録
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isInitializing && (
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />

              <span>
                未登録社員一覧を読み込んでいます。
              </span>
            </div>
          )}

          {errors.system && (
            <Alert
              variant="destructive"
              className="mb-6"
            >
              <CircleAlert />

              <AlertDescription>
                <div className="space-y-3">
                  <p>
                    {errors.system}
                  </p>

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
              </AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={onSubmit}
            className="space-y-6"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="employeeUuid">
                社員名
              </Label>

              <Select
                value={formData.employeeUuid}
                onValueChange={
                  handleEmployeeChange
                }
                disabled={isLoading}
              >
                <SelectTrigger
                  id="employeeUuid"
                  aria-invalid={
                    errors.employeeUuid !==
                    undefined
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
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <CircleAlert className="h-4 w-4" />

                  <span>
                    {errors.employeeUuid}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">
                アカウント名
              </Label>

              <Input
                id="accountName"
                name="accountName"
                type="text"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="例：account01"
                autoComplete="off"
                disabled={isLoading}
                aria-invalid={
                  errors.accountName !==
                  undefined
                }
              />

              {errors.accountName && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <CircleAlert className="h-4 w-4" />

                  <span>
                    {errors.accountName}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                パスワード
              </Label>

              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="半角英数字5～20文字"
                autoComplete="new-password"
                disabled={isLoading}
                aria-invalid={
                  errors.password !==
                  undefined
                }
              />

              {errors.password && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <CircleAlert className="h-4 w-4" />

                  <span>
                    {errors.password}
                  </span>
                </div>
              )}
            </div>

            {errors.submit && (
              <Alert variant="destructive">
                <CircleAlert />

                <AlertDescription>
                  {errors.submit}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3">
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
                disabled={
                  isLoading ||
                  employees.length === 0
                }
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