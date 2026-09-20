import { createZodDto } from 'nestjs-zod';
import {
  CreateBrandTranslationBodySchema,
  GetBrandTranslationDetailResSchema,
  GetBrandTranslationParamsSchema,
  UpdateBrandTranslationBodySchema,
} from './brand_translation.model';

export class GetBrandTranslationDetailResDTO extends createZodDto(
  GetBrandTranslationDetailResSchema,
) {}
export class CreateBrandTranslationBodyDTO extends createZodDto(
  CreateBrandTranslationBodySchema,
) {}
export class UpdateBrandTranslationBodyDTO extends createZodDto(
  UpdateBrandTranslationBodySchema,
) {}
export class GetBrandTranslationParamsDTO extends createZodDto(
  GetBrandTranslationParamsSchema,
) {}
