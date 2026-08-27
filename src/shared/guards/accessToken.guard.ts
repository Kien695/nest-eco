import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AccessTokenPayload } from '../types/jwt.type';
import { PrismaService } from '../services/prisma.service';
import { HTTPMethod } from '../constants/role.constant';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    //extract and validate token
    const decodedAccessToken = await this.extractAndValidateToken(request);
    //check user permission
    await this.validateUserPermission(decodedAccessToken, request);
    return true;
  }

  private async extractAndValidateToken(
    request: any,
  ): Promise<AccessTokenPayload> {
    const accessToken = this.extractAccessTokenFromHeader(request);
    try {
      const decodedAccessToken =
        await this.tokenService.verifyAccessToken(accessToken);
      request.userId = decodedAccessToken;
      return decodedAccessToken;
    } catch (error) {
      throw new UnauthorizedException('Error.InvalidAccessToken');
    }
  }

  private extractAccessTokenFromHeader(request: any): string {
    const accessToken = request.headers.authrorization?.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Error.MissingAccessToken');
    }
    return accessToken;
  }
  private async validateUserPermission(
    decodedAccessToken: AccessTokenPayload,
    request: any,
  ): Promise<void> {
    const roleId = decodedAccessToken.roleId;
    const path = request.route.path;
    const method = request.method as keyof typeof HTTPMethod;
    const role = await this.prismaService.role
      .findUniqueOrThrow({
        where: {
          id: roleId,
          deletedAt: null,
        },
        include: {
          permissions: {
            where: {
              deletedAt: null,
              path,
              method,
            },
          },
        },
      })
      .catch(() => {
        throw new ForbiddenException();
      });
    const canAccess = role.permissions.length > 0;
    if (!canAccess) {
      throw new ForbiddenException();
    }
  }
}
