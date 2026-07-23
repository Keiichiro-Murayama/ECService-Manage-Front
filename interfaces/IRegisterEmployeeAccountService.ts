import { EmployeeAccountRegistration } from "../models/EmployeeAccountRegistration";
import { Employee} from "../models/Employee";

/**
 * アカウント登録サービスを実装してDIコンテナに登録する
 * アカウント登録画面におけるUIイベントに対応するサービスのインターフェース
 */
export interface IRegisterEmployeeAccountService {

    getUnregisteredEmployees(): Promise<Employee[]>;
    /**
     * 入力終了時: アカウント名の重複を検証する
     * @param name 入力されたアカウント名
     * @throws アカウント名が重複している場合はエラーをスローする
     */
    validateEmployeeAccount(accountName: string): Promise<void>;

    /**
     * 登録実行時: アカウントデータを永続化する
     * @param product 登録するアカウントデータ
     * @return 登録されたアカウント（非同期）
     */
    registerEmployeeAccount(employeeAccount: EmployeeAccountRegistration): Promise<void>;
}