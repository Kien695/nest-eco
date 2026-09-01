import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetUserParamsDTO,
  GetUserQueryDTO,
  GetUserResDTO,
  UpdateUserBodyDTO,
} from './user.dto';
import { GetUserQueryType } from './user.model';
import {
  GetUserProfileResDTO,
  UpdateProfileResDTO,
} from 'src/shared/dtos/share-user.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';
import { ActiveRolePermission } from 'src/shared/decorators/active-role_permission.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetUserResDTO)
  async list(@Query() query: GetUserQueryDTO) {
    const users = await this.userService.list({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
    return users;
  }

  @Get(':userId')
  @ZodSerializerDto(GetUserProfileResDTO)
  async findById(@Param() params: GetUserParamsDTO) {
    const user = await this.userService.findById(params.userId);
    return user;
  }

  @Post()
  @ZodSerializerDto(CreateUserResDTO)
  create(
    @Body() body: CreateUserBodyDTO,
    @ActiveUser() userId: number,
    @ActiveRolePermission('name') roleName: string,
  ) {
    return this.userService.create({
      data: body,
      createdById: userId,
      createdByRoleName: roleName,
    });
  }

  @Put(':userId')
  @ZodSerializerDto(UpdateProfileResDTO)
  async update(
    @Param() params: GetUserParamsDTO,
    @Body() body: UpdateUserBodyDTO,
    @ActiveUser() userId: number,
    @ActiveRolePermission('name') roleName: string,
  ) {
    const user = await this.userService.update({
      id: params.userId,
      userId: userId,
      data: body,
      updatedById: userId,
      updatedByRoleName: roleName,
    });
    return user;
  }

  @Delete(':userId')
  @ZodSerializerDto(MessageResDTO)
  async delete(
    @Param() params: GetUserParamsDTO,
    @ActiveUser() userId: number,
    @ActiveRolePermission('name') roleName: string,
  ) {
    await this.userService.delete({
      id: params.userId,
      userId: userId,
      deletedByRoleName: roleName,
    });
    return { message: 'User deleted successfully' };
  }
}
