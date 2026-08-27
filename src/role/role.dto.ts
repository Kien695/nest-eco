import { createZodDto } from 'nestjs-zod';

import {
  createRoleBodySchema,
  GetRoleDetailResSchema,
  GetRoleParamsSchema,
  GetRoleQuerySchema,
  GetRoleResSchema,
  updateRoleBodySchema,
} from './role.model';

export class GetRoleResDTO extends createZodDto(GetRoleResSchema) {}
export class GetRoleParamsDTO extends createZodDto(GetRoleParamsSchema) {}
export class GetRoleDetailResDTO extends createZodDto(GetRoleDetailResSchema) {}
export class CreateRoleBodyDTO extends createZodDto(createRoleBodySchema) {}
export class UpdateRoleBodyDTO extends createZodDto(updateRoleBodySchema) {}
export class GetRoleQueryDTO extends createZodDto(GetRoleQuerySchema) {}
