import z from 'zod';

export const CategoryTranslationSchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  languageId: z.string(),
  name: z.string().max(500),
  description: z.string(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
});
export const GetCategoryTranslationParamsSchema = z
  .object({
    categoryTranslationId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetCategoryTranslationDetailResSchema = CategoryTranslationSchema;
export const CreateCategoryTranslationBodyShema =
  CategoryTranslationSchema.pick({
    categoryId: true,
    languageId: true,
    name: true,
    description: true,
  }).strict();

export const UpdateCategoryTranslationBodyShema =
  CreateCategoryTranslationBodyShema;

export type CategoryTranslationType = z.infer<typeof CategoryTranslationSchema>;
export type GetCategoryTranslationDetailRes = z.infer<
  typeof GetCategoryTranslationDetailResSchema
>;
export type CreateCategoryTranslationBodyType = z.infer<
  typeof CreateCategoryTranslationBodyShema
>;
export type UpdateCategoryTranslationBodyType = z.infer<
  typeof UpdateCategoryTranslationBodyShema
>;
