import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRepo } from './category.repo';
import { CategoryController } from './category.controller';

@Module({
  providers: [CategoryService, CategoryRepo],
  controllers: [CategoryController],
})
export class CategoryModule {}
