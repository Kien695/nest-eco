import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BrandTranslationService } from './brand_translation.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import {
  CreateBrandTranslationBodyDTO,
  GetBrandTranslationDetailResDTO,
  GetBrandTranslationParamsDTO,
  UpdateBrandTranslationBodyDTO,
} from './brand_translation.dto';

@Controller('brand-translation')
export class BrandTranslationController {
  constructor(
    private readonly brandTranslationService: BrandTranslationService,
  ) {}
  @Get(':brandTranslationId')
  async findById(@Param('brandTranslationId') id: number) {
    return this.brandTranslationService.findById(id);
  }

  @Post()
  @ZodSerializerDto(GetBrandTranslationDetailResDTO)
  async create(
    @Body() body: CreateBrandTranslationBodyDTO,
    @ActiveUser() userId: number,
  ) {
    return this.brandTranslationService.create({
      data: body,
      createdById: userId,
    });
  }

  @Put(':brandTranslationId')
  @ZodSerializerDto(GetBrandTranslationDetailResDTO)
  async update(
    @Param('brandTranslationId') id: number,
    @Body() body: UpdateBrandTranslationBodyDTO,
    @ActiveUser() userId: number,
  ) {
    return this.brandTranslationService.update({
      id,
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':brandTranslationId')
  @ZodSerializerDto(MessageResDTO)
  async delete(
    @Param('brandTranslationId') params: GetBrandTranslationParamsDTO,
    @ActiveUser() userId: number,
  ) {
    return this.brandTranslationService.delete({
      id: params.brandTranslationId,
    });
  }
}
