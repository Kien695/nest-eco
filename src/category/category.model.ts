import z from 'zod';
import { CategoryTranslationSchema } from './category_translation/category_translation.model';

export const CategorySchema = z.object({
  id: z.number(),
  parentCategoryId: z.number().nullable(),
  name: z.string(),
  logo: z.string(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const CategoryIncludeTranslationSchema = CategorySchema.extend({
  categoryTranslations: z.array(CategoryTranslationSchema),
});

export const GetAllCategoryResSchema = z.object({
  data: z.array(CategoryIncludeTranslationSchema),
  totalItems: z.number(),
});

export const GetAllCategoryQuerySchema = z.object({
  parentCategoryId: z.coerce.number().int().positive().optional(),
});

export const GetCategoryParamsSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
});

export const GetCategoryDetailResSchema = CategoryIncludeTranslationSchema;

export const CreateCategoryBodySchema = CategorySchema.pick({
  name: true,
  logo: true,
  parentCategoryId: true,
}).strict();

export const UpdateCategoryBodyShema = CreateCategoryBodySchema;

export type CategoryType = z.infer<typeof CategorySchema>;
export type CategoryIncludeTranslationType = z.infer<
  typeof CategoryIncludeTranslationSchema
>;
export type GetAllCategoryResType = z.infer<typeof GetAllCategoryResSchema>;
export type GetAllCategoryQueryType = z.infer<typeof GetAllCategoryQuerySchema>;
export type GetCategoryParamsType = z.infer<typeof GetCategoryParamsSchema>;
export type GetCategoryDetailResType = z.infer<
  typeof GetCategoryDetailResSchema
>;
export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>;
export type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodyShema>;
