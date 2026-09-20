import { Injectable } from '@nestjs/common';
import { CategoryTranslationRepository } from './category_translation.repo';
import { CreateCategoryTranslationBodyType } from './category_translation.model';

@Injectable()
export class CategoryTranslationService {
  constructor(private categoryTranslationRepo: CategoryTranslationRepository) {}
  findById(id: number) {
    return this.categoryTranslationRepo.findById(id);
  }
  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreateCategoryTranslationBodyType;
  }) {
    return this.categoryTranslationRepo.create({ createdById, data });
  }

  update({
    id,
    updatedById,
    data,
  }: {
    id: number;
    updatedById: number | null;
    data: CreateCategoryTranslationBodyType;
  }) {
    return this.categoryTranslationRepo.update({ id, updatedById, data });
  }

  delete({ id, isHard }: { id: number; isHard?: boolean }) {
    return this.categoryTranslationRepo.delete({ id, isHard });
  }
}
