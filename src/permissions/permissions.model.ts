import { HTTPMethod } from 'src/shared/constants/role.constant';
import { PermissionSchema } from 'src/shared/models/shared-permission';
import z from 'zod';

export const GetPermissionResSchema = z.object({
  data: z.array(PermissionSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});
export const GetPermissionQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1), //coerce chuyển string sang number
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict();

export const GetPermissionParamsSchema = z
  .object({
    permissionId: z.coerce.number(),
  })
  .strict();

export const GetPermissionDetailResSchema = PermissionSchema;

export const CreatePermissionBodySchema = PermissionSchema.pick({
  name: true,
  path: true,
  method: true,
  module: true,
  description: true,
})
  .extend({
    description: z.string().default(''), //  Nếu Client không gửi, Zod tự điền ''
  })
  .strict();

export const UpdatePermissionBodySchema = CreatePermissionBodySchema;

export type PermissionType = z.infer<typeof PermissionSchema>;
export type GetPermissionResType = z.infer<typeof GetPermissionResSchema>;
export type GetPermissionQueryType = z.infer<typeof GetPermissionQuerySchema>;
export type GetPermissionDetailRestype = z.infer<
  typeof GetPermissionDetailResSchema
>;
export type CreatePermissionBodyType = z.infer<
  typeof CreatePermissionBodySchema
>;
export type GetPermissionParamsType = z.infer<typeof GetPermissionParamsSchema>;
export type UpdatePermissionBodyType = z.infer<
  typeof UpdatePermissionBodySchema
>;
