import { injectable } from "inversify";

import type { IOrderRepository } from
  "@/interfaces/IOrderRepository";
import type { OrderHistory } from
  "@/models/OrderHistory";

/**
 * APIから返されるエラーレスポンス
 */
type ErrorResponse = {
  message?: string;
};

/**
 * 注文に関するデータアクセスを行うリポジトリ
 */
@injectable()
export class OrderRepository implements IOrderRepository {
  /**
   * 注文APIのエンドポイント
   */
  private readonly endpoint = "/proxy-api/orders";

  /**
   * 指定した条件で購入履歴を検索する
   *
   * @param purchaseDate 購入日（yyyy-MM-dd）
   * @param customerAccountName 顧客アカウント名
   * @returns 検索条件に一致する購入履歴一覧
   */
  async searchOrderHistories(
    purchaseDate?: string,
    customerAccountName?: string,
  ): Promise<OrderHistory[]> {
    const searchParameters = new URLSearchParams();

    if (purchaseDate) {
      searchParameters.set("PurchaseDate", purchaseDate);
    }

    if (customerAccountName) {
      searchParameters.set(
        "CustomerAccountName",
        customerAccountName,
      );
    }

    const queryString = searchParameters.toString();
    const url =
      queryString === ""
        ? this.endpoint
        : `${this.endpoint}?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      await this.throwApiError(
        response,
        `購入履歴の検索に失敗しました。(status : ${response.status})`,
      );
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      console.error(
        "購入履歴検索APIのレスポンス:",
        data,
      );

      throw new Error(
        "購入履歴検索APIのレスポンス形式が不正です。",
      );
    }

    return data as OrderHistory[];
  }

  /**
   * APIのエラーレスポンスからメッセージを取得して例外を送出する
   *
   * @param response APIレスポンス
   * @param fallbackMessage メッセージを取得できない場合の既定値
   */
  private async throwApiError(
    response: Response,
    fallbackMessage: string,
  ): Promise<never> {
    let message = fallbackMessage;

    try {
      const errorResponse =
        (await response.json()) as ErrorResponse;

      if (
        typeof errorResponse.message === "string" &&
        errorResponse.message.trim() !== ""
      ) {
        message = errorResponse.message;
      }
    } catch {
      // JSON形式でない場合は既定メッセージを使用する
    }

    throw new Error(message);
  }
}