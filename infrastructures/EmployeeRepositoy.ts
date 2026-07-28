import type { IEmployeeRepository } from "@/interfaces/IEmployeeRepository";
import type { Employee } from "@/models/Employee";
import type { EmployeeAccountRegistration } from "@/models/EmployeeAccountRegistration";

import { injectable } from "inversify";

/**
 * APIから返された値がEmployee形式か判定する
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
 * APIレスポンスからメッセージを取得する
 */
const getResponseMessage = async (
  response: Response,
): Promise<string | null> => {
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
    /*
     * レスポンス本文がない場合や、
     * JSON形式ではない場合はnullを返す。
     */
  }

  return null;
};

/**
 * EmployeeRepository
 *
 * 未登録社員一覧の取得と、
 * 従業員アカウント登録を担当する。
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
   * 従業員アカウント登録API
   */
  private readonly employeeAccountEndpoint =
    "/proxy-api/accounts";

  /**
   * 未登録社員一覧を取得する
   */
  public async getUnregisteredEmployees():
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
      const responseMessage =
        await getResponseMessage(response);

      throw new Error(
        responseMessage ??
          `未登録社員一覧の取得に失敗しました。(status : ${response.status})`,
      );
    }

    const data: unknown =
      await response.json();

    /*
     * APIが配列を直接返す場合
     */
    if (
      Array.isArray(data) &&
      data.every(isEmployee)
    ) {
      return data;
    }

    /*
     * APIが
     * { employees: [...] }
     * の形式で返す場合
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
      "未登録社員取得APIのレスポンス:",
      data,
    );

    throw new Error(
      "未登録社員取得APIのレスポンス形式が不正です。",
    );
  }

  /**
   * 従業員アカウントを登録する
   */
  public async addEmployeeAccount(
    newEmployeeAccount:
      EmployeeAccountRegistration,
  ): Promise<void> {
    const response = await fetch(
      this.employeeAccountEndpoint,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          newEmployeeAccount,
        ),
      },
    );

    if (response.ok) {
      return;
    }

    const responseMessage =
      await getResponseMessage(response);

    /*
     * APIから具体的なメッセージが返された場合は、
     * その内容を優先する。
     */
    if (responseMessage !== null) {
      throw new Error(responseMessage);
    }

    /*
     * 409でレスポンス本文がない場合は、
     * アカウント名重複として扱う。
     */
    if (response.status === 409) {
      throw new Error(
        "このアカウント名は既に使用されています",
      );
    }

    throw new Error(
      `従業員アカウントの登録に失敗しました。(status : ${response.status})`,
    );
  }
}