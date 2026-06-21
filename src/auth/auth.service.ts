import { ConflictException, Injectable } from '@nestjs/common';
import { HashingService } from 'src/shared/services/hasing.service';

import { RolesService } from './roles.service';
import { isUniqueContraintError } from 'src/shared/helper';
import { registerBodyType, SendOTPBodyType } from './auth.model';
import { AuthRepository } from './auth.repon';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepostory: AuthRepository,
    private readonly rolseService: RolesService,
  ) {}
  async register(body: registerBodyType) {
    try {
      const clientRoleId = await this.rolseService.getClientRoleId();
      const hashPass = await this.hashingService.hash(body.password);
      return await this.authRepostory.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashPass,
        roleId: clientRoleId,
      });
    } catch (error) {
      if (isUniqueContraintError(error)) {
        throw new ConflictException('Email đã tồn tại');
      }
      throw error;
    }
  }
  async sendOTP(body: SendOTPBodyType) {}
}
