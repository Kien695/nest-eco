import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { HashingService } from 'src/shared/services/hasing.service';
import { SharedUserRepostory } from 'src/shared/repositories/shared-user.repo';
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repo';
import {
  CreateUserBodyType,
  GetUserQueryType,
  UpdateUserBodyType,
} from './user.model';
import { NotFoundRecordException } from 'src/shared/error';
import { roleName } from 'src/shared/constants/role.constant';
import {
  isForeignKeyConstrainPrismaError,
  isUniqueContraintError,
  isUniqueNotFoundError,
} from 'src/shared/helper';
import {
  CannotUpdateOrDeleteYourselfException,
  RoleNotFoundException,
  UserAleardyExistsException,
} from './user.error';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepo,
    private hashingService: HashingService,
    private sharedUserRepository: SharedUserRepostory,
    private sharedRoleRepository: SharedRoleRepository,
  ) {}
  list(pagination: GetUserQueryType) {
    return this.userRepo.list(pagination);
  }

  async findById(id: number) {
    const user = this.sharedUserRepository.findUniqueIncludePermissions({
      id,
      deletedAt: null,
    });
    if (!user) {
      throw NotFoundRecordException;
    }
    return user;
  }

  async create({
    data,
    createdById,
    createdByRoleName,
  }: {
    data: CreateUserBodyType;
    createdById: number;
    createdByRoleName: string;
  }) {
    try {
      await this.verifyRole({
        roleNameAgent: createdByRoleName,
        roleIdTarget: data.roleId,
      });
      if (!data.password) {
        return 'Mật khẩu không tồn tại';
      }
      const hashPassword = await this.hashingService.hash(data.password);
      const user = await this.userRepo.create({
        createdById,
        data: { ...data, password: hashPassword },
      });
      return user;
    } catch (error) {
      if (isForeignKeyConstrainPrismaError(error)) {
        throw RoleNotFoundException;
      }
      if (isUniqueContraintError(error)) {
        throw UserAleardyExistsException;
      }
      throw error;
    }
  }
  private async verifyRole({ roleNameAgent, roleIdTarget }) {
    //agent là admin thì cho phép
    if (roleNameAgent === roleName.Admin) {
      return true;
    } else {
      //agent không phải admin thì roleIdTarget phải khác admin
      const adminRoleId = await this.sharedRoleRepository.getAdminRoleId();
      if (roleIdTarget === adminRoleId) {
        throw new ForbiddenException();
      }
      return true;
    }
  }

  async update({
    id,
    userId,
    data,
    updatedById,
    updatedByRoleName,
  }: {
    id: number;
    userId: number;
    data: UpdateUserBodyType;
    updatedById: number;
    updatedByRoleName: string;
  }) {
    try {
      //Không thể cập nhật hoặc xóa chính mình
      if (id === userId) {
        throw CannotUpdateOrDeleteYourselfException;
      }
      const user = await this.sharedUserRepository.findUnique({
        id,
        deletedAt: null,
      });
      if (!user) {
        throw NotFoundRecordException;
      }
      const roleIdTarget = user.roleId;
      await this.verifyRole({
        roleNameAgent: updatedByRoleName,
        roleIdTarget,
      });
      const updatedUser = await this.sharedUserRepository.update(
        { id, deletedAt: null },
        { ...data, updatedById },
      );
      return updatedUser;
    } catch (error) {
      if (isUniqueNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueContraintError(error)) {
        throw UserAleardyExistsException;
      }
      if (isForeignKeyConstrainPrismaError(error)) {
        throw RoleNotFoundException;
      }
      throw error;
    }
  }

  async delete({
    id,
    userId,
    deletedByRoleName,
  }: {
    id: number;
    userId: number;
    deletedByRoleName: string;
  }) {
    try {
      //Không thể xóa chính mình
      if (id === userId) {
        throw CannotUpdateOrDeleteYourselfException;
      }
      const user = await this.sharedUserRepository.findUnique({
        id,
        deletedAt: null,
      });
      if (!user) {
        throw NotFoundRecordException;
      }
      const roleIdTarget = user.roleId;
      await this.verifyRole({
        roleNameAgent: deletedByRoleName,
        roleIdTarget,
      });
      const deletedUser = await this.userRepo.delete(id);
      return {
        message: 'Xóa người dùng thành công',
      };
    } catch (error) {
      if (isUniqueNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
