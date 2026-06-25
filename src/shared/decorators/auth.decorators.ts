import { SetMetadata } from '@nestjs/common';
import {
  authType,
  authTypeType,
  conditionGuard,
  conditionGuardType,
} from '../constants/auth.constant';

export const AUTH_TYPE_KEY = 'authType';
export type authTypeDecoratorPayload = {
  authTypes: authTypeType[];
  options: { condition: conditionGuardType };
};
export const Auth = (
  authTypes: authTypeType[],
  options?: { condition: conditionGuardType },
) => {
  return SetMetadata(AUTH_TYPE_KEY, {
    authTypes,
    options: options ?? { condition: conditionGuard.And },
  });
};

export const isPublic = () => Auth([authType.None]);
