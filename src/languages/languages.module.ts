import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesRepo } from './languages.repo';
import { LanguagesController } from './languages.controller';

@Module({
  providers: [LanguagesService, LanguagesRepo],
  controllers: [LanguagesController],
})
export class LanguagesModule {}
