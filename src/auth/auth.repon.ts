import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  deviceType,
  loginOauthBodyType,
  refreshTokenType,
  registerBodyType,
  roleType,
  verificationCodeType,
} from './auth.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant';
import { AuthProvider, Prisma, User } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async createUser(
    user: Omit<registerBodyType, 'confirmPassword' | 'code'> &
      Pick<UserType, 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true,
      },
    });
  }

  async createUserOauth(user: loginOauthBodyType) {
    return this.prismaService.user.create({
      data: {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        providerId: user.providerId,
        roleId: user.roleId,
        authProvider: user.authProvider as AuthProvider,
      },
      include: { role: true },
    });
  }
  async createVertificationCode(
    payload: Pick<
      verificationCodeType,
      'email' | 'type' | 'code' | 'expiresAt'
    >,
  ): Promise<verificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: { email: payload.email },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
    });
  }
  async findUniqueVerificationCode(
    uniqueValue:
      | { email: string }
      | { id: number }
      | {
          email: string;
          code: string;
          type: TypeOfVerificationCodeType;
        },
  ): Promise<verificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: uniqueValue,
    });
  }
  async createRefreshToken(data: {
    token: string;
    userId: number;
    expiresAt: Date;
    deviceId: number;
  }) {
    return this.prismaService.refreshToken.create({ data });
  }
  async createDevice(
    data: Pick<deviceType, 'userId' | 'userAgent' | 'ip'> &
      Partial<Pick<deviceType, 'lastActive' | 'isActive'>>,
  ) {
    return this.prismaService.device.create({ data });
  }

  async findUniqueUserIncludeRole(
    uniqueObject: { email: string } | { id: number },
  ): Promise<(UserType & { role: roleType }) | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true,
      },
    });
  }
  async findUniqueRefreshTokenIcludeUserRole(uniqueObject: {
    token: string;
  }): Promise<
    (refreshTokenType & { user: UserType & { role: roleType } }) | null
  > {
    return this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
      include: {
        user: {
          include: { role: true },
        },
      },
    });
  }
  updateDevice(
    deviceId: number,
    data: Partial<deviceType>,
  ): Promise<deviceType> {
    return this.prismaService.device.update({
      where: { id: deviceId },
      data,
    });
  }
  deleteRefreshToken(uniqueObject: {
    token: string;
  }): Promise<refreshTokenType> {
    return this.prismaService.refreshToken.delete({
      where: uniqueObject,
    });
  }
  updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<User> {
    return this.prismaService.user.update({
      where,
      data,
    });
  }
  async deleteVerificationCode(
    uniqueValue:
      | { email: string }
      | { id: number }
      | {
          email: string;
          code: string;
          type: TypeOfVerificationCodeType;
        },
  ): Promise<verificationCodeType | null> {
    return this.prismaService.verificationCode.delete({
      where: uniqueValue,
    });
  }
}
