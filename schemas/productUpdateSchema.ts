import { z } from "zod";

/**
 * 価格入力の検証
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
 * 商品修正フォームの検証スキーマ
 */
export const productUpdateSchema = z.object({
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
});

/**
 * フォーム入力時の型
 */
export type ProductUpdateFormInput =
  z.input<typeof productUpdateSchema>;

/**
 * バリデーション後の型
 */
export type ProductUpdateFormValues =
  z.output<typeof productUpdateSchema>;