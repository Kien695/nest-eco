import {
  HttpException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HashingService } from 'src/shared/services/hasing.service';

import { RolesService } from './roles.service';
import {
  generateOTP,
  isUniqueContraintError,
  isUniqueNotFoundError,
} from 'src/shared/helper';
import {
  loginBodyType,
  refreshTokenBodyType,
  registerBodyType,
  SendOTPBodyType,
} from './auth.model';
import { AuthRepository } from './auth.repon';
import { SharedUserRepostory } from 'src/shared/repositories/shared-user.repo';
import {
  AuthProvider,
  TypeOfVerificationCode,
} from 'src/shared/constants/auth.constant';
import { EmailService } from 'src/shared/services/email.services';
import { TokenService } from 'src/shared/services/token.service';
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly authRepostory: AuthRepository,
    private readonly rolseService: RolesService,
    private readonly sharedUserRepo: SharedUserRepostory,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
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

    return { message: 'Gửi mã OTP thành công' };
  }

  async login(body: loginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepostory.findUniqueUserIncludeRole({
      email: body.email,
    });
    if (!user) {
      throw new UnprocessableEntityException([
        {
          message: 'Email đã tồn tại',
          path: 'email',
        },
      ]);
    }
    if (!user.password) {
      throw new UnprocessableEntityException([
        {
          message:
            'Tài khoản này đăng nhập bằng Google, vui lòng dùng Google Login',
          path: 'email',
        },
      ]);
    }
    const isPassMatch = await this.hashingService.compare(
      body.password,
      user.password,
    );
    if (!isPassMatch) {
      throw new UnprocessableEntityException([
        {
          message: 'Mật khẩu không chính xác',
          path: 'password',
        },
      ]);
    }
    const device = await this.authRepostory.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
    });
    const tokens = await this.generateToken({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name,
    });

    return tokens;
  }
  async generateToken(payload: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.accessToken({
        userId: payload.userId,
        deviceId: payload.deviceId,
        roleId: payload.roleId,
        roleName: payload.roleName,
      }),
      this.tokenService.refreshToken({ userId: payload.userId }),
    ]);

    const decodeRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    await this.authRepostory.createRefreshToken({
      token: refreshToken,
      userId: payload.userId,
      expiresAt: new Date(decodeRefreshToken.exp * 1000),
      deviceId: payload.deviceId,
    });
    return { accessToken, refreshToken };
  }
  async refreshToken({
    refreshToken,
    userAgent,
    ip,
  }: refreshTokenBodyType & { userAgent: string; ip: string }) {
    try {
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      const refreshTokenInDb =
        await this.authRepostory.findUniqueRefreshTokenIcludeUserRole({
          token: refreshToken,
        });
      if (!refreshTokenInDb) {
        throw new UnauthorizedException('Refresh-Token đã được sử dụng!');
      }

      const {
        deviceId,
        user: { roleId, name: roleName },
      } = refreshTokenInDb;
      const $updateDevice = this.authRepostory.updateDevice(deviceId, {
        userAgent,
        ip,
      });
      const $deleteFreshToken = await this.authRepostory.deleteRefreshToken({
        token: refreshToken,
      });
      const $tokens = this.generateToken({
        userId,
        roleId,
        roleName,
        deviceId,
      });
      const [, , tokens] = await Promise.all([
        $updateDevice,
        $deleteFreshToken,
        $tokens,
      ]);
      return tokens;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }
  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken);
      const deletedRefreshToken = await this.authRepostory.deleteRefreshToken({
        token: refreshToken,
      });
      await this.authRepostory.updateDevice(deletedRefreshToken.deviceId, {
        isActive: false,
      });
      return { message: 'Đăng xuất thành công!' };
    } catch (error) {
      if (isUniqueNotFoundError(error)) {
        throw new UnauthorizedException('RefreshToken đã được sử dụng');
      }
      throw new UnauthorizedException();
    }
  }

  async googleLogin(googleUser: { user: any; userAgent: string; ip: string }) {
    // 1. Tìm xem user đã tồn tại chưa
    let user = await this.authRepostory.findUniqueUserIncludeRole({
      email: googleUser.user.email,
    });

    const clientRoleId = await this.rolseService.getClientRoleId();

    // 2. Nếu CHƯA có user, tiến hành TẠO MỚI (Đăng ký tự động)
    if (!user) {
      user = await this.authRepostory.createUserOauth({
        email: googleUser.user.email,
        name: googleUser.user.name,
        avatar: googleUser.user.avatar ?? googleUser.user.picture,
        providerId: googleUser.user.providerId,
        roleId: clientRoleId,
        authProvider: AuthProvider.GOOGLE,
      });

      // Đảm bảo sau khi tạo, biến user có đầy đủ cấu trúc role để chạy tiếp bên dưới
      // (Hoặc bạn có thể fetch lại user kèm role nếu hàm tạo không trả về role name)
    }

    // 3. DÙ LÀ USER CŨ HAY USER MỚI TẠO, đều đi qua đây để tạo Token đăng nhập:
    const device = await this.authRepostory.createDevice({
      userId: user.id, // Chắc chắn lúc này user.id đã tồn tại và không bị null nữa!
      userAgent: googleUser.userAgent,
      ip: googleUser.ip,
    });

    const tokens = await this.generateToken({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId || clientRoleId,
      roleName: user.role?.name || 'Client',
    });

    return tokens;
  }
}
