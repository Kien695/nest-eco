import {
  TypeOfVerificationCode,
  UserStatus,
} from 'src/shared/constants/auth.constant';
import z from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().min(3).max(100),
  phoneNumber: z.string().length(10),
  avatar: z.string().nullable(),
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
export const registerBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(6).max(100),
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
