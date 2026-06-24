import {
  TypeOfVerificationCode,
  UserStatus,
} from 'src/shared/constants/auth.constant';
import { UserSchema } from 'src/shared/models/shared-user.model';
import z from 'zod';

export const registerBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(6).max(100),
    code: z.string().length(6),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không trùng khớp',
        path: ['confirmPassword'],
      });
    }
  });
export type registerBodyType = z.infer<typeof registerBodySchema>;

export const registerResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});
export type registerResType = z.infer<typeof registerResSchema>;

export const verificationCode = z.object({
  id: z.number(),
  email: z.string().email(),
  code: z.string().length(6),
  type: z.enum([
    TypeOfVerificationCode.REGISTER,
    TypeOfVerificationCode.FORGOT_PASSWORD,
  ]),
  expiresAt: z.date(),
  createdAt: z.date(),
});
export type verificationCodeType = z.infer<typeof verificationCode>;

export const SendOTPBodySchema = verificationCode
  .pick({
    email: true,
    type: true,
  })
  .strict();
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strict();

export type loginBodyType = z.infer<typeof LoginBodySchema>;

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LoginResType = z.infer<typeof LoginBodySchema>;

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export type refreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>;
export type refreshTokenType = z.infer<typeof RefreshTokenSchema>;
export const refreshTokenResShema = LoginResSchema;
export type refreshTokenResType = LoginResType;
//logout
export const logoutBodySchema = RefreshTokenSchema;
export type logoutBodyType = refreshTokenBodyType;
//device
export const DeviceShema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  createdAt: z.date(),
  isActive: z.boolean(),
});
export type deviceType = z.infer<typeof DeviceShema>;

//role
export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdById: z.number().nullable(),

  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type roleType = z.infer<typeof roleSchema>;
