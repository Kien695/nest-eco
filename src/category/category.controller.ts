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
import { CategoryService } from './category.service';
import { isPublic } from 'src/shared/decorators/auth.decorators';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateCategoryBodyDTO,
  GetAllCategoryQueryDTO,
  GetAllCategoryResDTO,
  GetCategoryDetailResDTO,
  GetCategoryParamsDTO,
  UpdateCategoryBodyDTO,
} from './category.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  @isPublic()
  @ZodSerializerDto(GetAllCategoryResDTO)
  async list(@Query() query: GetAllCategoryQueryDTO) {
    return this.categoryService.findAll(query.parentCategoryId);
  }

  @Get(':categoryId')
  @isPublic()
  @ZodSerializerDto(GetCategoryDetailResDTO)
  async findById(@Param() params: GetCategoryParamsDTO) {
    return this.categoryService.findById(params.categoryId);
  }

  @Post()
  @ZodSerializerDto(GetCategoryDetailResDTO)
  async create(
    @Body() body: CreateCategoryBodyDTO,
    @ActiveUser() userId: number,
  ) {
    return this.categoryService.create(body, userId);
  }

  @Put(':categoryId')
  @ZodSerializerDto(GetCategoryDetailResDTO)
  async update(
    @Param() params: GetCategoryParamsDTO,
    @Body() body: UpdateCategoryBodyDTO,
    @ActiveUser() userId: number,
  ) {
    return this.categoryService.update(params.categoryId, body, userId);
  }

  @Delete(':categoryId')
  @ZodSerializerDto(MessageResDTO)
  async delete(
    @Param() params: GetCategoryParamsDTO,
    @Query('isHard') isHard?: Boolean,
  ) {
    return this.categoryService.delete(params.categoryId, isHard);
  }
}
