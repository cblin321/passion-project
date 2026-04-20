-- CreateEnum
CREATE TYPE "AccessSpecifier" AS ENUM ('PUBLIC', 'SHARED');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "access" "AccessSpecifier" NOT NULL DEFAULT 'SHARED';
