import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  BrandTranslationType,
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType,
} from './brand_translation.model';

@Injectable()
export class BrandTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findById(id: number) {
    return this.prismaService.brandTranslation.findUnique({
      where: { id: id, deletedAt: null },
    });
  }

  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreateBrandTranslationBodyType;
  }): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.create({
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
    data: UpdateBrandTranslationBodyType;
  }): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.update({
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
  }): Promise<BrandTranslationType> {
    if (isHard) {
      return this.prismaService.brandTranslation.delete({
        where: { id },
      });
    }
    return this.prismaService.brandTranslation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
