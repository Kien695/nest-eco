import { Module } from '@nestjs/common';
import { CategoryTranslationController } from './category_translation.controller';
import { CategoryTranslationService } from './category_transslation.service';
import { CategoryTranslationRepository } from './category_translation.repo';

@Module({
  controllers: [CategoryTranslationController],
  providers: [CategoryTranslationService, CategoryTranslationRepository],
})
export class CategoryTranslationModule {}
