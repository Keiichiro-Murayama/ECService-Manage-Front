"use client";

import { useRegisterEmployeeAccount } from "@/hooks/useRegisterEmployeeAccount";
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
import { CircleAlert, Loader2 } from "lucide-react";
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
        isSuccess,
        handleChange,
        handleEmployeeChange,
        handleSubmit,
        resetForm,
    } = useRegisterEmployeeAccount();

    /**
     * フォーム送信時
     */
    const onSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        await handleSubmit();
    };

    return (
        <>
            <div className="container mx-auto max-w-lg py-10">
                <h1 className="mb-6 text-2xl font-bold">
                    アカウント新規登録
                </h1>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* 社員選択 */}
                    <div className="space-y-2">
                        <Label htmlFor="employeeUuid">
                            未登録社員
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

                    {/* ボタン */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="submit"
                            className="w-48"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    登録中...
                                </>
                            ) : (
                                "アカウントを登録する"
                            )}
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
                </form>
            </div>

            {/* 登録完了モーダル */}
            {isSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-80 rounded-lg bg-white p-6 text-center shadow-lg">
                        <h3 className="mb-4 text-xl font-bold">
                            登録完了
                        </h3>

                        <p className="mb-8 text-gray-600">
                            アカウントの登録が完了しました。
                        </p>

                        <Button
                            type="button"
                            onClick={resetForm}
                            className="w-full"
                        >
                            入力画面に戻る
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};