import 'dotenv/config';
import { roleName } from 'src/shared/constants/role.constant';
import { HashingService } from 'src/shared/services/hasing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();
const hashingService = new HashingService();
const main = async () => {
  const roleCount = await prisma.role.count();
  if (roleCount > 0) {
    throw new Error('roles already exist');
  }
  const roles = await prisma.role.createMany({
    data: [
      {
        name: roleName.Admin,
        description: 'Admin role',
      },
      {
        name: roleName.Client,
        description: 'Client role',
      },
      {
        name: roleName.Seller,
        description: 'Seller role',
      },
    ],
  });
  const adminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: roleName.Admin,
    },
  });
  const hashPass = await hashingService.hash('tankien123');
  const adminUser = await prisma.user.create({
    data: {
      email: 'dp1.1a2kien@gmail.com',
      name: 'Tấn Kiên',
      password: hashPass,
      phoneNumber: '0339499276',
      roleId: adminRole.id,
    },
  });
  return {
    createdRoleCount: roles.count,
    adminUser,
  };
};
main()
  .then(({ adminUser, createdRoleCount }) => {
    console.log(`created ${createdRoleCount} roles`);
    console.log(`Created admin user ${adminUser.email}`);
  })
  .catch(console.error)
  .finally(() => prisma.$disconnect());
