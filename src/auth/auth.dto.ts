import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  LoginBodySchema,
  LoginResSchema,
  logoutBodySchema,
  RefreshTokenBodySchema,
  refreshTokenResShema,
  RefreshTokenSchema,
  registerBodySchema,
  registerResSchema,
  SendOTPBodySchema,
} from './auth.model';

export class registerBodyDTO extends createZodDto(registerBodySchema) {}
export class registerResDTO extends createZodDto(registerResSchema) {}
export class sendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}
export class loginBodyDTO extends createZodDto(LoginBodySchema) {}
export class loginResDTO extends createZodDto(LoginResSchema) {}
export class refreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}
export class refreshTokenResDTO extends createZodDto(refreshTokenResShema) {}
export class logoutBodyDTO extends createZodDto(logoutBodySchema) {}
