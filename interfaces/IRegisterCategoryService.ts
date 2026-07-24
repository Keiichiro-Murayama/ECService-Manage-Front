import { Category } from "@/models/Category";

/**
 * 演習 8-10 商品登録サービスを実装してDIコンテナに登録する
 * 商品登録画面におけるUIイベントに対応するサービスのインターフェース
 */
export interface IRegisterCategoryService {


    /**
     * 登録実行時: 商品データを永続化する
     * @param category 登録する商品データ
     * @return 登録された商品（非同期）
     */
    execute(category: Category): Promise<void>;
}