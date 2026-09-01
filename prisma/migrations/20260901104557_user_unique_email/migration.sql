-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_totpSecret_key";


CREATE UNIQUE INDEX "User_email_unique" ON "User"("email") 
where "deletedAt" IS NULL;