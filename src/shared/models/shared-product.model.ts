import z from 'zod';

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

export type ProductType = z.infer<typeof ProductsSchema>;
export type VariantsType = z.infer<typeof VariantsSchema>;
