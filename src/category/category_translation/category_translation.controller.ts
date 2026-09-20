import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryTranslationService } from './category_transslation.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';
import {
  CreateCategoryTranslationBodyDTO,
  GetCategoryTranslationDetailResDTO,
  GetCategoryTranslationParamsDTO,
  UpdateCategoryTranslationBodyDTO,
} from './category_translation.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('category-translation')
export class CategoryTranslationController {
  constructor(
    private readonly categoryTranslationService: CategoryTranslationService,
  ) {}
  @Get(':categoryTranslationId')
  async findById(@Param('categoryTranslationId') id: number) {
    return this.categoryTranslationService.findById(id);
  }

  @Post()
  @ZodSerializerDto(GetCategoryTranslationDetailResDTO)
  async create(
    @Body() body: CreateCategoryTranslationBodyDTO,
    @ActiveUser() userId: number,
  ) {
    return this.categoryTranslationService.create({
      data: body,
      createdById: userId,
    });
  }

  @Put(':categoryTranslationId')
  @ZodSerializerDto(GetCategoryTranslationDetailResDTO)
  async update(
    @Param('brandTranslationId') id: number,
    @Body() body: UpdateCategoryTranslationBodyDTO,
    @ActiveUser() userId: number,
  ) {
    return this.categoryTranslationService.update({
      id,
      data: body,
      updatedById: userId,
    });
  }

  @Delete(':categoryTranslationId')
  @ZodSerializerDto(MessageResDTO)
  async delete(
    @Param('brandTranslationId') params: GetCategoryTranslationParamsDTO,
    @ActiveUser() userId: number,
  ) {
    return this.categoryTranslationService.delete({
      id: params.categoryTranslationId,
    });
  }
}
