import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  BrandIncludeTranslationType,
  BrandType,
  CreateBrandBodyType,
  GetBrandResType,
} from './brand.model';
import { PaginationQueryType } from 'src/shared/models/request.model';

@Injectable()
export class BrandRepo {
  constructor(private prismaService: PrismaService) {}
  async list(
    pagination: PaginationQueryType,
    languageId?: string,
  ): Promise<GetBrandResType> {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;
    const [totalItem, data] = await Promise.all([
      this.prismaService.brand.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.brand.findMany({
        skip,
        take,
        where: {
          deletedAt: null,
        },
        include: {
          brandTranslations: {
            where: languageId
              ? { languageId, deletedAt: null }
              : { deletedAt: null },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);
    return {
      data,
      total: totalItem,
      page: pagination.page,
      limit: pagination.limit,
      totalPage: Math.ceil(totalItem / pagination.limit),
    };
  }

  findById(
    id: number,
    languageId?: string,
  ): Promise<BrandIncludeTranslationType | null> {
    return this.prismaService.brand.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        brandTranslations: {
          where: languageId
            ? { languageId, deletedAt: null }
            : { deletedAt: null },
        },
      },
    });
  }

  create(
    createdById: number,
    data: CreateBrandBodyType,
  ): Promise<BrandIncludeTranslationType> {
    return this.prismaService.brand.create({
      data: {
        ...data,
        createdById,
      },
      include: {
        brandTranslations: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }
  async update(
    id: number,
    updatedById: number,
    data: CreateBrandBodyType,
  ): Promise<BrandIncludeTranslationType> {
    return this.prismaService.brand.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
      include: {
        brandTranslations: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  delete(id: number, isHard?: Boolean): Promise<BrandType> {
    return this.prismaService.brand.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        brandTranslations: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }
}
