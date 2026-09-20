import { createZodDto } from 'nestjs-zod';
import { GetCategoryDetailResSchema } from '../category.model';
import {
  CreateCategoryTranslationBodyShema,
  GetCategoryTranslationParamsSchema,
  UpdateCategoryTranslationBodyShema,
} from './category_translation.model';

export class GetCategoryTranslationDetailResDTO extends createZodDto(
  GetCategoryDetailResSchema,
) {}
export class CreateCategoryTranslationBodyDTO extends createZodDto(
  CreateCategoryTranslationBodyShema,
) {}
export class UpdateCategoryTranslationBodyDTO extends createZodDto(
  UpdateCategoryTranslationBodyShema,
) {}
export class GetCategoryTranslationParamsDTO extends createZodDto(
  GetCategoryTranslationParamsSchema,
) {}
