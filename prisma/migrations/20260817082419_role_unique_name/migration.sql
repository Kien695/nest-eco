-- DropIndex
DROP INDEX "Role_name_key";

-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "description" SET DEFAULT '';
