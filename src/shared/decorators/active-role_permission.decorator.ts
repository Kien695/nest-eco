import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from '../types/jwt.type';

import { RolePermissionType } from '../models/shared-role';

export const ActiveRolePermission = createParamDecorator(
  (field: keyof RolePermissionType | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const rolePermissions: RolePermissionType | undefined =
      request.role_permission;

    return field ? rolePermissions?.[field] : rolePermissions;
  },
);
