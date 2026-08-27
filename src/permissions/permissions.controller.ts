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

import { PermissionsService } from './permissions.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreatePermissionBodyDTO,
  GetPermissionDetailResDTO,
  GetPermissionParamsDTO,
  GetPermissionQueryDTO,
  GetPermissionResDTO,
  UpdatePermissionBodyDTO,
} from './permissions.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}
  @Get()
  @ZodSerializerDto(GetPermissionResDTO)
  list(@Query() query: GetPermissionQueryDTO) {
    return this.permissionService.list({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDTO)
  findById(@Param() params: GetPermissionParamsDTO) {
    return this.permissionService.findById(params.permissionId);
  }

  @Post()
  @ZodSerializerDto(GetPermissionDetailResDTO)
  create(
    @Body() body: CreatePermissionBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.create({ data: body, createdById: userId });
  }

  @Put(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDTO)
  update(
    @Body() body: UpdatePermissionBodyDTO,
    @Param() params: GetPermissionParamsDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.update({
      data: body,
      id: params.permissionId,
      updatedById: userId,
    });
  }

  @Delete()
  @ZodSerializerDto(GetPermissionDetailResDTO)
  delete(@Param() params: GetPermissionParamsDTO) {
    return this.permissionService.delete(params.permissionId);
  }
}
