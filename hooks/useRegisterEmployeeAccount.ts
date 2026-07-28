import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { IRegisterEmployeeAccountService } from "@/interfaces/IRegisterEmployeeAccountService";
import { Employee } from "@/models/Employee";
import { EmployeeAccountRegistration } from "@/models/EmployeeAccountRegistration";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

/**
 * 状態管理とサービスを繋ぐカスタムHookを実装する
 * アカウント登録画面の状態管理とイベントハンドリングを行うカスタムHook
 */
export const useRegisterEmployeeAccount = () => {
    // DIコンテナからサービスを取得する
    const service = container.get<IRegisterEmployeeAccountService>(TYPES.IRegisterEmployeeAccountService);
    // --- Stateの定義 ---
    const [formData, setFormData] = useState<EmployeeAccountRegistration>({
        employeeUuid: "",
        accountName: "",
        password: ""
    });
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [step, setStep] = useState<"input" | "confirm" | "complete">("input");

    // 入力フォームと状態を初期化して、入力画面に戻る処理
    const resetForm = useCallback(() => {
        setFormData({
            employeeUuid: "",
            accountName: "",
            password: ""
        });
        setErrors({});
        setIsSuccess(false); // モーダルを閉じる
    }, []);

    // --- 画面初期表示時に未登録社員一覧を取得する ---
    useEffect(() => {
        const fetchUnregisteredEmployees = async () => {
            try {
                const data = await service.getUnregisteredEmployees();

                console.log("未登録社員一覧:", data);
                console.log("配列？", Array.isArray(data));

                setEmployees(data);
            } catch (error: unknown) {
                console.error(error);

                setErrors((prev) => ({
                    ...prev,
                    system: "未登録社員一覧の取得に失敗しました。"
                }));
            }
        };

        fetchUnregisteredEmployees();
    }, [service]);

    // --- 入力の変更イベント ---
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // 入力した項目のエラーを消す
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }, []);

    // --- カテゴリ選択時に詳細情報を取得する ---
    const handleEmployeeChange = useCallback((employeeUuid: string) => {
        setFormData((prev) => ({
            ...prev,
            employeeUuid,
        }));

        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.employeeUuid;
            return newErrors;
        });
    },
        []
    );
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.employeeUuid) {
            newErrors.employeeUuid = "社員を選択してください。";
        }

        const accountName = formData.accountName.trim();
        if (!formData.accountName.trim()) {
            newErrors.accountName = "アカウント名を入力してください";
        } else if (accountName.length < 5) {
            newErrors.accountName =
                "アカウント名は5~20文字で入力してください";
        } else if (accountName.length > 20) {
            newErrors.accountName =
                "アカウント名は5~20文字で入力してください";
        } else if (!/^[a-zA-Z0-9]+$/.test(accountName)) {
            newErrors.accountName =
                "アカウント名は半角英数字で入力してください";
        } else if (/^(.)\1+$/.test(accountName)) {
            newErrors.accountName =
                "アカウント名は同じ文字だけでは登録できません。";
        }

        const password = formData.password.trim();

        if (!password) {
            newErrors.password = "パスワードは必須です。";
        } else if (password.length < 5) {
            newErrors.password =
                "パスワードは5~20文字で入力してください。";
        } else if (password.length > 20) {
            newErrors.password =
                "パスワードは5~20文字で入力してください。";
        } else if (!/^[a-zA-Z0-9]+$/.test(password)) {
            newErrors.password =
                "パスワードは半角英数字で入力してください。";
        } else if (/^(.)\1+$/.test(password)) {
            newErrors.password =
                "パスワードは同じ文字だけでは登録できません。";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = useCallback(() => {
        if (!validateForm()) {
            return;
        }

        setStep("confirm");
    }, [formData]);
    const handleBack = useCallback(() => {
        setStep("input");
        setErrors({});
    }, []);

    // --- [登録]ボタンクリック時にデータを永続化する ---
    const handleSubmit = useCallback(async (): Promise<void> => {
        setIsLoading(true);

        try {
            await service.registerEmployeeAccount({
                ...formData,
                accountName: formData.accountName.trim(),
                password: formData.password.trim(),
            });

            setStep("complete");
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "アカウント登録に失敗しました。";

            setErrors((prev) => ({
                ...prev,
                submit: message,
            }));

            // 登録直前に別の人が同じ名前を登録した場合など
            setStep("input");
        } finally {
            setIsLoading(false);
        }
    }, [formData, service]);

    // UIコンポーネントに必要なプロパティと関数を返す
    return {
        employees,
        formData,
        errors,
        isLoading,
        isSuccess,
        step,
        handleChange,
        handleEmployeeChange,
        handleSubmit,
        handleBack,
        handleConfirm,
        resetForm
    };
};