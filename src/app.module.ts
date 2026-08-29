import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';

import { AuthModule } from './auth/auth.module';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { LanguagesModule } from './languages/languages.module';

import { PermissionsModule } from './permissions/permissions.module';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    LanguagesModule,
    PermissionsModule,
    RoleModule,
    ProfileModule,
  ],
  controllers: [AppController, RoleController],
  providers: [
    AppService,
    { provide: 'APP_PIPE', useClass: ZodValidationPipe },
    { provide: 'APP_INTERCEPTOR', useClass: ZodSerializerInterceptor },
  ],
})
export class AppModule {}
