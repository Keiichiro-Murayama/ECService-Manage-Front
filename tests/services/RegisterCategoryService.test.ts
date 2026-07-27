import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { ICategoryRepository } from
  "@/interfaces/ICategoryRepository";
import type { Category } from
  "@/models/Category";
import { RegisterCategoryService } from
  "@/services/RegisterCategoryService";

const CATEGORY: Category = {
  categoryUuid: "",
  name: "筆記用具",
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

describe("RegisterCategoryService", () => {
  let categoryRepository:
    ICategoryRepository;

  let service:
    RegisterCategoryService;

  beforeEach(() => {
    categoryRepository =
      createCategoryRepositoryMock();

    service =
      new RegisterCategoryService(
        categoryRepository,
      );
  });

  describe("execute", () => {
    it(
      "正常なカテゴリを渡した場合、カテゴリ登録Repositoryを呼び出す",
      async () => {
        // Arrange
        vi.mocked(
          categoryRepository.addCategory,
        ).mockResolvedValue();

        // Act
        await service.execute(CATEGORY);

        // Assert
        expect(
          categoryRepository.addCategory,
        ).toHaveBeenCalledTimes(1);

        expect(
          categoryRepository.addCategory,
        ).toHaveBeenCalledWith(
          CATEGORY.name,
        );
      },
    );

    it(
      "カテゴリ名をそのままRepositoryへ渡す",
      async () => {
        // Arrange
        vi.mocked(
          categoryRepository.addCategory,
        ).mockResolvedValue();

        const category: Category = {
          categoryUuid: "",
          name: "家電",
        };

        // Act
        await service.execute(category);

        // Assert
        expect(
          categoryRepository.addCategory,
        ).toHaveBeenCalledWith("家電");
      },
    );

    it(
      "カテゴリ登録Repositoryで例外が発生した場合、その例外を呼び出し元へ伝播する",
      async () => {
        // Arrange
        vi.mocked(
          categoryRepository.addCategory,
        ).mockRejectedValue(
          new Error(
            "カテゴリの登録に失敗しました。",
          ),
        );

        // Act・Assert
        await expect(
          service.execute(CATEGORY),
        ).rejects.toThrow(
          "カテゴリの登録に失敗しました。",
        );
      },
    );
  });
});