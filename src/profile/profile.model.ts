import { truncate } from 'fs';
import { UserSchema } from 'src/shared/models/shared-user.model';
import z from 'zod';

export const updateMeBodySchema = UserSchema.pick({
  name: true,
  phoneNumber: true,
  avatar: true,
}).strict();

export const changePasswordBodySchema = UserSchema.pick({
  password: true,
})
  .extend({
    password: z.string().min(6).max(100),
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Error.ConfirmPasswordNotMatch',
        path: ['confirmNewPassword'],
      });
    }
  });

export type updateMeBodyType = z.infer<typeof updateMeBodySchema>;
export type changePasswordBodyType = z.infer<typeof changePasswordBodySchema>;
