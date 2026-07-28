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
import type { ProductDetail } from "@/models/ProductDetail";
import type { ProductUpdateRequest } from "@/models/ProductUpdateRequest";
import { UpdateProductService } from "@/services/UpdateProductService";

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

describe("UpdateProductService", () => {
  let productRepository:
    ReturnType<
      typeof createProductRepositoryMock
    >;

  let categoryRepository:
    ReturnType<
      typeof createCategoryRepositoryMock
    >;

  let service: UpdateProductService;

  const productUuid =
    "11111111-1111-1111-1111-111111111111";

  const categoryUuid =
    "22222222-2222-2222-2222-222222222222";

  const currentImageUrl =
    "https://example.com/old-image.png";

  const newImageUrl =
    "https://example.com/new-image.png";

  const productDetail:
    ProductDetail = {
      productUuid,
      productName: "更新前の商品",
      price: 1000,
      stock: 10,
      categoryUuid,
      imageUrl: currentImageUrl,
    };

  const categories: Category[] = [
    {
      categoryUuid,
      name: "書籍",
    },
  ];

  const updateRequest:
    ProductUpdateRequest = {
      productUuid,
      productName: "更新後の商品",
      price: 2000,
      stock: 20,
      categoryUuid,
      imageUrl: currentImageUrl,
    };

  beforeEach(() => {
    productRepository =
      createProductRepositoryMock();

    categoryRepository =
      createCategoryRepositoryMock();

    service = new UpdateProductService(
      productRepository,
      categoryRepository,
    );
  });

  describe("getInitialData", () => {
    it("商品詳細とカテゴリ一覧を取得して返す", async () => {
      productRepository
        .getProductDetail
        .mockResolvedValue(productDetail);

      categoryRepository
        .getAllCategories
        .mockResolvedValue(categories);

      const result =
        await service.getInitialData(
          `  ${productUuid}  `,
        );

      expect(result).toEqual({
        product: productDetail,
        categories,
      });

      expect(
        productRepository.getProductDetail,
      ).toHaveBeenCalledTimes(1);

      expect(
        productRepository.getProductDetail,
      ).toHaveBeenCalledWith(
        productUuid,
      );

      expect(
        categoryRepository.getAllCategories,
      ).toHaveBeenCalledTimes(1);
    });

    it("商品UUIDが空の場合はエラーにする", async () => {
      await expect(
        service.getInitialData("   "),
      ).rejects.toThrow(
        "商品UUIDが指定されていません。",
      );

      expect(
        productRepository.getProductDetail,
      ).not.toHaveBeenCalled();

      expect(
        categoryRepository.getAllCategories,
      ).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("画像を変更しない場合は現在の画像URLで商品を更新する", async () => {
      productRepository
        .updateProduct
        .mockResolvedValue(undefined);

      await service.update(
        `  ${productUuid}  `,
        updateRequest,
        null,
      );

      expect(
        productRepository
          .uploadProductImage,
      ).not.toHaveBeenCalled();

      expect(
        productRepository.updateProduct,
      ).toHaveBeenCalledTimes(1);

      expect(
        productRepository.updateProduct,
      ).toHaveBeenCalledWith(
        productUuid,
        updateRequest,
      );

      expect(
        productRepository
          .deleteProductImage,
      ).not.toHaveBeenCalled();
    });

    it("画像を変更する場合は新しい画像URLで商品を更新する", async () => {
      const newImage = {
        name: "new-image.png",
        type: "image/png",
        size: 1024,
      } as File;

      productRepository
        .uploadProductImage
        .mockResolvedValue(newImageUrl);

      productRepository
        .updateProduct
        .mockResolvedValue(undefined);

      productRepository
        .deleteProductImage
        .mockResolvedValue(undefined);

      await service.update(
        productUuid,
        updateRequest,
        newImage,
      );

      expect(
        productRepository
          .uploadProductImage,
      ).toHaveBeenCalledTimes(1);

      expect(
        productRepository
          .uploadProductImage,
      ).toHaveBeenCalledWith(
        updateRequest.productName,
        newImage,
      );

      expect(
        productRepository.updateProduct,
      ).toHaveBeenCalledWith(
        productUuid,
        {
          ...updateRequest,
          imageUrl: newImageUrl,
        },
      );

      expect(
        productRepository
          .deleteProductImage,
      ).toHaveBeenCalledTimes(1);

      expect(
        productRepository
          .deleteProductImage,
      ).toHaveBeenCalledWith(
        currentImageUrl,
      );
    });

    it("商品更新に失敗した場合は新しくアップロードした画像を削除する", async () => {
      const newImage = {
        name: "new-image.png",
        type: "image/png",
        size: 1024,
      } as File;

      const updateError =
        new Error(
          "商品の更新に失敗しました。",
        );

      productRepository
        .uploadProductImage
        .mockResolvedValue(newImageUrl);

      productRepository
        .updateProduct
        .mockRejectedValue(updateError);

      productRepository
        .deleteProductImage
        .mockResolvedValue(undefined);

      await expect(
        service.update(
          productUuid,
          updateRequest,
          newImage,
        ),
      ).rejects.toBe(updateError);

      expect(
        productRepository
          .deleteProductImage,
      ).toHaveBeenCalledTimes(1);

      expect(
        productRepository
          .deleteProductImage,
      ).toHaveBeenCalledWith(
        newImageUrl,
      );
    });

    it("画像アップロードに失敗した場合は商品を更新しない", async () => {
      const newImage = {
        name: "new-image.png",
        type: "image/png",
        size: 1024,
      } as File;

      const uploadError =
        new Error(
          "商品画像のアップロードに失敗しました。",
        );

      productRepository
        .uploadProductImage
        .mockRejectedValue(uploadError);

      await expect(
        service.update(
          productUuid,
          updateRequest,
          newImage,
        ),
      ).rejects.toBe(uploadError);

      expect(
        productRepository.updateProduct,
      ).not.toHaveBeenCalled();

      expect(
        productRepository
          .deleteProductImage,
      ).not.toHaveBeenCalled();
    });

    it("商品UUIDが空の場合は更新処理を実行しない", async () => {
      await expect(
        service.update(
          "   ",
          updateRequest,
          null,
        ),
      ).rejects.toThrow(
        "商品UUIDが指定されていません。",
      );

      expect(
        productRepository.updateProduct,
      ).not.toHaveBeenCalled();

      expect(
        productRepository
          .uploadProductImage,
      ).not.toHaveBeenCalled();
    });
  });
});