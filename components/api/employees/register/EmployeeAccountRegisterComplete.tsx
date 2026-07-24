"use client";

type Props = {
    employeeName: string;
    accountName: string;
    onClose: () => void;
};

export default function EmployeeAccountRegisterComplete({
    employeeName,
    accountName,
    onClose,
}: Props) {
    return (
        <main className="min-h-screen bg-white text-slate-800">
            <section className="mx-auto flex min-h-[325px] max-w-5xl flex-col items-center px-6 py-10">
                <h1 className="mb-10 text-3xl font-bold">
                    アカウント登録完了
                </h1>

                <p className="mb-8 text-xl">
                    {employeeName}さんのアカウントを
                    「{accountName}」で登録しました。
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border-2 border-emerald-500 px-6 py-2 text-xl font-bold text-emerald-600 transition hover:bg-emerald-50"
                >
                    閉じる
                </button>
            </section>
        </main>
    );
}