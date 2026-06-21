import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  registerBodySchema,
  registerResSchema,
  SendOTPBodySchema,
} from './auth.model';

export class registerBodyDTO extends createZodDto(registerBodySchema) {}
export class registerResDTO extends createZodDto(registerResSchema) {}
export class sendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}
