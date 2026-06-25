import { Body, Controller, Ip, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  loginBodyDTO,
  loginResDTO,
  logoutBodyDTO,
  refreshTokenBodyDTO,
  refreshTokenResDTO,
  registerBodyDTO,
  registerResDTO,
  sendOTPBodyDTO,
} from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorators/user-agent.decorators';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @ZodSerializerDto(registerResDTO)
  async register(@Body() body: registerBodyDTO) {
    return await this.authService.register(body);
  }

  @Post('otp')
  async sendOtp(@Body() body: sendOTPBodyDTO) {
    return await this.authService.sendOTP(body);
  }

  @Post('login')
  @ZodSerializerDto(loginResDTO)
  async login(
    @Body() body: loginBodyDTO,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ) {
    return await this.authService.login({
      ...body,
      userAgent,
      ip,
    });
  }

  @Post('refresh-token')
  @ZodSerializerDto(refreshTokenResDTO)
  refreshToken(
    @Body() body: refreshTokenBodyDTO,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ) {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
      userAgent,
      ip,
    });
  }
  @Post('logout')
  @ZodSerializerDto(MessageResDTO)
  logout(@Body() body: logoutBodyDTO) {
    return this.authService.logout(body.refreshToken);
  }
}
