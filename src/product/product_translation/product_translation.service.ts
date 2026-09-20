import { Injectable } from '@nestjs/common';
import { NotFoundRecordException } from 'src/shared/error';
import {
  CreateProductTranslationBodyDTO,
  UpdateProductTranslationBodyDTO,
} from './product_translation.dto';
import {
  CreateProductTranslationBodyType,
  UpdateProductTranslationBodyType,
} from './product_translation.model';
import {
  isUniqueContraintError,
  isUniqueNotFoundError,
} from 'src/shared/helper';
import { ProductTranslationAleardyExistException } from './product_translation.error';
import { ProductTranslationRepo } from './product_translation.repo';

@Injectable()
export class ProductTranslationService {
  constructor(private productTranslationRepo: ProductTranslationRepo) {}
  async findById(id: number) {
    const product = await this.productTranslationRepo.findById(id);
    if (!product) {
      throw NotFoundRecordException;
    }
    return product;
  }

  async create({
    data,
    createdById,
  }: {
    data: CreateProductTranslationBodyType;
    createdById: number;
  }) {
    try {
      return await this.productTranslationRepo.create({ createdById, data });
    } catch (error) {
      if (isUniqueContraintError(error)) {
        throw ProductTranslationAleardyExistException;
      }
      throw error;
    }
  }

  async update({
    id,
    data,
    updatedById,
  }: {
    id: number;
    data: UpdateProductTranslationBodyType;
    updatedById: number;
  }) {
    try {
      const product = await this.productTranslationRepo.update({
        id,
        updatedById,
        data,
      });
      return product;
    } catch (error) {
      if (isUniqueContraintError(error)) {
        throw ProductTranslationAleardyExistException;
      }
      if (isUniqueNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      await this.productTranslationRepo.delete(id);
      return {
        message: 'Delete successfully',
      };
    } catch (error) {
      if (isUniqueNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
