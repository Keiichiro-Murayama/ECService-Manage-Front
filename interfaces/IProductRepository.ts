import type { Product } from "../models/Product";
import type { ProductRegisterRequest } from "../models/ProductRegisterRequest";
export interface IProductRepository {
  /**商品検索*/
  searchProducts(query?: string): Promise<Product[]>;
  /**商品登録*/
  addProduct(newProduct: ProductRegisterRequest): Promise<void>;
  /**商品更新*/
  updateProduct(
    productUuid: string,
    updatedProduct: ProductRegisterRequest,
  ): Promise<void>;
}
