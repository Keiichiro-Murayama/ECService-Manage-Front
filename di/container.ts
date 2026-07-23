import { IEmployeeRepository } from "@/interfaces/IEmployeeRepository";
import { IRegisterEmployeeAccountService } from "@/interfaces/IRegisterEmployeeAccountService";
import { Container } from "inversify";
import { TYPES } from "./types";
import { EmployeeRepository } from "@/infrastructures/EmployeeRepositoy";
import { RegisterEmployeeAccountService } from "@/services/RegisterEmployeeAccountService";

/**
 * データアクセスとサービスを実装する
 * DIコンテナの初期化と依存関係の登録
 */
const container = new Container();
// ---------------------------------------------------------
// バインディング（登録）設定
// ---------------------------------------------------------
// リポジトリの登録(モック版を紐付ける)
container.bind<IEmployeeRepository>(TYPES.IEmployeeRepository).to(EmployeeRepository);
// サービス(ユースケース)の登録
container.bind<IRegisterEmployeeAccountService>(TYPES.IRegisterEmployeeAccountService).to(RegisterEmployeeAccountService);




export { container };