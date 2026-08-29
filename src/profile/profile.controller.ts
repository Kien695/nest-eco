import { Body, Controller, Get, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  GetUserProfileResDTO,
  UpdateProfileResDTO,
} from 'src/shared/dtos/share-user.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';
import { ChangePasswordBodyDTO, UpdateBodyMeDTO } from './profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodSerializerDto(GetUserProfileResDTO)
  getProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.getProfile(userId);
  }

  @Put()
  @ZodSerializerDto(UpdateProfileResDTO)
  updateProfile(
    @Body() body: UpdateBodyMeDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.profileService.updateProfile({ userId, body });
  }

  @Put('change-password')
  @ZodSerializerDto(UpdateProfileResDTO)
  changePassword(
    @Body() body: ChangePasswordBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.profileService.changePassword({ userId, body });
  }
}
