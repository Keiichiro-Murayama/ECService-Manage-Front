import { TYPES } from "@/di/types";
import type { IBookCategoryRepository } from "@/interfaces/IBookCategoryRepository";
import type { IBookRepository } from "@/interfaces/IBookRepository";
import { IRegisterBookService } from "@/interfaces/IRegisterBookService";
import { Book } from "@/models/Book";
import { BookCategory } from "@/models/BookCategory";
import { BookRegistration } from "@/models/BookRegistration";
import { inject, injectable } from "inversify";

/**
 * 演習 8-10 商品登録サービスを実装してDIコンテナに登録する
 * 商品登録に関する各種データアクセスを統括するFacadeサービス
 */
@injectable()
export class RegisterBookService implements IRegisterBookService {

    /**
     * コンストラクタ
     * @param bookRepository 商品リポジトリ
     * @param categoryRepository 商品カテゴリリポジトリ
     */
    constructor(
        @inject(TYPES.IBookRepository) private bookRepository: IBookRepository,
        @inject(TYPES.IBookCategoryRepository) private categoryRepository: IBookCategoryRepository
    ) { }

    /**
     * 画面初期表示時: すべての商品カテゴリを取得する
     * @return すべての商品カテゴリのリスト（非同期）
     */
    async getCategories(): Promise<BookCategory[]> {
        return await this.categoryRepository.findAll();
    }

    /**
     * カテゴリ選択時: 指定したIDの商品カテゴリ詳細を取得する
     * @param id 商品カテゴリId(UUID)
     * @return 商品カテゴリ（非同期）
     */
    // async getCategoryById(id: string): Promise<BookCategory> {
    //  return await this.categoryRepository.findById(id);
    // }

    /**
     * 入力終了時: 商品名の重複を検証する
     * @param name 入力された商品名
     * @throws 商品名が重複している場合はエラーをスローする
     */
    async validateBookTitle(title: string): Promise<void> {
        const books = await this.bookRepository.searchKeyword(title);

        const exists = books.some(
            (book) => book.title.trim() === title.trim()
        );

        if (exists) {
            throw new Error("同じ書名の図書が既に登録されています。");
        }
    }

    /**
     * 登録実行時: 商品データを永続化する
     * @param book 登録する商品データ
     * @return 登録された商品（非同期）
     */
    async execute(book: BookRegistration): Promise<Book> {
        await this.validateBookTitle(book.title);
        return await this.bookRepository.register(book);
    }
}