"use client";


type Props = {
    employeeName: string;
    accountName: string;
    password: string;
    isLoading: boolean;
    onBack: () => void;
    onSubmit: () => void;
};

export const EmployeeAccountRegisterConfirm = ({
    employeeName,
    accountName,
    password,
    isLoading,
    onBack,
    onSubmit,
}: Props) => {
    return (
        <div className="flex flex-col items-center py-10">
            <h1 className="mb-10 text-3xl font-bold">
                アカウント登録（確認）
            </h1>

            <div className="mb-8 grid grid-cols-[140px_1fr] gap-x-6 gap-y-4 text-lg">
                <p className="text-right">社員名</p>
                <p>{employeeName}</p>

                <p className="text-right">アカウント名</p>
                <p>{accountName}</p>

                <p className="text-right">パスワード</p>
                <p>{"*".repeat(password.length)}</p>
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isLoading}
                    className="rounded border-2 border-emerald-500 px-6 py-2 font-bold text-emerald-600"
                >
                    戻る
                </button>

                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="rounded border-2 border-emerald-500 px-6 py-2 font-bold text-emerald-600"
                >
                    {isLoading ? "登録中..." : "登録"}
                </button>
            </div>
        </div>
    );
};