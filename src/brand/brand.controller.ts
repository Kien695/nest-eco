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
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';
import { isPublic } from 'src/shared/decorators/auth.decorators';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { BrandService } from './brand.service';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import {
  CreateBrandBodyDTO,
  GetBrandDetailResDTO,
  GetBrandParamsDTO,
  GetBrandResDTO,
  UpdateBrandBodyDTO,
} from './brand.dto';
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @Get()
  @isPublic()
  @ZodSerializerDto(GetBrandResDTO)
  async list(@Query() query: PaginationQueryDTO) {
    return this.brandService.list(query);
  }

  @Get(':brandId')
  @isPublic()
  @ZodSerializerDto(GetBrandDetailResDTO)
  async findById(@Param() params: GetBrandParamsDTO) {
    return this.brandService.findById(params.brandId);
  }

  @Post()
  @ZodSerializerDto(GetBrandDetailResDTO)
  async create(@Body() body: CreateBrandBodyDTO, @ActiveUser() userId: number) {
    return this.brandService.create(body, userId);
  }

  @Put(':brandId')
  @ZodSerializerDto(GetBrandDetailResDTO)
  async update(
    @Param() params: GetBrandParamsDTO,
    @Body() body: UpdateBrandBodyDTO,
    @ActiveUser() userId: number,
  ) {
    return this.brandService.update(params.brandId, body, userId);
  }

  @Delete(':brandId')
  @ZodSerializerDto(MessageResDTO)
  async delete(
    @Param() params: GetBrandParamsDTO,
    @Query('isHard') isHard?: Boolean,
  ) {
    return this.brandService.delete(params.brandId, isHard);
  }
}
