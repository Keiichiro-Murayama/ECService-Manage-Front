import { Container } from "inversify";
import { TYPES } from "./types";


// インターフェース
import { IEmployeeRepository } from "@/interfaces/IEmployeeRepository";
import { IRegisterEmployeeAccountService } from "@/interfaces/IRegisterEmployeeAccountService";
import { IProductRepository } from "@/interfaces/IProductRepository";
import { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import { ISearchProductsService } from "@/interfaces/ISearchProductsService";

// 実装クラス
import { EmployeeRepository } from "@/infrastructures/EmployeeRepositoy";
import { RegisterEmployeeAccountService } from "@/services/RegisterEmployeeAccountService";
import { ProductRepository } from "@/infrastructures/ProductRepository";
import { CategoryRepository } from "@/infrastructures/CategoryRepository";
import { SearchProductsService } from "@/services/SearchProductsService";


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
container.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository);
container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository);




// サービス(ユースケース)の登録
container.bind<IRegisterEmployeeAccountService>(TYPES.IRegisterEmployeeAccountService).to(RegisterEmployeeAccountService);
container.bind<ISearchProductsService>(TYPES.ISearchProductsService).to(SearchProductsService);



export { container };