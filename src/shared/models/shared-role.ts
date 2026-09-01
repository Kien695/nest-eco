import z from 'zod';
import { PermissionSchema } from './shared-permission';

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

export const RolePermissionSchema = RoleSchema.extend({
  permissions: z.array(PermissionSchema),
});

export type RoleType = z.infer<typeof RoleSchema>;
export type RolePermissionType = z.infer<typeof RolePermissionSchema>;
