import z from 'zod';
import { SKUSchema, UpsertSKUBodySchema } from './sku.model';
import { ProductTranslationSchema } from './product_translation/product_translation.model';
import { BrandIncludeTranslationSchema } from 'src/brand/brand.model';
import { CategoryIncludeTranslationSchema } from 'src/category/category.model';
import { OrderBy, SortBy } from 'src/shared/constants/other.constant';

function generateSKUs(variants: VariantsType) {
  function getCombinations(arrays: string[][]): string[] {
    return arrays.reduce(
      (acc, curr) =>
        acc.flatMap((x) => curr.map((y) => `${x}${x ? '-' : ''}${y}`)),
      [''],
    );
  }

  // Lấy mảng các options từ variants
  const options = variants.map((variant) => variant.options);

  // Tạo tất cả tổ hợp
  const compinations = getCombinations(options);

  //Chuyển tổ hợp thành SKU  objects
  return compinations.map((value) => ({
    value,
    price: 0,
    stock: 100,
    image: '',
  }));
}
export const VariantSchema = z.object({
  value: z.string().trim(),
  options: z.array(z.string().trim()),
});
export const VariantsSchema = z
  .array(VariantSchema)
  .superRefine((variants, ctx) => {
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const isDuplicateVariant =
        variants.findIndex(
          (v) => v.value.toLowerCase() === variant.value.toLowerCase(),
        ) !== i;

      if (isDuplicateVariant) {
        return ctx.addIssue({
          code: 'custom',
          message: `Giá trị ${variant.value} đã tồn tại trong danh sách variants. Vui lòng kiểm tra lại!`,
          path: ['variants'],
        });
      }
      const isDuplicateOption = variant.options.some((option, index) => {
        const existingOption =
          variant.options.findIndex(
            (o) => o.toLowerCase() === option.toLowerCase(),
          ) !== index;
        return existingOption;
      });
      if (isDuplicateOption) {
        return ctx.addIssue({
          code: 'custom',
          message: `Variant ${variant.value} chứa các option trùng tên với nhau. Vui lòng kiểm tra lại!`,
          path: ['variants'],
        });
      }
    }
  });
export const ProductsSchema = z.object({
  id: z.number(),
  publishedAt: z.coerce.date().nullable(),
  name: z.string().trim().max(500),
  basePrice: z.number().min(0),
  virtualPrice: z.number().min(0),
  brandId: z.number().positive(),
  images: z.array(z.string()),
  variants: VariantsSchema,
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// dành cho client
export const GetProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  name: z.string().optional(),
  brandIds: z
    .preprocess((value) => {
      if (typeof value === 'string') {
        return [Number(value)];
      }
      return value;
    }, z.array(z.coerce.number().int().positive()))
    .optional(),
  categories: z
    .preprocess((value) => {
      if (typeof value === 'string') {
        return [Number(value)];
      }
      return value;
    }, z.array(z.coerce.number().int().positive()))
    .optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  createdById: z.coerce.number().int().positive().optional(),
  orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
  sortBy: z.enum([SortBy.CreatedAt, SortBy.Price, SortBy.Sale]).default(SortBy.CreatedAt),
});

//dành cho admin và seller
export const GetManagerProductsQuerySchema = GetProductsQuerySchema.extend({
  isPublic: z.preprocess((value) => value === 'true', z.boolean()).optional(),
  createdById: z.coerce.number().int().positive(),
});

export const GetProductSResSchema = z.object({
  data: z.array(
    ProductsSchema.extend({
      productTranslations: z.array(ProductTranslationSchema),
    }),
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetProductParamsSchema = z
  .object({
    productId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetProductDetailResSchema = ProductsSchema.extend({
  productTranslations: z.array(ProductTranslationSchema),
  skus: z.array(SKUSchema),
  categories: z.array(CategoryIncludeTranslationSchema),
  brand: BrandIncludeTranslationSchema,
});

export const CreateProductBodySchema = ProductsSchema.pick({
  publishedAt: true,
  name: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true,
})
  .extend({
    categories: z.array(z.coerce.number().int().positive()),
    skus: z.array(UpsertSKUBodySchema),
  })
  .strict()
  .superRefine(({ variants, skus }, ctx) => {
    const skuValueArray = generateSKUs(variants);
    if (skus.length !== skuValueArray.length) {
      return ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: `Số lượng SKU nên là ${skuValueArray.length}. Vui lòng kiểm tra lại!`,
      });
    }

    let wrongSKUIndex = -1;
    const isValidSKUs = skus.every((sku, index) => {
      const isValid = sku.value === skuValueArray[index].value;
      if (!isValid) {
        wrongSKUIndex = index;
      }
      return isValid;
    });
    if (!isValidSKUs) {
      ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: ` Giá trị SKU index ${wrongSKUIndex} không hợp lê. Vui lòng kiểm tra lại!`,
      });
    }
  });
export const UpdateProductBodySchema = CreateProductBodySchema;
export type ProductType = z.infer<typeof ProductsSchema>;
export type VariantsType = z.infer<typeof VariantsSchema>;
export type GetProductsResType = z.infer<typeof GetProductSResSchema>;
export type GetProductsQueryType = z.infer<typeof GetProductsQuerySchema>;
export type GetManagerProductQueryType = z.infer<
  typeof GetManagerProductsQuerySchema
>;
export type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>;
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>;
export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>;
export type GetProductParamsType = z.infer<typeof GetProductParamsSchema>;
