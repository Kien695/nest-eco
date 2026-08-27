import z from 'zod';

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
