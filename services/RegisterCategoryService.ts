import { TYPES } from "@/di/types";
import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { IRegisterCategoryService } from "@/interfaces/IRegisterCategoryService";
import type { Category } from "@/models/Category";
import { inject, injectable } from "inversify";

/**
 * 商品カテゴリ登録サービス
 */
@injectable()
export class RegisterCategoryService implements IRegisterCategoryService {

    /**
     * コンストラクタ
     * @param categoryRepository 商品カテゴリリポジトリ
     */
    constructor(
        @inject(TYPES.ICategoryRepository)
        private categoryRepository: ICategoryRepository
    ) {}

    /**
     * 商品カテゴリを登録する
     * @param category 登録するカテゴリ
     */
    async execute(category: Category): Promise<void> {
        await this.categoryRepository.addCategory(category.name);
    }
}