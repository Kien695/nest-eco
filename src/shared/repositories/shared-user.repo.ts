import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { UserType } from '../models/shared-user.model';
import { RoleType } from '../models/shared-role';
import { PermissionType } from '../models/shared-permission';
import { Prisma, User } from '@prisma/client';

type UserIncludeRolePermissionType = UserType & {
  role: RoleType & { permissions: PermissionType[] };
};

type WhereUniqueUserType =
  | { id: number; [key: string]: any }
  | { email: string; [key: string]: any };

@Injectable()
export class SharedUserRepostory {
  constructor(private readonly prismaService: PrismaService) {}
  findUnique(where: WhereUniqueUserType): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where,
    });
  }
  findUniqueIncludePermissions(
    where: WhereUniqueUserType,
  ): Promise<UserIncludeRolePermissionType | null> {
    return this.prismaService.user.findUnique({
      where,
      include: {
        role: {
          include: {
            permissions: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });
  }
  update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<User> {
    return this.prismaService.user.update({
      where,
      data,
    });
  }
}
