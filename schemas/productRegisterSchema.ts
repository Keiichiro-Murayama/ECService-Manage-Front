import { z } from "zod";

/**
 * 商品画像の最大ファイルサイズ
 * 2MB
 */
export const MAX_PRODUCT_IMAGE_SIZE =
  2 * 1024 * 1024;

/**
 * アップロード可能な画像形式
 */
export const ALLOWED_PRODUCT_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
] as const;

/**
 * 価格入力の検証
 *
 * 入力時は文字列、検証後はnumberへ変換する
 */
const priceSchema = z
  .string()
  .min(1, "価格を入力してください。")
  .refine(
    (value) =>
      value.trim() !== "" &&
      !Number.isNaN(Number(value)),
    "価格は数値で入力してください。",
  )
  .transform(Number)
  .pipe(
    z
      .number()
      .int("価格は整数で入力してください。")
      .min(
        0,
        "価格は0円以上で入力してください。",
      )
      .max(
        1_000_000,
        "価格は1,000,000円以下で入力してください。",
      ),
  );

/**
 * 在庫数入力の検証
 *
 * 入力時は文字列、検証後はnumberへ変換する
 */
const stockSchema = z
  .string()
  .min(1, "在庫数を入力してください。")
  .refine(
    (value) =>
      value.trim() !== "" &&
      !Number.isNaN(Number(value)),
    "在庫数は数値で入力してください。",
  )
  .transform(Number)
  .pipe(
    z
      .number()
      .int("在庫数は整数で入力してください。")
      .min(
        0,
        "在庫数は0個以上で入力してください。",
      )
      .max(
        1_000,
        "在庫数は1,000個以下で入力してください。",
      ),
  );

/**
 * 商品画像の検証
 *
 * 入力時はFileまたはnullを許可し、
 * 検証後はFileとして扱う
 */
const productImageSchema = z
  .custom<File | null>(
    (value) =>
      value === null ||
      (
        typeof File !== "undefined" &&
        value instanceof File
      ),
    {
      message:
        "正しい画像ファイルを選択してください。",
    },
  )
  .superRefine((file, context) => {
    if (file === null) {
      context.addIssue({
        code: "custom",
        message:
          "商品画像を選択してください。",
      });

      return;
    }

    if (
      file.size >
      MAX_PRODUCT_IMAGE_SIZE
    ) {
      context.addIssue({
        code: "custom",
        message:
          "画像は2MB以下にしてください。",
      });
    }

    if (
      !ALLOWED_PRODUCT_IMAGE_TYPES.includes(
        file.type as
          (typeof ALLOWED_PRODUCT_IMAGE_TYPES)[number],
      )
    ) {
      context.addIssue({
        code: "custom",
        message:
          "PNG形式またはJPEG形式の画像を選択してください。",
      });
    }
  })
  .transform((file) => file as File);

/**
 * 新商品登録フォームの検証スキーマ
 */
export const productRegisterSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(1, "商品名を入力してください。")
    .min(
      2,
      "商品名は2～20文字で入力してください。",
    )
    .max(
      20,
      "商品名は2～20文字で入力してください。",
    ),

  price: priceSchema,

  stock: stockSchema,

  categoryUuid: z
    .string()
    .min(
      1,
      "商品カテゴリを選択してください。",
    ),

  image: productImageSchema,
});

/**
 * フォーム入力時の型
 *
 * price・stockはstring
 * imageはFileまたはnull
 */
export type ProductRegisterFormInput =
  z.input<typeof productRegisterSchema>;

/**
 * zod検証後の型
 *
 * price・stockはnumber
 * imageはFile
 */
export type ProductRegisterFormValues =
  z.output<typeof productRegisterSchema>;