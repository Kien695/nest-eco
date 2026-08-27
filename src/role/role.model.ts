import { PermissionSchema } from 'src/shared/models/shared-permission';
import { RoleSchema } from 'src/shared/models/shared-role';
import z from 'zod';

export const RoleWithPermissionSchema = RoleSchema.extend({
  permissions: z.array(PermissionSchema),
});

export const GetRoleResSchema = z.object({
  data: z.array(RoleSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetRoleQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict();

export const GetRoleParamsSchema = z
  .object({
    roleId: z.coerce.number(),
  })
  .strict();

export const GetRoleDetailResSchema = RoleWithPermissionSchema;

export const createRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
}).strict();

export const createRoleResSchema = RoleSchema;

export const updateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
})
  .extend({
    permissionIds: z.array(z.number()),
  })
  .strict();
export type RoleType = z.infer<typeof RoleSchema>;
export type RoleWithPermissionType = z.infer<typeof RoleWithPermissionSchema>;
export type GetRoleResType = z.infer<typeof GetRoleResSchema>;
export type GetRoleQueryType = z.infer<typeof GetRoleQuerySchema>;
export type GetRoleDetailResType = z.infer<typeof GetRoleDetailResSchema>;
export type createRoleResType = z.infer<typeof createRoleResSchema>;
export type createRoleBodyType = z.infer<typeof createRoleBodySchema>;
export type updateRoleBodyType = z.infer<typeof updateRoleBodySchema>;
