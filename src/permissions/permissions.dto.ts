import { createZodDto } from 'nestjs-zod';
import {
  CreatePermissionBodySchema,
  GetPermissionDetailResSchema,
  GetPermissionParamsSchema,
  GetPermissionQuerySchema,
  GetPermissionResSchema,
  UpdatePermissionBodySchema,
} from './permissions.model';

export class GetPermissionResDTO extends createZodDto(GetPermissionResSchema) {}
export class GetPermissionParamsDTO extends createZodDto(
  GetPermissionParamsSchema,
) {}
export class GetPermissionDetailResDTO extends createZodDto(
  GetPermissionDetailResSchema,
) {}
export class CreatePermissionBodyDTO extends createZodDto(
  CreatePermissionBodySchema,
) {}
export class UpdatePermissionBodyDTO extends createZodDto(
  UpdatePermissionBodySchema,
) {}
export class GetPermissionQueryDTO extends createZodDto(
  GetPermissionQuerySchema,
) {}
