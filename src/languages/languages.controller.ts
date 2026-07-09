import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  createLanguageBodyDto,
  getLanguageDetailDto,
  getLanguageParamsDto,
  getLanguageResDto,
  updateLanguageBodyDto,
} from './languages.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorators';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}
  @Get()
  @ZodSerializerDto(getLanguageResDto)
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':languageId')
  @ZodSerializerDto(getLanguageDetailDto)
  findById(@Param() params: getLanguageParamsDto) {
    return this.languagesService.findById(params.languageId);
  }

  @Post()
  @ZodSerializerDto(getLanguageDetailDto)
  create(
    @Body() body: createLanguageBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.languagesService.create({ data: body, createdById: userId });
  }

  @Patch(':languageId')
  @ZodSerializerDto(getLanguageDetailDto)
  update(
    @Body() body: updateLanguageBodyDto,
    @Param() param: getLanguageParamsDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.languagesService.update({
      data: body,
      id: param.languageId,
      updatedById: userId,
    });
  }

  @Delete(':languageId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() param: getLanguageParamsDto) {
    return this.languagesService.delete(param.languageId);
  }
}
