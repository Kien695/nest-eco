import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  DisableTwoFactorBodyDTO,
  forgotPasswordBodyDTO,
  loginBodyDTO,
  loginResDTO,
  logoutBodyDTO,
  refreshTokenBodyDTO,
  refreshTokenResDTO,
  registerBodyDTO,
  registerResDTO,
  sendOTPBodyDTO,
  TwoFactorSetupResDTO,
} from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorators/user-agent.decorators';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { isPublic } from 'src/shared/decorators/auth.decorators';
import { GoogleOAuthGuard } from 'src/shared/guards/google-oauth.guard';
import { EmptyBodyDTO } from 'src/shared/dtos/request.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @isPublic()
  @ZodSerializerDto(registerResDTO)
  async register(@Body() body: registerBodyDTO) {
    return await this.authService.register(body);
  }

  @Post('otp')
  @isPublic()
  @ZodSerializerDto(MessageResDTO)
  async sendOtp(@Body() body: sendOTPBodyDTO) {
    return await this.authService.sendOTP(body);
  }

  @Post('login')
  @isPublic()
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
  @isPublic()
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

  //login gg
  @Get('google')
  @isPublic()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google/callback')
  @isPublic()
  // @ZodSerializerDto(loginResDTO)
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(
    @Request() req,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ) {
    return this.authService.googleLogin({ user: req.user, userAgent, ip });
  }

  @Post('forgot-password')
  @isPublic()
  @ZodSerializerDto(MessageResDTO)
  forgotPassword(@Body() body: forgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body);
  }

  @Post('2fa/setup')
  @ZodSerializerDto(TwoFactorSetupResDTO)
  setupTwoFactorAuth(
    @Body() _: EmptyBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.authService.setupTwoFactorAuth(userId);
  }

  @Post('2fa/disable')
  @ZodSerializerDto(MessageResDTO)
  disableTwoFactorAuth(
    @Body() body: DisableTwoFactorBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.authService.disableTwoFactorAuth({ ...body, userId });
  }
}
