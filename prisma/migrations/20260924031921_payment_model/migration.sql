/*
  Warnings:

  - The primary key for the `PaymentTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accountNumber` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `referenceNumber` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `subAccount` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionContent` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionDate` on the `PaymentTransaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sepay_id]` on the table `PaymentTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sepay_id` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_date` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_pkey",
DROP COLUMN "accountNumber",
DROP COLUMN "referenceNumber",
DROP COLUMN "subAccount",
DROP COLUMN "transactionContent",
DROP COLUMN "transactionDate",
ADD COLUMN     "account_number" VARCHAR(100),
ADD COLUMN     "content" TEXT,
ADD COLUMN     "reference_code" VARCHAR(255),
ADD COLUMN     "sepay_id" INT NOT NULL,
ADD COLUMN     "sub_account" VARCHAR(250),
ADD COLUMN     "transaction_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE INT,
ALTER COLUMN "amountIn" SET DATA TYPE INT,
ALTER COLUMN "amountOut" SET DATA TYPE INT,
ALTER COLUMN "accumulated" SET DATA TYPE INT,
DROP COLUMN "body",
ADD COLUMN     "body" JSONB NOT NULL,
ADD CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "status" "PaymentStatus"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_sepay_id_key" ON "PaymentTransaction"("sepay_id");

-- CreateIndex
CREATE INDEX "PaymentTransaction_code_idx" ON "PaymentTransaction"("code");

-- CreateIndex
CREATE INDEX "PaymentTransaction_account_number_transaction_date_idx" ON "PaymentTransaction"("account_number", "transaction_date");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
