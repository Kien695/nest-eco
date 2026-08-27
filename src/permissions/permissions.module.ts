import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionRepo } from './permisions.repo';
import { PermissionsController } from './permissions.controller';

@Module({
  providers: [PermissionsService, PermissionRepo],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
