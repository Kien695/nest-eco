import { Injectable } from '@nestjs/common';
import { roleName } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class SharedRoleRepository {
  private clientRoleId: number | null = null;
  private adminRoleId: number | null = null;
  constructor(private readonly prismaService: PrismaService) {}
  private async GetRole(roleNmame: string) {
    const role = await this.prismaService.role.findFirstOrThrow({
      where: {
        name: roleName.Client,
      },
    });
    return role;
  }
  async getClientRoleId() {
    if (this.clientRoleId) {
      return this.clientRoleId;
    }
    const role = await this.GetRole(roleName.Client);
    this.clientRoleId = role.id;
    return role.id;
  }

  async getAdminRoleId() {
    if (this.adminRoleId) {
      return this.adminRoleId;
    }
    const role = await this.GetRole(roleName.Admin);
    this.adminRoleId = role.id;
    return role.id;
  }
}
