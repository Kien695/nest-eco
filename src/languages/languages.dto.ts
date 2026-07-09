import { createZodDto } from 'nestjs-zod';
import {
  createLanguageBodySchema,
  getLanguageDetailSchema,
  getLanguageParamsSchema,
  getLanguageResSchema,
  updateLanguageBodySchema,
} from './languages.model';

export class getLanguageResDto extends createZodDto(getLanguageResSchema) {}
export class getLanguageParamsDto extends createZodDto(
  getLanguageParamsSchema,
) {}
export class getLanguageDetailDto extends createZodDto(
  getLanguageDetailSchema,
) {}
export class createLanguageBodyDto extends createZodDto(
  createLanguageBodySchema,
) {}
export class updateLanguageBodyDto extends createZodDto(
  updateLanguageBodySchema,
) {}
