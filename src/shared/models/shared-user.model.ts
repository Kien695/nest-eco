import z from 'zod';
import { AuthProvider, UserStatus } from '../constants/auth.constant';

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
export type UserType = z.infer<typeof UserSchema>;
