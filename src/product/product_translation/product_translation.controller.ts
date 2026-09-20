import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import {
  CreateProductTranslationBodyDTO,
  GetProductTranslationDetailResDTO,
  GetProductTranslationParamsDTO,
  UpdateProductTranslationBodyDTO,
} from './product_translation.dto';
import { ProductTranslationService } from './product_translation.service';

@Controller('product-translation')
export class ProductTranslationController {
  constructor(
    private readonly productTranslationService: ProductTranslationService,
  ) {}

  @Get(':productTranslationId')
  @ZodSerializerDto(GetProductTranslationDetailResDTO)
  findById(@Param() params: GetProductTranslationParamsDTO) {
    return this.productTranslationService.findById(params.productTranslationId);
  }

  @Post()
  @ZodSerializerDto(GetProductTranslationDetailResDTO)
  create(
    @Body() body: CreateProductTranslationBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.productTranslationService.create({
      data: body,
      createdById: userId,
    });
  }

  @Put(':productTranslationId')
  @ZodSerializerDto(GetProductTranslationDetailResDTO)
  update(
    @Param() params: GetProductTranslationParamsDTO,
    @Body() body: UpdateProductTranslationBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.productTranslationService.update({
      id: params.productTranslationId,
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':productTranslationId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetProductTranslationParamsDTO) {
    return this.productTranslationService.delete(params.productTranslationId);
  }
}
