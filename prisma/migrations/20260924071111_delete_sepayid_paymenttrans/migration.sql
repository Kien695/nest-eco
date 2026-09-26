/*
  Warnings:

  - You are about to drop the column `sepay_id` on the `PaymentTransaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PaymentTransaction_sepay_id_key";

-- AlterTable
ALTER TABLE "PaymentTransaction" DROP COLUMN "sepay_id";
