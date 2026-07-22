/**
 * 社員アカウント登録情報を表すインターフェース
 * 社員アカウント登録APIのリクエストに対応するデータ構造を定義します。
 */

export interface EmployeeAccountRegisterRequest {
  /** 社員UUID */
  employeeUuid: string;
  /** アカウント名 */
  accountName: string;
  /** パスワード */
  password: string;
}
