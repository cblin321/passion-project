/*
  Warnings:

  - Added the required column `viewerIDs` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "viewerIDs" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FileUsers" (
    "userId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "FileUsers_pkey" PRIMARY KEY ("userId","fileId")
);

-- AddForeignKey
ALTER TABLE "FileUsers" ADD CONSTRAINT "FileUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileUsers" ADD CONSTRAINT "FileUsers_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
