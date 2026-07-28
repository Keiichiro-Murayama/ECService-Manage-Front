import { EmployeeAccountRegistration } from "@/models/EmployeeAccountRegistration";
import type { Employee } from "../models/Employee";

export interface IEmployeeRepository {
  /**未登録社員一覧を取得する*/
  getUnregisteredEmployees(): Promise<Employee[]>;
  /** 従業員アカウントを登録する */
  addEmployeeAccount(
    newEmployeeAccount: EmployeeAccountRegistration,
  ): Promise<void>;
}
