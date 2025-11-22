-- AlterTable
ALTER TABLE "files" ADD COLUMN     "signedUrl" TEXT;

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
