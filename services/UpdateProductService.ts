import { inject, injectable } from "inversify";

import { TYPES } from "@/di/types";
import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { IProductRepository } from "@/interfaces/IProductRepository";
import type {
    IUpdateProductService,
    UpdateProductInitialData,
} from "@/interfaces/IUpdateProductService";
import type { ProductUpdateRequest } from "@/models/ProductUpdateRequest";

/**
 * 商品修正サービス
 */
@injectable()
export class UpdateProductService
    implements IUpdateProductService {
    constructor(
        @inject(TYPES.IProductRepository)
        private readonly productRepository:
            IProductRepository,

        @inject(TYPES.ICategoryRepository)
        private readonly categoryRepository:
            ICategoryRepository,
    ) { }

    /**
     * 商品情報とカテゴリ一覧を取得する
     */
    async getInitialData(
        productUuid: string,
    ): Promise<UpdateProductInitialData> {
        const normalizedProductUuid =
            productUuid.trim();

        if (normalizedProductUuid === "") {
            throw new Error(
                "商品UUIDが指定されていません。",
            );
        }

        const [product, categories] =
            await Promise.all([
                this.productRepository
                    .getProductDetail(
                        normalizedProductUuid,
                    ),

                this.categoryRepository
                    .getAllCategories(),
            ]);

        return {
            product,
            categories,
        };
    }

    /**
     * 商品情報を更新する
     */
    async update(
        productUuid: string,
        product: ProductUpdateRequest,
        newImage: File | null,
    ): Promise<void> {
        const normalizedProductUuid =
            productUuid.trim(); //石原:追加

        if (normalizedProductUuid === "") {
            throw new Error(
                "商品UUIDが指定されていません。",
            ); //石原:追加
        }

        let uploadedImageUrl: string | null =
            null;

        try {
            if (newImage !== null) {
                uploadedImageUrl =
                    await this.productRepository
                        .uploadProductImage(
                            product.productName,
                            newImage,
                        );
            }

            const request: ProductUpdateRequest = {
                ...product,
                imageUrl:
                    uploadedImageUrl ??
                    product.imageUrl,
            };

            await this.productRepository
                .updateProduct(
                    normalizedProductUuid, //石原:変更
                    request,
                );
        } catch (error: unknown) {
            if (uploadedImageUrl !== null) {
                await this.deleteImageSafely(
                    uploadedImageUrl,
                );
            }

            throw error;
        }

        if (
            uploadedImageUrl !== null &&
            product.imageUrl.trim() !== "" &&
            uploadedImageUrl !== product.imageUrl
        ) {
            await this.deleteImageSafely(
                product.imageUrl,
            );
        }
    }

    /**
     * 画像を安全に削除する
     */
    private async deleteImageSafely(
        imageUrl: string,
    ): Promise<void> {
        try {
            await this.productRepository
                .deleteProductImage(imageUrl);
        } catch (error: unknown) {
            /*
             * 商品情報の更新自体は成功している可能性があるため、
             * 画像削除失敗では更新処理を失敗扱いにしない
             */
            console.error(
                "商品画像の削除に失敗しました。",
                error,
            );
        }
    }
}