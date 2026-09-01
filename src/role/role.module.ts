import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleRepo } from './role.repo';
import { RoleController } from './role.controller';

@Module({
  providers: [RoleService, RoleRepo],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
