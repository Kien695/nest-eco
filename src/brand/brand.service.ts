import { Injectable } from '@nestjs/common';
import { BrandRepo } from './brand.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { CreateBrandBodyType } from './brand.model';
import { PaginationQueryType } from 'src/shared/models/request.model';

@Injectable()
export class BrandService {
  constructor(private brandRepo: BrandRepo) {}
  async list(pagination: PaginationQueryType) {
    return this.brandRepo.list(pagination);
  }

  async findById(id: number) {
    const brand = this.brandRepo.findById(id);
    if (!brand) {
      throw NotFoundRecordException;
    }
    return brand;
  }

  async create(data: CreateBrandBodyType, createdById: number) {
    return this.brandRepo.create(createdById, data);
  }

  async update(id: number, data: CreateBrandBodyType, updatedById: number) {
    const brand = await this.brandRepo.findById(id);
    if (!brand) {
      throw NotFoundRecordException;
    }
    return this.brandRepo.update(id, updatedById, data);
  }

  async delete(id: number, isHard?: Boolean) {
    const brand = await this.brandRepo.findById(id);
    if (!brand) {
      throw NotFoundRecordException;
    }
    return this.brandRepo.delete(id, isHard);
  }
}
