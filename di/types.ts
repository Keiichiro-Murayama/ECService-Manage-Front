/**
 * データアクセスとサービスを実装する
 * DIコンテナ用の識別子(Symbol)定義
 */
export const TYPES = {
    // インフラストラクチャ層
    IEmployeeRepository: Symbol.for("IEmployeeRepository"),
    // サービス(ユースケース)層

    IRegisterEmployeeAccountService: Symbol.for("IRegisterEmployeeAccountService")
    

};