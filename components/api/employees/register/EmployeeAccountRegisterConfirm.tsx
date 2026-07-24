"use client";

import { Button} from "@/components/ui/button";

type Props = {
    employeeName: string;
    accountName: string;
    password: string;
    isLoading: boolean;
    onBack: () => void;
    onSubmit: () => Promise<void>;
    onCancel: () => void;
};

export const EmployeeAccountRegisterConfirm = ({
    employeeName,
    accountName,
    password,
    isLoading,
    onCancel,
    onBack,
    onSubmit,
}: Props) => {
    return (
        <main className="min-h-screen bg-white text-slate-800">
            <section className="mx-auto flex min-h-[325px] max-w-5xl flex-col items-center px-6 py-10">
                <h1 className="mb-10 text-3xl font-bold">
                    アカウント登録(確認)
                </h1>

                <div className="mb-8 grid grid-cols-[140px_1fr] gap-x-6 gap-y-3 text-xl">
                    <p className="text-right">社員名</p>
                    <p>{employeeName}</p>

                    <p className="text-right">アカウント名</p>
                    <p>{accountName}</p>

                    <p className="text-right">パスワード</p>
                    <p>{"*".repeat(password.length)}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-2 py-2 text-xl font-bold text-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        キャンセル
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isLoading}
                        className="rounded-md border-2 border-emerald-500 px-6 py-2 text-xl font-bold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        戻る
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isLoading}
                        className="rounded-md border-2 border-emerald-500 px-6 py-2 text-xl font-bold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "登録中..." : "登録"}
                    </button>
                </div>
            </section>
        </main>
    );
};