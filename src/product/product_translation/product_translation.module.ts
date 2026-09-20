import { Module } from '@nestjs/common';
import { ProductTranslationRepo } from './product_translation.repo';
import { ProductTranslationService } from './product_translation.service';
import { ProductTranslationController } from './product_translation.controller';

@Module({
  providers: [ProductTranslationRepo, ProductTranslationService],
  controllers: [ProductTranslationController],
})
export class ProductTranslationModule {}
