import { createZodDto } from 'nestjs-zod';
import {
  CreateBrandBodySchema,
  GetBrandDetailSchema,
  GetBrandParamsSchema,
  GetBrandResSchema,
  UpdateBrandBodySchema,
} from './brand.model';

export class GetBrandResDTO extends createZodDto(GetBrandResSchema) {}
export class GetBrandDetailResDTO extends createZodDto(GetBrandDetailSchema) {}
export class GetBrandParamsDTO extends createZodDto(GetBrandParamsSchema) {}
export class CreateBrandBodyDTO extends createZodDto(CreateBrandBodySchema) {}
export class UpdateBrandBodyDTO extends createZodDto(UpdateBrandBodySchema) {}
