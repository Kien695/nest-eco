import { Injectable } from '@nestjs/common';
import { PermissionRepo } from './permisions.repo';
import {
  CreatePermissionBodyType,
  GetPermissionQueryType,
  UpdatePermissionBodyType,
} from './permissions.model';
import { NotFoundRecordException } from 'src/shared/error';
import {
  isUniqueContraintError,
  isUniqueNotFoundError,
} from 'src/shared/helper';
import { PermissionAlreadyExistException } from './permissions.error';

@Injectable()
export class PermissionsService {
  constructor(private permissionRepo: PermissionRepo) {}
  async list(pagination: GetPermissionQueryType) {
    const data = await this.permissionRepo.list(pagination);
    return data;
  }
  async findById(id: number) {
    const permission = await this.permissionRepo.findbyId(id);
    if (!permission) {
      throw NotFoundRecordException;
    }
    return permission;
  }
  async create({
    data,
    createdById,
  }: {
    data: CreatePermissionBodyType;
    createdById: number;
  }) {
    try {
      return this.permissionRepo.create({ createdById, data });
    } catch (error) {
      if (isUniqueContraintError(error)) {
        throw PermissionAlreadyExistException;
      }
      throw error;
    }
  }
  async update({
    id,
    updatedById,
    data,
  }: {
    id: number;
    updatedById: number;
    data: UpdatePermissionBodyType;
  }) {
    try {
      const permission = await this.permissionRepo.update({
        id,
        updatedById,
        data,
      });
      return permission;
    } catch (error) {
      if (isUniqueNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueContraintError(error)) {
        throw PermissionAlreadyExistException;
      }
      throw error;
    }
  }
  async delete(id: number) {
    try {
      await this.permissionRepo.delete(id);
      return {
        message: 'Xóa thành công!',
      };
    } catch (error) {
      if (isUniqueNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
