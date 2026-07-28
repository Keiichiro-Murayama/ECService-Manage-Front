"use client";

import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";

import type { IRegisterEmployeeAccountService } from "@/interfaces/IRegisterEmployeeAccountService";
import type { Employee } from "@/models/Employee";
import type { EmployeeAccountRegistration } from "@/models/EmployeeAccountRegistration";

/**
 * アカウント登録画面の表示段階
 */
type RegisterEmployeeAccountStep =
  | "input"
  | "confirm"
  | "complete";

/**
 * フォームエラー
 */
type FormErrors = {
  employeeUuid?: string;
  accountName?: string;
  password?: string;
  system?: string;
  submit?: string;
};

/**
 * フォームの初期値
 */
const INITIAL_FORM_DATA:
  EmployeeAccountRegistration = {
    employeeUuid: "",
    accountName: "",
    password: "",
  };

/**
 * 例外からエラーメッセージを取得する
 */
const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (
    error instanceof Error &&
    error.message.trim() !== ""
  ) {
    return error.message;
  }

  return fallbackMessage;
};

/**
 * 担当者アカウント登録画面の状態と処理を管理するHook
 */
export const useRegisterEmployeeAccount = () => {
  /**
   * Serviceを画面の再描画ごとに作り直さない
   */
  const service = useMemo(
    () =>
      container.get<IRegisterEmployeeAccountService>(
        TYPES.IRegisterEmployeeAccountService,
      ),
    [],
  );

  /**
   * 入力内容
   */
  const [formData, setFormData] =
    useState<EmployeeAccountRegistration>({
      ...INITIAL_FORM_DATA,
    });

  /**
   * 未登録社員一覧
   */
  const [employees, setEmployees] =
    useState<Employee[]>([]);

  /**
   * 入力・APIエラー
   */
  const [errors, setErrors] =
    useState<FormErrors>({});

  /**
   * 初期表示処理中
   */
  const [
    isInitializing,
    setIsInitializing,
  ] = useState(false);

  /**
   * 登録処理中
   */
  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  /**
   * 登録成功状態
   */
  const [
    isSuccess,
    setIsSuccess,
  ] = useState(false);

  /**
   * 現在の表示段階
   */
  const [step, setStep] =
    useState<RegisterEmployeeAccountStep>(
      "input",
    );

  /**
   * 登録完了画面へ表示する社員名
   *
   * 未登録社員一覧から社員を削除しても、
   * 完了画面で名前を表示できるよう別管理する。
   */
  const [
    registeredEmployeeName,
    setRegisteredEmployeeName,
  ] = useState("");

  /**
   * 登録完了画面へ表示するアカウント名
   */
  const [
    registeredAccountName,
    setRegisteredAccountName,
  ] = useState("");

  /**
   * API処理中かどうか
   */
  const isLoading =
    isInitializing || isSubmitting;

  /**
   * 現在選択している社員
   */
  const selectedEmployee = useMemo(
    () =>
      employees.find(
        (employee) =>
          employee.employeeUuid ===
          formData.employeeUuid,
      ),
    [
      employees,
      formData.employeeUuid,
    ],
  );

  /**
   * 未登録社員一覧を取得する
   */
  const loadUnregisteredEmployees =
    useCallback(async (): Promise<void> => {
      setIsInitializing(true);

      setErrors((previous) => ({
        ...previous,
        system: undefined,
      }));

      try {
        const unregisteredEmployees =
          await service
            .getUnregisteredEmployees();

        setEmployees(
          unregisteredEmployees,
        );
      } catch (error: unknown) {
        console.error(
          "未登録社員一覧の取得に失敗しました。",
          error,
        );

        setEmployees([]);

        setErrors((previous) => ({
          ...previous,
          system: getErrorMessage(
            error,
            "未登録社員一覧の取得に失敗しました。",
          ),
        }));
      } finally {
        setIsInitializing(false);
      }
    }, [service]);

  /**
   * 初回表示
   */
  useEffect(() => {
    /*
     * 初回表示では必ず空欄から始める
     */
    setFormData({
      employeeUuid: "",
      accountName: "",
      password: "",
    });

    setErrors({});
    setStep("input");
    setIsSuccess(false);
    setRegisteredEmployeeName("");
    setRegisteredAccountName("");

    void loadUnregisteredEmployees();
  }, [loadUnregisteredEmployees]);

  /**
   * テキスト入力を変更する
   */
  const handleChange = useCallback(
    (
      event:
        ChangeEvent<HTMLInputElement>,
    ): void => {
      const {
        name,
        value,
      } = event.target;

      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }));

      setErrors((previous) => ({
        ...previous,
        [name]: undefined,
        submit: undefined,
      }));
    },
    [],
  );

  /**
   * 社員選択を変更する
   */
  const handleEmployeeChange =
    useCallback(
      (
        employeeUuid: string,
      ): void => {
        setFormData((previous) => ({
          ...previous,
          employeeUuid,
        }));

        setErrors((previous) => ({
          ...previous,
          employeeUuid: undefined,
          submit: undefined,
        }));
      },
      [],
    );

  /**
   * 入力内容を検証する
   */
  const validateForm =
    useCallback((): boolean => {
      const newErrors:
        FormErrors = {};

      const employeeUuid =
        formData.employeeUuid.trim();

      const accountName =
        formData.accountName.trim();

      const password =
        formData.password.trim();

      if (employeeUuid === "") {
        newErrors.employeeUuid =
          "社員を選択してください。";
      }

      if (accountName === "") {
        newErrors.accountName =
          "アカウント名を入力してください。";
      } else if (
        accountName.length < 5 ||
        accountName.length > 20
      ) {
        newErrors.accountName =
          "アカウント名は5～20文字で入力してください。";
      } else if (
        !/^[a-zA-Z0-9]+$/.test(
          accountName,
        )
      ) {
        newErrors.accountName =
          "アカウント名は半角英数字で入力してください。";
      } else if (
        /^(.)\1+$/.test(accountName)
      ) {
        newErrors.accountName =
          "アカウント名は同じ文字だけでは登録できません。";
      }

      if (password === "") {
        newErrors.password =
          "パスワードを入力してください。";
      } else if (
        password.length < 5 ||
        password.length > 20
      ) {
        newErrors.password =
          "パスワードは5～20文字で入力してください。";
      } else if (
        !/^[a-zA-Z0-9]+$/.test(
          password,
        )
      ) {
        newErrors.password =
          "パスワードは半角英数字で入力してください。";
      } else if (
        /^(.)\1+$/.test(password)
      ) {
        newErrors.password =
          "パスワードは同じ文字だけでは登録できません。";
      }

      setErrors(newErrors);

      return (
        Object.keys(newErrors)
          .length === 0
      );
    }, [formData]);

  /**
   * 確認画面へ進む
   */
  const handleConfirm =
    useCallback((): void => {
      if (!validateForm()) {
        return;
      }

      setErrors({});
      setStep("confirm");
    }, [validateForm]);

  /**
   * 確認画面から入力画面へ戻る
   *
   * 入力内容は保持する。
   */
  const handleBack =
    useCallback((): void => {
      setErrors({});
      setStep("input");
    }, []);

  /**
   * 次の新規登録を開始する
   *
   * 社員・アカウント名・パスワードを
   * すべて空欄に戻す。
   */
  const resetForm =
    useCallback((): void => {
      setFormData({
        employeeUuid: "",
        accountName: "",
        password: "",
      });

      setErrors({});
      setIsSuccess(false);
      setRegisteredEmployeeName("");
      setRegisteredAccountName("");
      setStep("input");

      /*
       * 別の利用者による登録も考慮し、
       * 未登録社員一覧を最新化する。
       */
      void loadUnregisteredEmployees();
    }, [loadUnregisteredEmployees]);

  /**
   * 担当者アカウントを登録する
   */
  const handleSubmit =
    useCallback(async (): Promise<void> => {
      /*
       * ボタン連打による二重登録防止
       */
      if (isSubmitting) {
        return;
      }

      const registration:
        EmployeeAccountRegistration = {
          employeeUuid:
            formData.employeeUuid.trim(),

          accountName:
            formData.accountName.trim(),

          password:
            formData.password.trim(),
        };

      /*
       * 登録前に社員名を保存する。
       *
       * 登録成功後は社員を未登録一覧から除外するため、
       * 後からemployees.find()すると見つからなくなる。
       */
      const employeeName =
        selectedEmployee?.employeeName ??
        "";

      if (employeeName === "") {
        setErrors((previous) => ({
          ...previous,
          employeeUuid:
            "選択した社員情報を確認できませんでした。",
        }));

        setStep("input");

        return;
      }

      setIsSubmitting(true);
      setIsSuccess(false);

      setErrors((previous) => ({
        ...previous,
        submit: undefined,
      }));

      try {
        await service
          .registerEmployeeAccount(
            registration,
          );

        /*
         * 完了画面用の情報を保存する
         */
        setRegisteredEmployeeName(
          employeeName,
        );

        setRegisteredAccountName(
          registration.accountName,
        );

        /*
         * 登録済み社員を
         * 未登録社員一覧から除外する
         */
        setEmployees((previous) =>
          previous.filter(
            (employee) =>
              employee.employeeUuid !==
              registration.employeeUuid,
          ),
        );

        setIsSuccess(true);
        setStep("complete");
      } catch (error: unknown) {
        console.error(
          "担当者アカウントの登録に失敗しました。",
          error,
        );

        setErrors((previous) => ({
          ...previous,
          submit: getErrorMessage(
            error,
            "担当者アカウントの登録に失敗しました。",
          ),
        }));

        setStep("input");

        /*
         * 別の利用者が先に登録した可能性があるため、
         * 未登録社員一覧を再取得する。
         */
        try {
          const latestEmployees =
            await service
              .getUnregisteredEmployees();

          setEmployees(
            latestEmployees,
          );

          const selectedEmployeeExists =
            latestEmployees.some(
              (employee) =>
                employee.employeeUuid ===
                registration.employeeUuid,
            );

          if (
            !selectedEmployeeExists
          ) {
            setFormData(
              (previous) => ({
                ...previous,
                employeeUuid: "",
              }),
            );
          }
        } catch (
          refreshError: unknown
        ) {
          console.error(
            "未登録社員一覧の再取得に失敗しました。",
            refreshError,
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    }, [
      formData,
      isSubmitting,
      selectedEmployee,
      service,
    ]);

  return {
    employees,
    formData,
    errors,

    step,
    isLoading,
    isInitializing,
    isSubmitting,
    isSuccess,

    selectedEmployee,

    registeredEmployeeName,
    registeredAccountName,

    handleChange,
    handleEmployeeChange,
    handleConfirm,
    handleBack,
    handleSubmit,
    resetForm,
    loadUnregisteredEmployees,
  };
};