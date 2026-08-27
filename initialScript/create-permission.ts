// Source - https://stackoverflow.com/a/63333671
// Posted by oviniciusfeitosa, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-11, License - CC BY-SA 4.0

import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { HTTPMethod, roleName } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';
const prisma = new PrismaService();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;
  const permissionInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });

  const availableRoutes: {
    path: string;
    method: keyof typeof HTTPMethod;
    name: string;
    module:string
  }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const path = layer.route.path;

        const method = String(
          layer.route.stack[0].method,
        ).toUpperCase() as keyof typeof HTTPMethod;
        const moduleName = path.split('/')[1];
        return {
          path,
          method,
          name: `${method}-${path}`,
          module: moduleName,
        };
      }
    })
    .filter((item) => item !== undefined);

  const permissionInDBMap = permissionInDb.reduce<
    Record<string, (typeof permissionInDb)[number]>
  >((acc, item) => {
    acc[`${item.method}-${item.path}`] = item;
    return acc;
  }, {});

  const availableRoutesMap = availableRoutes.reduce<
    Record<string, (typeof availableRoutes)[number]>
  >((acc, item) => {
    acc[`${item.method}-${item.path}`] = item;
    return acc;
  }, {});

  // Permission trong DB nhưng route không còn tồn tại
  const permissionToDelete = permissionInDb.filter((item) => {
    return !availableRoutesMap[`${item.method}-${item.path}`];
  });

  if (permissionToDelete.length > 0) {
    const deleteResult = await prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionToDelete.map((item) => item.id),
        },
      },
    });

    console.log('Deleted permission:', deleteResult.count);
  } else {
    console.log('No permission to delete');
  }

  // Route tồn tại nhưng chưa có permission
  const routesToAdd = availableRoutes.filter((item) => {
    return !permissionInDBMap[`${item.method}-${item.path}`];
  });

  if (routesToAdd.length > 0) {
    const permissionToAdd = await prisma.permission.createMany({
      data: routesToAdd,
      skipDuplicates: true,
    });

    console.log('Added permission:', permissionToAdd.count);
  } else {
    console.log('No permission to add');
  }

  //lấy lại permissionId sau khi thêm mới hoặc xóa
  const updatedPermissionInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });
  //cập nhật lại permission trong adminRole
  const adminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: roleName.Admin,
      deletedAt: null,
    },
  });
  await prisma.role.update({
    where: {
      id: adminRole.id,
    },
    data: {
      permissions: {
        set: updatedPermissionInDb.map((item) => ({ id: item.id })),
      },
    },
  });
  process.exit(0);
}
bootstrap();
