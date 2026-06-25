import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import envConfig from '../config';
import { Reflector } from '@nestjs/core';
import {
  AUTH_TYPE_KEY,
  authTypeDecoratorPayload,
} from '../decorators/auth.decorators';
import { AccessTokenGuard } from './accessToken.guard';
import { APIGuard } from './api_key.guards';
import { authType, conditionGuard } from '../constants/auth.constant';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: APIGuard,
  ) {
    this.authTypeGuardMap = {
      [authType.Bearer]: this.accessTokenGuard,
      [authType.APIKey]: this.apiKeyGuard,
      [authType.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValue = this.reflector.getAllAndOverride<
      authTypeDecoratorPayload | undefined
    >(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]) ?? {
      authTypes: [authType.Bearer],
      options: { condition: conditionGuard.And },
    };

    const guards = authTypeValue.authTypes.map(
      (authType) => this.authTypeGuardMap[authType],
    );

    let error = new UnauthorizedException();

    if (authTypeValue.options.condition === conditionGuard.Or) {
      for (const instance of guards) {
        const canActivate = await Promise.resolve(
          instance.canActivate(context),
        ).catch((err) => {
          error = err;
          return false;
        });

        if (canActivate) {
          return true;
        }
      }

      throw error;
    } else {
      for (const instance of guards) {
        const canActivate = await Promise.resolve(
          instance.canActivate(context),
        ).catch((err) => {
          error = err;
          return false;
        });

        if (!canActivate) {
          throw new UnauthorizedException();
        }
      }

      return true;
    }
  }
}
