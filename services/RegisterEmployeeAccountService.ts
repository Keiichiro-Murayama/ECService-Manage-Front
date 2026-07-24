import { TYPES } from "@/di/types";
import type { IEmployeeRepository } from "@/interfaces/IEmployeeRepository";
import { IRegisterEmployeeAccountService } from "@/interfaces/IRegisterEmployeeAccountService";
import { Employee } from "@/models/Employee";
import { EmployeeAccountRegistration } from "@/models/EmployeeAccountRegistration";
import { inject, injectable } from "inversify";

/**
 * アカウント登録サービスを実装してDIコンテナに登録する
 * アカウント登録に関する各種データアクセスを統括するFacadeサービス
 */
@injectable()
export class RegisterEmployeeAccountService implements IRegisterEmployeeAccountService {

    /**
     * コンストラクタ
     * @param EmployeeAccountRepository 担当者アカウントリポジトリ
     * @param employeeRepository 担当者リポジトリ
     */
    constructor(
        @inject(TYPES.IEmployeeRepository) private employeeRepository: IEmployeeRepository,
    ) { }

    /**
     * 画面初期表示時: すべてのアカウントカテゴリを取得する
     * @return すべてのアカウントカテゴリのリスト（非同期）
     */
    async getUnregisteredEmployees(): Promise<Employee[]> {
        return await this.employeeRepository.getUnregisteredEmployees();
    }


    /**
     * 登録実行時: アカウントデータを永続化する
     * @param EmployeeAccount 登録するアカウントデータ
     * @return 登録されたアカウント（非同期）
     */
    async registerEmployeeAccount(registration: EmployeeAccountRegistration): Promise<void> {
        await this.employeeRepository.addEmployeeAccount(registration);
    }
}