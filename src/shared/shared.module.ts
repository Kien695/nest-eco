import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hasing.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { APIGuard } from './guards/api_key.guards';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/auth.guard';
import { SharedUserRepostory } from './repositories/shared-user.repo';
import { EmailService } from './services/email.services';

const sharedServices = [
  PrismaService,
  HashingService,
  TokenService,
  SharedUserRepostory,
  EmailService,
];
@Global()
@Module({
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    APIGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
