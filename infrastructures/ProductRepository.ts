import { ProductDetail } from "@/models/ProductDetail";
import type { IProductRepository } from "../interfaces/IProductRepository";
import type { Product } from "../models/Product";
import type { ProductRegisterRequest } from "../models/ProductRegisterRequest";
import type { ProductUpdateRequest } from "../models/ProductUpdateRequest";
import { injectable } from "inversify";

/**
 * ProductRepositoryクラスは、IProductRepositoryインターフェースを実装し、商品に関するデータ操作を行うリポジトリクラスです。
 */
@injectable()
export class ProductRepository implements IProductRepository {
  /** 商品APIのエンドポイント */
  private readonly endpoint: string = "/proxy-api/products";

  /**
   *  商品を検索する
   * @param categoryUuid 商品カテゴリUuid（指定されない場合は全商品検索）
   *                     クエリパラメータとして使用されます。
   * @returns 商品の配列
   */
  async searchProducts(categoryUuid?: string): Promise<Product[]> {
    const url = categoryUuid
      ? `${this.endpoint}?categoryUuid=${encodeURIComponent(categoryUuid)}`
      : this.endpoint;
    const response = await fetch(url, { credentials: "include" });

    if (!response.ok) {
      throw new Error(
        `商品の検索に失敗しました。(status : ${response.status})`,
      );
    }

    const data: Product[] = await response.json();
    return data;
  }

  /**
   * 商品詳細を取得する
   * @param productUuid　商品Uuid：クエリパラメータとして使用されます。
   * @returns 商品詳細
   */
  async getProductDetail(productUuid: string): Promise<ProductDetail> {
    const url = `${this.endpoint}/info?productUuid=${encodeURIComponent(productUuid)}`;
    const response = await fetch(url, { credentials: "include" });

    if (!response.ok) {
      throw new Error(
        `商品の詳細取得に失敗しました。(status : ${response.status})`,
      );
    }

    const data: ProductDetail = await response.json();
    return data;
  }

  /**
   * 新しい商品を追加する
   * @param newProduct 新しい商品の情報
   */
  async addProduct(newProduct: ProductRegisterRequest): Promise<void> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `商品の登録に失敗しました。(status : ${response.status})`,
      );
    }
  }

  /**
   * 商品情報を更新する
   * @param productUuid クエリパラメータとして使用される商品Uuid
   * @param updatedProduct
   */
  async updateProduct(
    productUuid: string,
    updatedProduct: ProductUpdateRequest,
  ): Promise<void> {
    const url = `${this.endpoint}/update?productUuid=${encodeURIComponent(productUuid)}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `商品の更新に失敗しました。(status : ${response.status})`,
      );
    }
  }

  /**
   * 商品を削除する
   * @param productUuid クエリパラメータとして使用される商品Uuid
   */
  async deleteProduct(productUuid: string): Promise<void> {
    const url = `${this.endpoint}/delete?productUuid=${encodeURIComponent(productUuid)}`;
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `商品の削除に失敗しました。(status : ${response.status})`,
      );
    }
  }
}
