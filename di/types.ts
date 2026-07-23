/**
 * DIコンテナ用の識別子（Symbol）定義
 */
export const TYPES = {
  // インフラストラクチャ層
  IEmployeeRepository: Symbol.for("IEmployeeRepository"),
  IProductRepository: Symbol.for("IProductRepository"),
  ICategoryRepository: Symbol.for("ICategoryRepository"),

  // サービス層
  IRegisterEmployeeAccountService: Symbol.for("IRegisterEmployeeAccountService",),
  ISearchProductsService: Symbol.for("ISearchProductsService"),
} as const;