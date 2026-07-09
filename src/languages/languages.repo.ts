import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  createLanguageBodyType,
  languageType,
  updateLanguageBodyType,
} from './languages.model';

@Injectable()
export class LanguagesRepo {
  constructor(private prismaService: PrismaService) {}
  findAll(): Promise<languageType[]> {
    return this.prismaService.language.findMany({
      where: {
        deletedAt: null,
      },
    });
  }
  findById(id: string): Promise<languageType | null> {
    return this.prismaService.language.findUnique({
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
    createdById: number;
    data: createLanguageBodyType;
  }): Promise<languageType> {
    return this.prismaService.language.create({
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
    id: string;
    updatedById: number | null;
    data: updateLanguageBodyType;
  }): Promise<languageType> {
    return this.prismaService.language.update({
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
  delete(id: string, isHard?: boolean): Promise<languageType> {
    return isHard
      ? this.prismaService.language.delete({
          where: {
            id,
          },
        })
      : this.prismaService.language.update({
          where: {
            id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        });
  }
}
