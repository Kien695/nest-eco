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

import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateProductBodyDTO,
  GetManagerProductQueryDTO,
  GetProductDetailResDTO,
  GetProductParamsDTO,
  GetProductResDTO,
  ProductDTO,
} from './product.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import type { AccessTokenPayload } from 'src/shared/types/jwt.type';
import { ManageProductService } from './manage-product.service';

@Controller('manage-product/product')
export class ManageProductController {
  constructor(private readonly manageProductService: ManageProductService) {}
  @Get()
  @ZodSerializerDto(GetProductResDTO)
  list(
    @Query() query: GetManagerProductQueryDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.manageProductService.list({
      query,
      roleNameRequest: user.roleName,
      userIdRequest: user.userId,
    });
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDTO)
  findById(
    @Param() params: GetProductParamsDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.manageProductService.getDetail({
      productId: params.productId,
      roleNameRequest: user.roleName,
      userIdRequest: user.userId,
    });
  }

  @Post()
  @ZodSerializerDto(GetProductDetailResDTO)
  create(
    @Body() body: CreateProductBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.manageProductService.create({
      data: body,
      createdById: userId,
    });
  }

  @Put(':productId')
  @ZodSerializerDto(ProductDTO)
  update(
    @Body() body: CreateProductBodyDTO,
    @Param() params: GetProductParamsDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.manageProductService.update({
      data: body,
      productId: params.productId,
      updatedById: user.userId,
      roleNameRequest: user.roleName,
    });
  }

  @Delete(':productId')
  @ZodSerializerDto(MessageResDTO)
  delete(
    @Param() params: GetProductParamsDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.manageProductService.delete({
      productId: params.productId,
      deletedById: user.userId,
      roleNameRequest: user.roleName,
    });
  }
}
