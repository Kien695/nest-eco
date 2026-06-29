import {
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';

export const AuthErrorMessage = {
  InvalidOTP: 'Error.InvalidOTP',
  OTPExpired: 'Error.OTPExpired',
  EmailAlreadyExists: 'Error.EmailAlreadyExists',
  EmailNotFound: 'Error.EmailNotFound',
  GoogleAccountOnly: 'Error.GoogleAccountOnly',
  InvalidPassword: 'Error.InvalidPassword',
  SendOTPFailed: 'Error.SendOTPFailed',
  RefreshTokenAlreadyUsed: 'Error.RefreshTokenAlreadyUsed',
  UnauthorizedAccess: 'Error.UnauthorizedAccess',
  LogoutSuccess: 'Success.LogoutSuccess',
  SendOTPSuccess: 'Success.SendOTPSuccess',
  TOTPAlreadyEnable: 'Error.TOTPAlreadyEnable',
  TOTPNotEnableEception: 'Error.TOTPNotEnable',
  InvalidTOTPAndCode: 'Error.InvalidTOTPAndCode',
  InvalidTOTPException: 'Error.InvalidTOTPException',
} as const;

export const InvalidOTPException = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.InvalidOTP,
    path: 'code',
  },
]);

export const OTPExpiredException = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.OTPExpired,
    path: 'code',
  },
]);

export const EmailAlreadyExistsException = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.EmailAlreadyExists,
    path: 'email',
  },
]);

export const EmailNotFoundException = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.EmailNotFound,
    path: 'email',
  },
]);

export const GoogleAccountOnlyException = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.GoogleAccountOnly,
    path: 'email',
  },
]);

export const InvalidPasswordException = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.InvalidPassword,
    path: 'password',
  },
]);

export const SendOTPFailedException = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.SendOTPFailed,
    path: 'code',
  },
]);

export const RefreshTokenAlreadyUsedException = new UnauthorizedException(
  AuthErrorMessage.RefreshTokenAlreadyUsed,
);

export const UnauthorizedAccessException = new UnauthorizedException(
  AuthErrorMessage.UnauthorizedAccess,
);

export const TOTPAlreadyEnableException = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.TOTPAlreadyEnable,
    path: 'totpCode',
  },
]);
export const TOTPNotEnableEception = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.TOTPNotEnableEception,
    path: 'totpCode',
  },
]);
export const InvalidTOTPAndCodeException = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.InvalidTOTPAndCode,
    path: 'totpCode',
  },
  {
    message: AuthErrorMessage.InvalidTOTPAndCode,
    path: 'code',
  },
]);
export const InvalidTOTPException = new UnprocessableEntityException([
  {
    message: AuthErrorMessage.InvalidTOTPException,
    path: 'totpCode',
  },
]);
