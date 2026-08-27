import { BadRequestException, Injectable } from '@nestjs/common';
import { RoleRepo } from './role.repo';
import {
  createRoleBodyType,
  GetRoleQueryType,
  updateRoleBodyType,
} from './role.model';
import { NotFoundRecordException } from 'src/shared/error';
import { isUniqueContraintError } from 'src/shared/helper';
import { idnEmail } from 'node_modules/zod/v4/core/regexes';
import {
  ProhibitedActionOnBaseRole,
  RoleAlreadyExistException,
} from './role.error';
import { roleName } from 'src/shared/constants/role.constant';

@Injectable()
export class RoleService {
  constructor(private roleRepo: RoleRepo) {}
  async list(pagination: GetRoleQueryType) {
    const data = await this.roleRepo.list(pagination);
    return data;
  }
  async findById(id: number) {
    const role = await this.roleRepo.findById(id);
    if (!role) {
      throw NotFoundRecordException;
    }
    return role;
  }
  async create({
    data,
    createdById,
  }: {
    data: createRoleBodyType;
    createdById: number;
  }) {
    try {
      const role = await this.roleRepo.create({
        createdById,
        data,
      });
      return role;
    } catch (error) {
      throw error;
    }
  }
  async update({
    id,
    data,
    updatedById,
  }: {
    id: number;
    data: updateRoleBodyType;
    updatedById: number;
  }) {
    try {
      const role = await this.roleRepo.findById(id);
      if (!role) {
        throw NotFoundRecordException;
      }
      //không cho bất kì ai update role admin

      if (role.name === roleName.Admin) {
        throw ProhibitedActionOnBaseRole;
      }
      const roleUpdate = await this.roleRepo.update({ id, updatedById, data });
      return roleUpdate;
    } catch (error) {
      if (isUniqueContraintError(error)) {
        throw RoleAlreadyExistException;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
  async delete(id: number) {
    try {
      const role = await this.roleRepo.findById(id);
      if (!role) {
        throw NotFoundRecordException;
      }
      //không cho bất kì ai xóa 3 role này
      const baseRole: string[] = [
        roleName.Admin,
        roleName.Client,
        roleName.Seller,
      ];
      if (baseRole.includes(role.name)) {
        throw ProhibitedActionOnBaseRole;
      }
      await this.roleRepo.delete(id);
      return {
        message: 'Xóa thành công!',
      };
    } catch (error) {
      throw error;
    }
  }
}
