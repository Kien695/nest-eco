import {
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const UserAleardyExistsException = new UnprocessableEntityException([
  {
    meassage: 'Error.UserAleardyExists',
    path: 'email',
  },
]);

export const CannotUpdateAdminUserException = new ForbiddenException(
  'Error.CannotUpdateAdminUser',
);
export const CannotDeleteAdminUserException = new ForbiddenException(
  'Error.CannotDeleteAdminUser',
);

//Chỉ admin mới có thể đặt role Admin
export const CannotSetAdminRoleToUserException = new ForbiddenException(
  'Error.CannotSetAdminRoleToUser',
);

export const RoleNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.RoleNotFount',
    pathId: 'roleId',
  },
]);
export const CannotUpdateOrDeleteYourselfException = new ForbiddenException(
  'Error.CannotUpdateOrDeleteYourself',
);
