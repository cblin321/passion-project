/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FileUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "FileUsers" DROP CONSTRAINT "FileUsers_fileId_fkey";

-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "File_id_seq";

-- AlterTable
ALTER TABLE "FileUsers" DROP CONSTRAINT "FileUsers_pkey",
ALTER COLUMN "fileId" SET DATA TYPE TEXT,
ADD CONSTRAINT "FileUsers_pkey" PRIMARY KEY ("userId", "fileId");

-- AddForeignKey
ALTER TABLE "FileUsers" ADD CONSTRAINT "FileUsers_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
