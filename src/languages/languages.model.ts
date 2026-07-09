import z from 'zod';

export const languageSchema = z.object({
  id: z.string().max(10),
  name: z.string().max(50),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getLanguageResSchema = z.object({
  data: z.array(languageSchema),
  totalItems: z.number(),
});

export const getLanguageParamsSchema = z
  .object({
    languageId: z.string().max(10),
  })
  .strict();

export const getLanguageDetailSchema = languageSchema;

export const createLanguageBodySchema = languageSchema.pick({
  id: true,
  name: true,
});

export const updateLanguageBodySchema = languageSchema.pick({
  name: true,
});

export type languageType = z.infer<typeof languageSchema>;
export type getLanguageResType = z.infer<typeof getLanguageResSchema>;
export type getLanguageParamsType = z.infer<typeof getLanguageParamsSchema>;
export type getLanguageDetailType = z.infer<typeof getLanguageDetailSchema>;
export type createLanguageBodyType = z.infer<typeof createLanguageBodySchema>;
export type updateLanguageBodyType = z.infer<typeof updateLanguageBodySchema>;
