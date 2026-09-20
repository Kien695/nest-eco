import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { isPublic } from 'src/shared/decorators/auth.decorators';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  GetProductDetailResDTO,
  GetProductParamsDTO,
  GetProductQueryDTO,
  GetProductResDTO,
} from './product.dto';

@Controller('product')
@isPublic()
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  @ZodSerializerDto(GetProductResDTO)
  list(@Query() query: GetProductQueryDTO) {
    return this.productService.list({ query: query });
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDTO)
  findById(@Param() params: GetProductParamsDTO) {
    return this.productService.getDetail({ productId: params.productId });
  }
}
