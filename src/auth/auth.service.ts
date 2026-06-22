import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HashingService } from 'src/shared/services/hasing.service';

import { RolesService } from './roles.service';
import { generateOTP, isUniqueContraintError } from 'src/shared/helper';
import { registerBodyType, SendOTPBodyType } from './auth.model';
import { AuthRepository } from './auth.repon';
import { SharedUserRepostory } from 'src/shared/repositories/shared-user.repo';
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { EmailService } from 'src/shared/services/email.services';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepostory: AuthRepository,
    private readonly rolseService: RolesService,
    private readonly sharedUserRepo: SharedUserRepostory,
    private readonly emailService: EmailService,
  ) {}
  async register(body: registerBodyType) {
    try {
      const verificationCode =
        await this.authRepostory.findUniqueVerificationCode({
          email: body.email,
          code: body.code,
          type: TypeOfVerificationCode.REGISTER,
        });
      if (!verificationCode) {
        throw new UnprocessableEntityException([
          {
            message: 'Mã OTP không hợp lệ',
            path: 'code',
          },
        ]);
      }
      if (verificationCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException([
          {
            message: 'Mã OTP đã hết hạn',
            path: 'code',
          },
        ]);
      }
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
        // throw new ConflictException('Email đã tồn tại');
        throw new UnprocessableEntityException([
          {
            message: 'Email đã tồn tại',
            path: 'email',
          },
        ]);
      }
      throw error;
    }
  }
  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepo.findUnique({
      email: body.email,
    });
    if (user) {
      throw new UnprocessableEntityException([
        {
          message: 'Email đã tồn tại',
          path: 'email',
        },
      ]);
    }
    const code = generateOTP();

    const verificationCode = await this.authRepostory.createVertificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    //gửi OTP
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code,
    });
    if (error) {
      console.log(error);
      throw new UnprocessableEntityException([
        {
          message: 'Gửi mã OTP thất bại!',
          path: 'code',
        },
      ]);
    }

    return verificationCode;
  }
}
