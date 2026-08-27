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
import { RoleService } from './role.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateRoleBodyDTO,
  GetRoleDetailResDTO,
  GetRoleParamsDTO,
  GetRoleQueryDTO,
  GetRoleResDTO,
  UpdateRoleBodyDTO,
} from './role.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ZodSerializerDto(GetRoleResDTO)
  list(@Query() query: GetRoleQueryDTO) {
    return this.roleService.list({
      page: query.page,
      limit: query.limit,
    });
  }
  @Get(':roleId')
  @ZodSerializerDto(GetRoleDetailResDTO)
  findById(@Param() params: GetRoleParamsDTO) {
    return this.roleService.findById(params.roleId);
  }

  @Post()
  @ZodSerializerDto(GetRoleDetailResDTO)
  create(
    @Body() body: CreateRoleBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.create({ data: body, createdById: userId });
  }

  @Put(':roleId')
  @ZodSerializerDto(GetRoleDetailResDTO)
  update(
    @Body() body: UpdateRoleBodyDTO,
    @Param() params: GetRoleParamsDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.roleService.update({
      data: body,
      id: params.roleId,
      updatedById: userId,
    });
  }

  @Delete(':roleId')
  @ZodSerializerDto(GetRoleDetailResDTO)
  delete(@Param() params: GetRoleParamsDTO) {
    return this.roleService.delete(params.roleId);
  }
}
