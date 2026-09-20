import { createZodDto } from 'nestjs-zod';
import {
  CreateCategoryBodySchema,
  GetAllCategoryQuerySchema,
  GetAllCategoryResSchema,
  GetCategoryDetailResSchema,
  GetCategoryParamsSchema,
  UpdateCategoryBodyShema,
} from './category.model';

export class GetAllCategoryResDTO extends createZodDto(
  GetAllCategoryResSchema,
) {}
export class GetAllCategoryQueryDTO extends createZodDto(
  GetAllCategoryQuerySchema,
) {}
export class GetCategoryDetailResDTO extends createZodDto(
  GetCategoryDetailResSchema,
) {}
export class GetCategoryParamsDTO extends createZodDto(
  GetCategoryParamsSchema,
) {}
export class CreateCategoryBodyDTO extends createZodDto(
  CreateCategoryBodySchema,
) {}
export class UpdateCategoryBodyDTO extends createZodDto(
  UpdateCategoryBodyShema,
) {}
