import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CategoryTranslationType,
  CreateCategoryTranslationBodyType,
  UpdateCategoryTranslationBodyType,
} from './category_translation.model';

@Injectable()
export class CategoryTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findById(id: number) {
    return this.prismaService.categoryTranslation.findUnique({
      where: { id: id, deletedAt: null },
    });
  }

  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreateCategoryTranslationBodyType;
  }): Promise<CategoryTranslationType> {
    return this.prismaService.categoryTranslation.create({
      data: {
        ...data,
        createdById,
      },
    });
  }

  update({
    id,
    updatedById,
    data,
  }: {
    id: number;
    updatedById: number | null;
    data: UpdateCategoryTranslationBodyType;
  }): Promise<CategoryTranslationType> {
    return this.prismaService.categoryTranslation.update({
      where: { id },
      data: {
        ...data,
        updatedById,
      },
    });
  }

  delete({
    id,
    isHard,
  }: {
    id: number;
    isHard?: boolean;
  }): Promise<CategoryTranslationType> {
    if (isHard) {
      return this.prismaService.categoryTranslation.delete({
        where: { id },
      });
    }
    return this.prismaService.categoryTranslation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
