import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { ICategoryRepository } from
  "@/interfaces/ICategoryRepository";
import type { IProductRepository } from
  "@/interfaces/IProductRepository";
import type { Category } from
  "@/models/Category";
import type { ProductDetail } from
  "@/models/ProductDetail";
import { DeleteProductService } from
  "@/services/DeleteProductService";

/**
 * 商品UUID
 */
const PRODUCT_UUID =
  "23862ffe-2846-486f-89b3-f22188d0d695";

/**
 * カテゴリUUID
 */
const CATEGORY_UUID =
  "b29ac160-7bfd-4ae1-a636-073a8bb758cf";

/**
 * 商品詳細のテストデータ
 */
const PRODUCT_DETAIL: ProductDetail = {
  productUuid: PRODUCT_UUID,
  productName: "高級ボールペン",
  price: 1200,
  stock: 10,
  categoryUuid: CATEGORY_UUID,
  imageUrl: "/images/ballpoint-pen.png",
};

/**
 * カテゴリ一覧のテストデータ
 */
const CATEGORIES: Category[] = [
  {
    categoryUuid:
      "85f51a98-f194-4447-bad8-4711cc17c546",
    name: "ノート",
  },
  {
    categoryUuid: CATEGORY_UUID,
    name: "筆記用具",
  },
];

/**
 * 商品リポジトリのモックを生成する
 */
const createProductRepositoryMock =
  (): IProductRepository => {
    return {
      searchProducts: vi.fn(),
      getProductDetail: vi.fn(),
      addProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
    };
  };

/**
 * カテゴリリポジトリのモックを生成する
 */
const createCategoryRepositoryMock =
  (): ICategoryRepository => {
    return {
      getAllCategories: vi.fn(),
      addCategory: vi.fn(),
    };
  };

describe("DeleteProductService", () => {
  let productRepository:
    IProductRepository;

  let categoryRepository:
    ICategoryRepository;

  let service:
    DeleteProductService;

  beforeEach(() => {
    productRepository =
      createProductRepositoryMock();

    categoryRepository =
      createCategoryRepositoryMock();

    service = new DeleteProductService(
      productRepository,
      categoryRepository,
    );
  });

  describe("getConfirmationData", () => {
    it(
      "正常な商品UUIDを渡した場合、商品詳細とカテゴリ名を返す",
      async () => {
        // Arrange
        vi.mocked(
          productRepository.getProductDetail,
        ).mockResolvedValue(PRODUCT_DETAIL);

        vi.mocked(
          categoryRepository.getAllCategories,
        ).mockResolvedValue(CATEGORIES);

        // Act
        const result =
          await service.getConfirmationData(
            PRODUCT_UUID,
          );

        // Assert
        expect(result).toEqual({
          ...PRODUCT_DETAIL,
          categoryName: "筆記用具",
        });

        expect(
          productRepository.getProductDetail,
        ).toHaveBeenCalledTimes(1);

        expect(
          productRepository.getProductDetail,
        ).toHaveBeenCalledWith(
          PRODUCT_UUID,
        );

        expect(
          categoryRepository.getAllCategories,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      "商品UUIDの前後に空白がある場合、空白を除去して商品詳細を取得する",
      async () => {
        // Arrange
        vi.mocked(
          productRepository.getProductDetail,
        ).mockResolvedValue(PRODUCT_DETAIL);

        vi.mocked(
          categoryRepository.getAllCategories,
        ).mockResolvedValue(CATEGORIES);

        // Act
        await service.getConfirmationData(
          `  ${PRODUCT_UUID}  `,
        );

        // Assert
        expect(
          productRepository.getProductDetail,
        ).toHaveBeenCalledWith(
          PRODUCT_UUID,
        );
      },
    );

    it(
      "一致するカテゴリがない場合、カテゴリ名にカテゴリ不明を設定する",
      async () => {
        // Arrange
        const categoriesWithoutTarget:
          Category[] = [
          {
            categoryUuid:
              "85f51a98-f194-4447-bad8-4711cc17c546",
            name: "ノート",
          },
        ];

        vi.mocked(
          productRepository.getProductDetail,
        ).mockResolvedValue(PRODUCT_DETAIL);

        vi.mocked(
          categoryRepository.getAllCategories,
        ).mockResolvedValue(
          categoriesWithoutTarget,
        );

        // Act
        const result =
          await service.getConfirmationData(
            PRODUCT_UUID,
          );

        // Assert
        expect(result.categoryName).toBe(
          "カテゴリ不明",
        );
      },
    );

    it(
      "商品UUIDが空白のみの場合、エラーを送出してRepositoryを呼び出さない",
      async () => {
        // Act・Assert
        await expect(
          service.getConfirmationData("   "),
        ).rejects.toThrow(
          "商品UUIDが指定されていません。",
        );

        expect(
          productRepository.getProductDetail,
        ).not.toHaveBeenCalled();

        expect(
          categoryRepository.getAllCategories,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "商品詳細取得で例外が発生した場合、その例外を呼び出し元へ伝播する",
      async () => {
        // Arrange
        const expectedError =
          new Error(
            "指定された商品が見つかりません。",
          );

        vi.mocked(
          productRepository.getProductDetail,
        ).mockRejectedValue(
          expectedError,
        );

        vi.mocked(
          categoryRepository.getAllCategories,
        ).mockResolvedValue(CATEGORIES);

        // Act・Assert
        await expect(
          service.getConfirmationData(
            PRODUCT_UUID,
          ),
        ).rejects.toThrow(
          "指定された商品が見つかりません。",
        );
      },
    );
  });

  describe("execute", () => {
    it(
      "正常な商品UUIDを渡した場合、商品削除Repositoryを呼び出す",
      async () => {
        // Arrange
        vi.mocked(
          productRepository.deleteProduct,
        ).mockResolvedValue();

        // Act
        await service.execute(PRODUCT_UUID);

        // Assert
        expect(
          productRepository.deleteProduct,
        ).toHaveBeenCalledTimes(1);

        expect(
          productRepository.deleteProduct,
        ).toHaveBeenCalledWith(
          PRODUCT_UUID,
        );
      },
    );

    it(
      "商品UUIDの前後に空白がある場合、空白を除去して商品削除Repositoryを呼び出す",
      async () => {
        // Arrange
        vi.mocked(
          productRepository.deleteProduct,
        ).mockResolvedValue();

        // Act
        await service.execute(
          `  ${PRODUCT_UUID}  `,
        );

        // Assert
        expect(
          productRepository.deleteProduct,
        ).toHaveBeenCalledWith(
          PRODUCT_UUID,
        );
      },
    );

    it(
      "商品UUIDが空白のみの場合、エラーを送出して削除Repositoryを呼び出さない",
      async () => {
        // Act・Assert
        await expect(
          service.execute("   "),
        ).rejects.toThrow(
          "商品UUIDが指定されていません。",
        );

        expect(
          productRepository.deleteProduct,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "商品削除Repositoryで例外が発生した場合、その例外を呼び出し元へ伝播する",
      async () => {
        // Arrange
        vi.mocked(
          productRepository.deleteProduct,
        ).mockRejectedValue(
          new Error(
            "商品の削除に失敗しました。",
          ),
        );

        // Act・Assert
        await expect(
          service.execute(PRODUCT_UUID),
        ).rejects.toThrow(
          "商品の削除に失敗しました。",
        );
      },
    );
  });
});