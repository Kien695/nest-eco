import { Injectable } from '@nestjs/common';
import { CategoryRepo } from './category.repo';
import { NotFoundRecordException } from 'src/shared/error';
import {
  CreateCategoryBodyType,
  UpdateCategoryBodyType,
} from './category.model';

@Injectable()
export class CategoryService {
  constructor(private categoryRepo: CategoryRepo) {}

  async findAll(parentCategoryId?: number) {
    return this.categoryRepo.findAll({ parentCategoryId });
  }
  async findById(id: number) {
    const category = await this.categoryRepo.findById({ id });
    if (!category) {
      throw NotFoundRecordException;
    }
    return category;
  }
  async create(data: CreateCategoryBodyType, createdById: number) {
    return this.categoryRepo.create({ data, createdById });
  }

  async update(id: number, data: UpdateCategoryBodyType, updatedById: number) {
    const category = await this.categoryRepo.findById({ id });
    if (!category) {
      throw NotFoundRecordException;
    }
    return this.categoryRepo.update(id, updatedById, data);
  }

  async delete(id: number, isHard?: Boolean) {
    const category = await this.categoryRepo.findById({ id });
    if (!category) {
      throw NotFoundRecordException;
    }
    return this.categoryRepo.delete(id, isHard);
  }
}
