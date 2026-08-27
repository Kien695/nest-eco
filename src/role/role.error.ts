import {
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const RoleAlreadyExistException = new UnprocessableEntityException([
  {
    message: 'Error.RoleAlreadyExists',
    path: 'name',
  },
]);

export const ProhibitedActionOnBaseRole = new ForbiddenException(
  'Error.ProhibitedActionOnBaseRole',
);
