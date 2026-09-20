/*
  Warnings:

  - Added the required column `logo` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "logo" VARCHAR(1000) NOT NULL,
ADD COLUMN     "name" VARCHAR(500) NOT NULL;


CREATE UNIQUE INDEX "Category_translation_categoryId_languageId_unique"
on "CategoryTranslation" ("categoryId","languageId")
where "deletedAt" is NULL