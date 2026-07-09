import { Injectable } from '@nestjs/common';
import { LanguagesRepo } from './languages.repo';
import { NotFoundRecordException } from 'src/shared/error';
import {
  createLanguageBodyType,
  updateLanguageBodyType,
} from './languages.model';
import { languagesAleadyExistsException } from './languages.error';
import { isUniqueNotFoundError } from 'src/shared/helper';

@Injectable()
export class LanguagesService {
  constructor(private readonly languagesRepo: LanguagesRepo) {}
  async findAll() {
    const data = await this.languagesRepo.findAll();
    return {
      data,
      totalItems: data.length,
    };
  }
  async findById(id: string) {
    const data = await this.languagesRepo.findById(id);
    if (!data) {
      throw NotFoundRecordException;
    }
    return data;
  }
  async create({
    createdById,
    data,
  }: {
    createdById: number;
    data: createLanguageBodyType;
  }) {
    try {
      return this.languagesRepo.create({ createdById, data });
    } catch (error) {
      throw languagesAleadyExistsException;
    }
  }
  async update({
    id,
    updatedById,
    data,
  }: {
    id: string;
    updatedById: number | null;
    data: updateLanguageBodyType;
  }) {
    const language = await this.languagesRepo.findById(id);
    if (!language) {
      throw NotFoundRecordException;
    }
    return this.languagesRepo.update({ id, updatedById, data });
  }
  async delete(id: string) {
    try {
      await this.languagesRepo.delete(id, true);
      return { message: 'Language deleted successfully' };
    } catch (error) {
      if (isUniqueNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
