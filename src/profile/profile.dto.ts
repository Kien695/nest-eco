import { createZodDto } from 'nestjs-zod';
import { changePasswordBodySchema, updateMeBodySchema } from './profile.model';

export class UpdateBodyMeDTO extends createZodDto(updateMeBodySchema) {}
export class ChangePasswordBodyDTO extends createZodDto(
  changePasswordBodySchema,
) {}
