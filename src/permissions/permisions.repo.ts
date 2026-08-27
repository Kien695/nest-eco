import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CreatePermissionBodyType,
  GetPermissionQueryType,
  GetPermissionResType,
  PermissionType,
  UpdatePermissionBodyType,
} from './permissions.model';
import { NullSchema } from 'node_modules/zod/v4/core/json-schema.cjs';

@Injectable()
export class PermissionRepo {
  constructor(private prismaService: PrismaService) {}
  async list(pagination: GetPermissionQueryType) {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;
    const [totalItems, data] = await Promise.all([
      this.prismaService.permission.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.permission.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take,
      }),
    ]);
    return {
      data,
      totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItems / pagination.limit),
    };
  }
  findbyId(id: number) {
    return this.prismaService.permission.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }
  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreatePermissionBodyType;
  }) {
    return this.prismaService.permission.create({
      data: {
        createdById,
        ...data,
      },
    });
  }
  update({
    id,
    updatedById,
    data,
  }: {
    id: number;
    updatedById: number;
    data: UpdatePermissionBodyType;
  }) {
    return this.prismaService.permission.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
    });
  }
  delete(id: number, isHard?: boolean) {
    return isHard
      ? this.prismaService.permission.delete({
          where: {
            id,
          },
        })
      : this.prismaService.permission.update({
          where: { id, deletedAt: null },
          data: {
            deletedAt: new Date(),
          },
        });
  }
}
