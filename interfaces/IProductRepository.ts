import type { Product } from "../models/Product";
import type { ProductDetail } from "@/models/ProductDetail";
import type { ProductRegisterRequest } from "../models/ProductRegisterRequest";
import type { ProductUpdateRequest } from "../models/ProductUpdateRequest";
export interface IProductRepository {
  /**商品検索*/
  searchProducts(categoryUuid?: string): Promise<Product[]>;
  /**商品詳細取得*/
  getProductDetail(productUuid: string): Promise<ProductDetail>;
  /**商品登録*/
  addProduct(newProduct: ProductRegisterRequest): Promise<void>;
  /**商品更新*/
  updateProduct(
    productUuid: string,
    updatedProduct: ProductUpdateRequest,
  ): Promise<void>;
  /**商品削除*/
  deleteProduct(productUuid: string): Promise<void>;
}
