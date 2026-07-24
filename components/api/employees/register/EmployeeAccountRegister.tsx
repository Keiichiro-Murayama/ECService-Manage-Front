"use client";

import { useRegisterEmployeeAccount } from "@/hooks/useRegisterEmployeeAccount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmployeeAccountRegisterConfirm } from "./EmployeeAccountRegisterConfirm";
import EmployeeAccountRegisterComplete from "./EmployeeAccountRegisterComplete";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CircleAlert} from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * アカウント登録画面のUIコンポーネント
 */
export const EmployeeAccountRegister = () => {
    const router = useRouter();

    const {
        employees,
        formData,
        errors,
        isLoading,
        step,
        handleChange,
        handleEmployeeChange,
        handleSubmit,
        handleConfirm,
        handleBack
    } = useRegisterEmployeeAccount();

    /**
     * フォーム送信時
     */
    const onSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ): void => {
        e.preventDefault();
        handleConfirm();
    };
    const selectedEmployee = employees.find(
        (employee) =>
            employee.employeeUuid === formData.employeeUuid
    );
    if (step === "confirm") {
        return (
            <EmployeeAccountRegisterConfirm
                employeeName={selectedEmployee?.employeeName ?? ""}
                accountName={formData.accountName}
                password={formData.password}
                isLoading={isLoading}
                onBack={handleBack}
                onSubmit={handleSubmit}
                onCancel={() => router.push("/")}
            />
        );
    }
    if (step === "complete") {
        return (
            <EmployeeAccountRegisterComplete
                employeeName={selectedEmployee?.employeeName ?? ""}
                accountName={formData.accountName}
                onClose={() => router.push("/")}
            />
        );
    }
    return (
        <div className="container mx-auto max-w-lg py-10">
            <h1 className="mb-6 text-2xl font-bold">
                アカウント新規登録
            </h1>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* 社員選択 */}
                <div className="space-y-2">
                    <Label htmlFor="employeeUuid">
                        社員名
                    </Label>

                    <Select
                        value={formData.employeeUuid}
                        onValueChange={handleEmployeeChange}
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
                            {Array.isArray(employees) &&
                                employees.map((employee) => (
                                    <SelectItem
                                        key={employee.employeeUuid}
                                        value={employee.employeeUuid}
                                    >
                                        {employee.employeeName}
                                    </SelectItem>
                                ))}
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
                        value={formData.accountName}
                        onChange={handleChange}
                        placeholder="例：account01"
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
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="半角英数字5～20文字"
                        className={
                            errors.password
                                ? "border-red-500"
                                : ""
                        }
                    />

                    {errors.password && (
                        <div className="flex items-center gap-1 text-sm text-red-500">
                            <CircleAlert className="h-4 w-4" />
                            <span>{errors.password}</span>
                        </div>
                    )}
                </div>

                {/* 登録APIのエラー */}
                {errors.submit && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                        <CircleAlert className="h-4 w-4" />
                        <span>{errors.submit}</span>
                    </div>
                )}

                {/* 未登録社員取得などのエラー */}
                {errors.system && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                        <CircleAlert className="h-4 w-4" />
                        <span>{errors.system}</span>
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
                    onClick={() => router.push("/")}
                    disabled={isLoading}
                >
                    キャンセル
                </Button>
            </div>

        </div>
    );
};
