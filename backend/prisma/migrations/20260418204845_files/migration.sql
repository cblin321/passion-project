/*
  Warnings:

  - You are about to drop the column `ownerID` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `viewerIDs` on the `File` table. All the data in the column will be lost.
  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_ownerID_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "ownerID",
DROP COLUMN "viewerIDs",
ADD COLUMN     "name" TEXT NOT NULL;
