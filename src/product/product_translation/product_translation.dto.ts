import { createZodDto } from 'nestjs-zod';
import {
  CreateProductTranslationBodySchema,
  GetProductTranslationDetailResSchema,
  GetProductTranslationParamsShema,
  UpdateProductTranslationBodySchema,
} from './product_translation.model';

export class GetProductTranslationDetailResDTO extends createZodDto(
  GetProductTranslationDetailResSchema,
) {}
export class GetProductTranslationParamsDTO extends createZodDto(
  GetProductTranslationParamsShema,
) {}
export class CreateProductTranslationBodyDTO extends createZodDto(
  CreateProductTranslationBodySchema,
) {}
export class UpdateProductTranslationBodyDTO extends createZodDto(
  UpdateProductTranslationBodySchema,
) {}
