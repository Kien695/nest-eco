import { Injectable } from '@nestjs/common';

import { BrandTranslationRepository } from './brand_translation.repo';
import { CreateBrandTranslationBodyType } from './brand_translation.model';

@Injectable()
export class BrandTranslationService {
  constructor(private brandTranslationRepo: BrandTranslationRepository) {}
  findById(id: number) {
    return this.brandTranslationRepo.findById(id);
  }
  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreateBrandTranslationBodyType;
  }) {
    return this.brandTranslationRepo.create({ createdById, data });
  }

  update({
    id,
    updatedById,
    data,
  }: {
    id: number;
    updatedById: number | null;
    data: CreateBrandTranslationBodyType;
  }) {
    return this.brandTranslationRepo.update({ id, updatedById, data });
  }

  delete({ id, isHard }: { id: number; isHard?: boolean }) {
    return this.brandTranslationRepo.delete({ id, isHard });
  }
}
