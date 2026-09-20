import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CategoryIncludeTranslationType,
  CategoryType,
  CreateCategoryBodyType,
  GetAllCategoryResType,
  UpdateCategoryBodyType,
} from './category.model';

@Injectable()
export class CategoryRepo {
  constructor(private prismaService: PrismaService) {}

  async findAll({
    parentCategoryId,
    languageId,
  }: {
    parentCategoryId?: number | null;
    languageId?: string;
  }): Promise<GetAllCategoryResType> {
    const category = await this.prismaService.category.findMany({
      where: {
        deletedAt: null,
        parentCategoryId: parentCategoryId ?? null,
      },
      include: {
        categoryTranslations: {
          where: !languageId
            ? { deletedAt: null }
            : { deletedAt: null, languageId: languageId },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      data: category,
      totalItems: category.length,
    };
  }

  findById({
    id,
    languageId,
  }: {
    id: number;
    languageId?: string;
  }): Promise<CategoryIncludeTranslationType | null> {
    return this.prismaService.category.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        categoryTranslations: {
          where: !languageId
            ? { deletedAt: null }
            : { deletedAt: null, languageId: languageId },
        },
      },
    });
  }

  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreateCategoryBodyType;
  }): Promise<CategoryIncludeTranslationType> {
    return this.prismaService.category.create({
      data: {
        ...data,
        createdById,
      },
      include: {
        categoryTranslations: {
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
    data: UpdateCategoryBodyType,
  ): Promise<CategoryIncludeTranslationType> {
    return this.prismaService.category.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
      include: {
        categoryTranslations: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  delete(id: number, isHard?: Boolean): Promise<CategoryType> {
    return this.prismaService.category.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        categoryTranslations: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }
}
