"use client";

import { useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { Button } from
  "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from
  "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateOrderStatus } from
  "@/hooks/useUpdateOrderStatus";

/**
 * 注文ステータス更新画面のprops
 */
interface OrderStatusUpdateProps {
  /** 注文UUID */
  orderUuid: string;
}

/**
 * 日時を日本時間で表示する
 */
const formatDateTime = (
  dateTime: string,
): string => {
  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    return dateTime;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  ).format(date);
};

/**
 * 注文ステータス更新画面
 */
export const OrderStatusUpdate = ({
  orderUuid,
}: OrderStatusUpdateProps) => {
  const router = useRouter();

  const {
    orderData,
    selectedOrderStatusId,
    selectedOrderStatus,
    updateResult,

    step,
    isLoading,
    isUpdating,
    error,

    changeOrderStatus,
    goToConfirm,
    backToInput,
    updateOrderStatus,
    initialize,
  } = useUpdateOrderStatus(orderUuid);

  /**
   * 購入履歴検索画面へ戻る
   */
  const goToOrderSearch = (): void => {
    router.push("/admin/order/search");
  };

  /**
   * 初期表示読み込み中
   */
  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <Card>
          <CardContent className="flex min-h-48 items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LoaderCircle className="size-5 animate-spin" />

              <span>
                注文情報を読み込んでいます。
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  /**
   * 初期表示失敗
   */
  if (orderData === null) {
    return (
      <main className="mx-auto w-full max-w-3xl space-y-4 p-6">
        <Alert variant="destructive">
          <AlertCircle />

          <AlertTitle>
            注文情報を取得できませんでした
          </AlertTitle>

          <AlertDescription>
            {error ??
              "注文情報の取得に失敗しました。"}
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => {
              void initialize();
            }}
          >
            <RefreshCw />
            再読み込み
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={goToOrderSearch}
          >
            <ArrowLeft />
            購入履歴検索へ戻る
          </Button>
        </div>
      </main>
    );
  }

  /**
   * 入力画面
   */
  if (step === "input") {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              注文ステータス更新
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {error !== null && (
              <Alert variant="destructive">
                <AlertCircle />

                <AlertTitle>
                  入力内容を確認してください
                </AlertTitle>

                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <dl className="grid gap-4 sm:grid-cols-[180px_1fr]">
              <dt className="font-semibold">
                購入日時
              </dt>

              <dd>
                {formatDateTime(
                  orderData.orderDate,
                )}
              </dd>

              <dt className="font-semibold">
                顧客アカウント名
              </dt>

              <dd>
                {
                  orderData
                    .customerAccountName
                }
              </dd>

              <dt className="font-semibold">
                注文内容
              </dt>

              <dd className="whitespace-pre-wrap">
                {orderData.orderContent}
              </dd>

              <dt className="font-semibold">
                現在のステータス
              </dt>

              <dd>
                {
                  orderData
                    .currentOrderStatusName
                }
              </dd>
            </dl>

            <div className="space-y-2">
              <Label htmlFor="orderStatus">
                変更後の注文ステータス
              </Label>

              <Select
                value={
                  selectedOrderStatusId
                }
                onValueChange={
                  changeOrderStatus
                }
              >
                <SelectTrigger id="orderStatus">
                  <SelectValue placeholder="注文ステータスを選択してください" />
                </SelectTrigger>

                <SelectContent>
                  {orderData.orderStatuses.map(
                    (orderStatus) => (
                      <SelectItem
                        key={
                          orderStatus
                            .orderStatusId
                        }
                        value={String(
                          orderStatus
                            .orderStatusId,
                        )}
                      >
                        {
                          orderStatus
                            .orderStatusName
                        }
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={goToOrderSearch}
              >
                キャンセル
              </Button>

              <Button
                type="button"
                onClick={goToConfirm}
              >
                確認
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  /**
   * 確認画面
   */
  if (
    step === "confirm" &&
    selectedOrderStatus !== undefined
  ) {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              注文ステータス更新確認
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {error !== null && (
              <Alert variant="destructive">
                <AlertCircle />

                <AlertTitle>
                  注文ステータスを更新できませんでした
                </AlertTitle>

                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <dl className="grid gap-4 sm:grid-cols-[180px_1fr]">
              <dt className="font-semibold">
                購入日時
              </dt>

              <dd>
                {formatDateTime(
                  orderData.orderDate,
                )}
              </dd>

              <dt className="font-semibold">
                顧客アカウント名
              </dt>

              <dd>
                {
                  orderData
                    .customerAccountName
                }
              </dd>

              <dt className="font-semibold">
                注文内容
              </dt>

              <dd className="whitespace-pre-wrap">
                {orderData.orderContent}
              </dd>

              <dt className="font-semibold">
                現在のステータス
              </dt>

              <dd>
                {
                  orderData
                    .currentOrderStatusName
                }
              </dd>

              <dt className="font-semibold">
                変更後のステータス
              </dt>

              <dd className="font-semibold">
                {
                  selectedOrderStatus
                    .orderStatusName
                }
              </dd>
            </dl>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={backToInput}
                disabled={isUpdating}
              >
                戻る
              </Button>

              <Button
                type="button"
                onClick={() => {
                  void updateOrderStatus();
                }}
                disabled={isUpdating}
              >
                {isUpdating && (
                  <LoaderCircle className="animate-spin" />
                )}

                {isUpdating
                  ? "更新中..."
                  : "更新"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  /**
   * 完了画面
   */
  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            注文ステータス更新完了
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle2 />

            <AlertTitle>
              注文ステータスを更新しました
            </AlertTitle>

            <AlertDescription>
              更新後のステータス：
              {updateResult?.orderStatusName ??
                selectedOrderStatus
                  ?.orderStatusName}
            </AlertDescription>
          </Alert>

          {updateResult !== null && (
            <dl className="grid gap-4 sm:grid-cols-[180px_1fr]">
              <dt className="font-semibold">
                注文UUID
              </dt>

              <dd className="break-all">
                {updateResult.orderUuid}
              </dd>

              <dt className="font-semibold">
                更新日時
              </dt>

              <dd>
                {formatDateTime(
                  updateResult.updatedAt,
                )}
              </dd>
            </dl>
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={goToOrderSearch}
            >
              購入履歴検索へ戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};