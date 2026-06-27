export const authType = {
  Bearer: 'Bearer',
  None: 'None',
  APIKey: 'ApiKey',
} as const;
export type authTypeType = (typeof authType)[keyof typeof authType];

export const conditionGuard = {
  And: 'and',
  Or: 'or',
} as const;
export type conditionGuardType =
  (typeof conditionGuard)[keyof typeof conditionGuard];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
} as const;
export const AuthProvider = {
  LOCAL: 'LOCAL',
  GOOGLE: 'GOOGLE',
};
export const TypeOfVerificationCode = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
} as const;

export type TypeOfVerificationCodeType =
  (typeof TypeOfVerificationCode)[keyof typeof TypeOfVerificationCode];
