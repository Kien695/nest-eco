import z from 'zod';
import { AuthProvider, UserStatus } from '../constants/auth.constant';
import { RoleSchema } from './shared-role';
import { PermissionSchema } from './shared-permission';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string().min(6).max(100).nullable(),
  name: z.string().min(3).max(100),
  phoneNumber: z.string().length(10).nullable(),
  avatar: z.string().nullable(),
  providerId: z.string().nullable(),
  authProvider: z.enum([AuthProvider.LOCAL, AuthProvider.GOOGLE]),
  totpSecret: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.INACTIVE]),
  roleId: z.number().positive(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetUserProfileResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleSchema.pick({
    id: true,
    name: true,
  }).extend({
    permissions: z.array(
      PermissionSchema.pick({
        id: true,
        name: true,
        module: true,
        path: true,
        method: true,
      }),
    ),
  }),
});

export const UpdateProfileResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

export type UserType = z.infer<typeof UserSchema>;
export type GetUserProfileResType = z.infer<typeof GetUserProfileResSchema>;
export type UpdateUserProfileResType = z.infer<typeof UpdateProfileResSchema>;
export type UpdateUserType = Partial<
  Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>
>;
