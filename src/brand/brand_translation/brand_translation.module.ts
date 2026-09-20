import { Module } from '@nestjs/common';
import { BrandTranslationRepository } from './brand_translation.repo';
import { BrandTranslationService } from './brand_translation.service';
import { BrandTranslationController } from './brand_translation.controller';

@Module({
  controllers: [BrandTranslationController],
  providers: [BrandTranslationService, BrandTranslationRepository],
})
export class BrandTranslationModule {}
