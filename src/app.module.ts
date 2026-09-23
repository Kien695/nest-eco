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
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { BrandModule } from './brand/brand.module';
import { BrandTranslationModule } from './brand/brand_translation/brand_translation.module';
import { CategoryModule } from './category/category.module';
import { CategoryTranslationModule } from './category/category_translation/category_translation.module';
import { ProductTranslationModule } from './product/product_translation/product_translation.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    LanguagesModule,
    PermissionsModule,
    RoleModule,
    ProfileModule,
    UserModule,
    MediaModule,
    BrandModule,
    BrandTranslationModule,
    CategoryModule,
    CategoryTranslationModule,
    ProductModule,
    ProductTranslationModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController, RoleController],
  providers: [
    AppService,
    { provide: 'APP_PIPE', useClass: ZodValidationPipe },
    { provide: 'APP_INTERCEPTOR', useClass: ZodSerializerInterceptor },
  ],
})
export class AppModule {}
