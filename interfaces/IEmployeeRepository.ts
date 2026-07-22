import { EmployeeAccountRegisterRequest } from "@/models/EmployeeAccountRegisterRequest";
import type { Employee } from "../models/Employee";

export interface IEmployeeRepository {
  /**未登録社員一覧を取得する*/
  getAllEmployees(): Promise<Employee[]>;
  /** 従業員アカウントを登録する */
  addEmployeeAccount(
    newEmployeeAccount: EmployeeAccountRegisterRequest,
  ): Promise<void>;
}
