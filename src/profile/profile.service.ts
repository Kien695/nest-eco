import { BadRequestException, Injectable } from '@nestjs/common';
import { NotFoundRecordException } from 'src/shared/error';
import { SharedUserRepostory } from 'src/shared/repositories/shared-user.repo';
import { HashingService } from 'src/shared/services/hasing.service';
import { changePasswordBodyType, updateMeBodyType } from './profile.model';
import { isUniqueContraintError } from 'src/shared/helper';

@Injectable()
export class ProfileService {
  constructor(
    private readonly sharedUserReponsitory: SharedUserRepostory,
    private readonly hashingService: HashingService,
  ) {}

  async getProfile(userId: number) {
    const user = await this.sharedUserReponsitory.findUniqueIncludePermissions({
      id: userId,
      deletedAt: null,
    });
    if (!user) {
      throw NotFoundRecordException;
    }
    return user;
  }
  async updateProfile({
    userId,
    body,
  }: {
    userId: number;
    body: updateMeBodyType;
  }) {
    try {
      return await this.sharedUserReponsitory.update(
        {
          id: userId,
          deletedAt: null,
        },
        {
          ...body,
          updatedById: userId,
        },
      );
    } catch (error) {
      if (isUniqueContraintError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
  async changePassword({
    userId,
    body,
  }: {
    userId: number;
    body: Omit<changePasswordBodyType, 'confirmPassword'>;
  }) {
    try {
      const { password, newPassword } = body;
      const user = await this.sharedUserReponsitory.findUnique({
        id: userId,
        deletedAt: null,
      });
      if (!user) {
        throw NotFoundRecordException;
      }
      if (!user.password) {
        throw new BadRequestException({
          message: 'Tài khoản này chưa thiết lập mật khẩu',
          path: 'password',
        });
      }
      const isPassMatch = await this.hashingService.compare(
        password,
        user.password,
      );
      const hashPassword = await this.hashingService.hash(newPassword);
      await this.sharedUserReponsitory.update(
        { id: userId, deletedAt: null },
        {
          password: hashPassword,
          updatedById: userId,
        },
      );
      return {
        message: 'Đổi mật khẩu thành công!',
      };
    } catch (error) {
      if (isUniqueContraintError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
