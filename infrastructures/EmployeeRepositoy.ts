import { IEmployeeRepository } from "../interfaces/IEmployeeRepository";
import { Employee } from "../models/Employee";
import { EmployeeAccountRegisterRequest } from "@/models/EmployeeAccountRegisterRequest";
import { injectable } from "inversify";

@injectable()
export class EmployeeRepository implements IEmployeeRepository {
  /**
   * APIエンドポイントのURL
   * Next.jsのAPIプロキシ(BFF)を経由してバックエンドAPIにアクセスするためのURL
   * フロントエンド側で呼び出すURL（相対パス）として使用されます。
   */
  private readonly employee_endpoint: string =
    "/proxy-api/employees/unregistered";
  private readonly employee_account_endpoint: string = "/proxy-api/accounts";

  /**
   *  未登録社員一覧を取得する
   * @returns 未登録社員一覧の配列
   */
  async getUnregisteredEmployees(): Promise<Employee[]> {
    const response = await fetch(this.employee_endpoint, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `未登録社員一覧の取得に失敗しました。(status : ${response.status})`,
      );
    }
    const data: Employee[] = await response.json();
    return data;
  }

  /**
   *  従業員アカウントを登録する
   * @param newEmployeeAccount 登録する従業員アカウント情報
   */
  async addEmployeeAccount(
    newEmployeeAccount: EmployeeAccountRegisterRequest,
  ): Promise<void> {
    const response = await fetch(this.employee_account_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployeeAccount),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `従業員アカウントの登録に失敗しました。(status : ${response.status})`,
      );
    }
  }
}
