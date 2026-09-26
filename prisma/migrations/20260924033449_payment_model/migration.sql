/*
  Warnings:

  - You are about to drop the column `account_number` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `reference_code` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `sub_account` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_date` on the `PaymentTransaction` table. All the data in the column will be lost.
  - Added the required column `transactionDate` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PaymentTransaction_account_number_transaction_date_idx";

-- AlterTable
ALTER TABLE "PaymentTransaction" DROP COLUMN "account_number",
DROP COLUMN "content",
DROP COLUMN "reference_code",
DROP COLUMN "sub_account",
DROP COLUMN "transaction_date",
ADD COLUMN     "accountNumber" VARCHAR(100),
ADD COLUMN     "referenceNumber" VARCHAR(255),
ADD COLUMN     "subAccount" VARCHAR(250),
ADD COLUMN     "transactionContent" TEXT,
ADD COLUMN     "transactionDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "PaymentTransaction_accountNumber_transactionDate_idx" ON "PaymentTransaction"("accountNumber", "transactionDate");
