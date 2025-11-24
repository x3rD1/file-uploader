-- DropForeignKey
ALTER TABLE "folder_shares" DROP CONSTRAINT "folder_shares_folderId_fkey";

-- AddForeignKey
ALTER TABLE "folder_shares" ADD CONSTRAINT "folder_shares_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
