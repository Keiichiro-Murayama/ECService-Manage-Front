import type { IEmployeeRepository } from "@/interfaces/IEmployeeRepository";
import type { Employee } from "@/models/Employee";
import type { EmployeeAccountRegistration } from "@/models/EmployeeAccountRegistration";

import { injectable } from "inversify";

/**
 * APIから返された値がEmployeeか判定する
 */
const isEmployee = (
  value: unknown,
): value is Employee => {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  return (
    "employeeUuid" in value &&
    typeof value.employeeUuid === "string" &&
    "employeeName" in value &&
    typeof value.employeeName === "string"
  );
};

/**
 * EmployeeRepository
 *
 * 未登録社員取得と担当者アカウント登録を担当する。
 */
@injectable()
export class EmployeeRepository
  implements IEmployeeRepository
{
  /**
   * 未登録社員取得API
   */
  private readonly employeeEndpoint =
    "/proxy-api/employees/unregistered";

  /**
   * 担当者アカウント登録API
   */
  private readonly employeeAccountEndpoint =
    "/proxy-api/accounts";

  /**
   * 未登録社員一覧を取得する
   */
  async getUnregisteredEmployees():
    Promise<Employee[]> {
    const response = await fetch(
      this.employeeEndpoint,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const message =
        await this.getErrorMessage(
          response,
          `未登録社員一覧の取得に失敗しました。` +
            `(status : ${response.status})`,
        );

      throw new Error(message);
    }

    const data: unknown =
      await response.json();

    /*
     * バックが配列を直接返す場合
     */
    if (
      Array.isArray(data) &&
      data.every(isEmployee)
    ) {
      return data;
    }

    /*
     * { employees: [...] }形式にも対応する
     */
    if (
      typeof data === "object" &&
      data !== null &&
      "employees" in data &&
      Array.isArray(data.employees) &&
      data.employees.every(isEmployee)
    ) {
      return data.employees;
    }

    console.error(
      "未登録社員取得APIのレスポンス形式が不正です。",
      data,
    );

    throw new Error(
      "未登録社員取得APIのレスポンス形式が不正です。",
    );
  }

  /**
   * 担当者アカウントを登録する
   */
  async addEmployeeAccount(
    newEmployeeAccount:
      EmployeeAccountRegistration,
  ): Promise<void> {
    const response = await fetch(
      this.employeeAccountEndpoint,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          newEmployeeAccount,
        ),
        credentials: "include",
      },
    );

    if (!response.ok) {
      const message =
        await this.getErrorMessage(
          response,
          `担当者アカウントの登録に失敗しました。` +
            `(status : ${response.status})`,
        );

      throw new Error(message);
    }
  }

  /**
   * APIのエラーメッセージを取得する
   */
  private async getErrorMessage(
    response: Response,
    fallbackMessage: string,
  ): Promise<string> {
    try {
      const data: unknown =
        await response.json();

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string" &&
        data.message.trim() !== ""
      ) {
        return data.message;
      }
    } catch {
      // JSONではない場合は既定メッセージを使用する
    }

    return fallbackMessage;
  }
}