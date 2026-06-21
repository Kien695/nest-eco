import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { payloadToken } from '../types/jwt.type';

export const ActiveUser = createParamDecorator(
  (field: keyof payloadToken | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user: payloadToken | undefined = request.userId;

    return field ? user?.[field] : user;
  },
);
