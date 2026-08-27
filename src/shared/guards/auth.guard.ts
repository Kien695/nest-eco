import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
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

    if (authTypeValue.options.condition === conditionGuard.Or) {
      return this.handleOrCondition(guards, context);
    } else {
      return this.handleAndCondition(guards, context);
    }
  }
  private async handleOrCondition(
    guards: CanActivate[],
    context: ExecutionContext,
  ) {
    let lastError: any = null;

    for (const guard of guards) {
      try {
        if (await guard.canActivate(context)) {
          return true;
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError instanceof HttpException) {
      throw lastError;
    }

    throw new UnauthorizedException();
  }

  private async handleAndCondition(
    guards: CanActivate[],
    context: ExecutionContext,
  ) {
    for (const guard of guards) {
      if (!(await guard.canActivate(context))) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
