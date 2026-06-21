import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';

import { AuthModule } from './auth/auth.module';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'APP_PIPE', useClass: ZodValidationPipe },
    { provide: 'APP_INTERCEPTOR', useClass: ZodSerializerInterceptor },
  ],
})
export class AppModule {}
