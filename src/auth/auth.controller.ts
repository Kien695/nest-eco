import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerBodyDTO, registerResDTO, sendOTPBodyDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';

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
}
