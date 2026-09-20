import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandRepo } from './brand.repo';
import { BrandController } from './brand.controller';

@Module({
  providers: [BrandService, BrandRepo],
  controllers: [BrandController],
})
export class BrandModule {}
