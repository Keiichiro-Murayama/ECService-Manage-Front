import "reflect-metadata";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { IProductRepository } from "@/interfaces/IProductRepository";
import type { Category } from "@/models/Category";
import type { ProductRegisterRequest } from "@/models/ProductRegisterRequest";
import { RegisterProductService } from "@/services/RegisterProductService";

/**
 * 商品リポジトリのモックを作成する
 */
const createProductRepositoryMock = () =>
  ({
    searchProducts:
      vi.fn<
        IProductRepository["searchProducts"]
      >(),

    getProductDetail:
      vi.fn<
        IProductRepository["getProductDetail"]
      >(),

    addProduct:
      vi.fn<
        IProductRepository["addProduct"]
      >(),

    uploadProductImage:
      vi.fn<
        IProductRepository["uploadProductImage"]
      >(),

    deleteProductImage:
      vi.fn<
        IProductRepository["deleteProductImage"]
      >(),

    updateProduct:
      vi.fn<
        IProductRepository["updateProduct"]
      >(),

    deleteProduct:
      vi.fn<
        IProductRepository["deleteProduct"]
      >(),
  }) satisfies IProductRepository;

/**
 * カテゴリリポジトリのモックを作成する
 */
const createCategoryRepositoryMock = () =>
  ({
    getAllCategories:
      vi.fn<
        ICategoryRepository["getAllCategories"]
      >(),

    addCategory:
      vi.fn<
        ICategoryRepository["addCategory"]
      >(),
  }) satisfies ICategoryRepository;

describe("RegisterProductService", () => {
  let productRepository:
    ReturnType<
      typeof createProductRepositoryMock
    >;

  let categoryRepository:
    ReturnType<
      typeof createCategoryRepositoryMock
    >;

  let service: RegisterProductService;

  beforeEach(() => {
    productRepository =
      createProductRepositoryMock();

    categoryRepository =
      createCategoryRepositoryMock();

    service = new RegisterProductService(
      productRepository,
      categoryRepository,
    );
  });

  describe("getCategories", () => {
    it("カテゴリ一覧を取得して返す", async () => {
      const categories: Category[] = [
        {
          categoryUuid:
            "11111111-1111-1111-1111-111111111111",
          name: "書籍",
        },
        {
          categoryUuid:
            "22222222-2222-2222-2222-222222222222",
          name: "家電",
        },
      ];

      categoryRepository
        .getAllCategories
        .mockResolvedValue(categories);

      const result =
        await service.getCategories();

      expect(result).toEqual(categories);

      expect(
        categoryRepository.getAllCategories,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("register", () => {
    it("入力された商品情報をRepositoryへ渡す", async () => {
      const image = {
        name: "product.png",
        type: "image/png",
        size: 1024,
      } as File;

      const request:
        ProductRegisterRequest = {
          productName: "テスト商品",
          price: 1000,
          stock: 10,
          categoryUuid:
            "11111111-1111-1111-1111-111111111111",
          image,
        };

      productRepository
        .addProduct
        .mockResolvedValue(undefined);

      await service.register(request);

      expect(
        productRepository.addProduct,
      ).toHaveBeenCalledTimes(1);

      expect(
        productRepository.addProduct,
      ).toHaveBeenCalledWith(request);
    });

    it("Repositoryでエラーが発生した場合はそのまま通知する", async () => {
      const image = {
        name: "product.png",
        type: "image/png",
        size: 1024,
      } as File;

      const request:
        ProductRegisterRequest = {
          productName: "テスト商品",
          price: 1000,
          stock: 10,
          categoryUuid:
            "11111111-1111-1111-1111-111111111111",
          image,
        };

      const repositoryError =
        new Error(
          "商品の登録に失敗しました。",
        );

      productRepository
        .addProduct
        .mockRejectedValue(repositoryError);

      await expect(
        service.register(request),
      ).rejects.toBe(repositoryError);

      expect(
        productRepository.addProduct,
      ).toHaveBeenCalledWith(request);
    });
  });
});