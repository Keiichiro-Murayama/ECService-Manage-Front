import { Container } from "inversify";
import { TYPES } from "./types";


// インターフェース
import { IEmployeeRepository } from "@/interfaces/IEmployeeRepository";
import { IRegisterEmployeeAccountService } from "@/interfaces/IRegisterEmployeeAccountService";
import { IProductRepository } from "@/interfaces/IProductRepository";
import { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import { ISearchProductsService } from "@/interfaces/ISearchProductsService";
import { IRegisterCategoryService } from "@/interfaces/IRegisterCategoryService";
import type { IDeleteProductService } from "@/interfaces/IDeleteProductService";
import { IRegisterProductService } from "@/interfaces/IRegisterProductService";
import type { IOrderRepository } from "@/interfaces/IOrderRepository";
import type { ISearchOrderHistoriesService } from "@/interfaces/ISearchOrderHistoriesService";
import type { IUpdateProductService } from "@/interfaces/IUpdateProductService"; 
import type { IUpdateOrderStatusService } from "@/interfaces/IUpdateOrderStatusService";
// 実装クラス
import { EmployeeRepository } from "@/infrastructures/EmployeeRepositoy";
import { RegisterEmployeeAccountService } from "@/services/RegisterEmployeeAccountService";
import { ProductRepository } from "@/infrastructures/ProductRepository";
import { CategoryRepository } from "@/infrastructures/CategoryRepository";
import { SearchProductsService } from "@/services/SearchProductsService";
import { RegisterCategoryService } from "@/services/RegisterCategoryService";
import { DeleteProductService } from "@/services/DeleteProductService";
import { RegisterProductService } from "@/services/RegisterProductService";
import { OrderRepository } from "@/infrastructures/OrderRepository";
import { SearchOrderHistoriesService } from "@/services/SearchOrderHistoriesService";
import { UpdateProductService } from "@/services/UpdateProductService";
import { UpdateOrderStatusService } from "@/services/UpdateOrderStatusService";
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
container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository);



// サービス(ユースケース)の登録
container.bind<IRegisterEmployeeAccountService>(TYPES.IRegisterEmployeeAccountService).to(RegisterEmployeeAccountService);
container.bind<ISearchProductsService>(TYPES.ISearchProductsService).to(SearchProductsService);
container.bind<IDeleteProductService>(TYPES.IDeleteProductService).to(DeleteProductService);
container.bind<IRegisterCategoryService>(TYPES.IRegisterCategoryService).to(RegisterCategoryService);
container.bind<IRegisterProductService>(TYPES.IRegisterProductService,).to(RegisterProductService);
container.bind<ISearchOrderHistoriesService>(TYPES.ISearchOrderHistoriesService,).to(SearchOrderHistoriesService);
container.bind<IUpdateProductService>(TYPES.IUpdateProductService,).to(UpdateProductService);
container
  .bind<IUpdateOrderStatusService>(TYPES.IUpdateOrderStatusService,).to( UpdateOrderStatusService,); 

export { container };