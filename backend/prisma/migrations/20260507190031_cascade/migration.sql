-- DropForeignKey
ALTER TABLE "FileUsers" DROP CONSTRAINT "FileUsers_fileId_fkey";

-- AddForeignKey
ALTER TABLE "FileUsers" ADD CONSTRAINT "FileUsers_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
