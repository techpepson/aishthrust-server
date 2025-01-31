-- AlterTable
ALTER TABLE "User" ALTER COLUMN "referralCode" DROP NOT NULL,
ALTER COLUMN "referralCount" DROP NOT NULL,
ALTER COLUMN "referralEarnings" DROP NOT NULL;
