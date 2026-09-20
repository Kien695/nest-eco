import z from 'zod';
import { BrandTranslationSchema } from './brand_translation/brand_translation.model';

export const BrandSchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  logo: z.string().url().max(1000),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BrandIncludeTranslationSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema),
});

export const GetBrandResSchema = z.object({
  data: z.array(BrandIncludeTranslationSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPage: z.number(),
});

export const GetBrandParamsSchema = z
  .object({
    brandId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetBrandDetailSchema = BrandIncludeTranslationSchema;
export const CreateBrandBodySchema = BrandSchema.pick({
  name: true,
  logo: true,
});

export const UpdateBrandBodySchema = CreateBrandBodySchema;

export type BrandType = z.infer<typeof BrandSchema>;
export type BrandIncludeTranslationType = z.infer<
  typeof BrandIncludeTranslationSchema
>;
export type GetBrandResType = z.infer<typeof GetBrandResSchema>;
export type GetBrandParamsType = z.infer<typeof GetBrandParamsSchema>;
export type GetParamsDetailType = z.infer<typeof GetBrandDetailSchema>;
export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>;
export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>;
