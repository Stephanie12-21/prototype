/*
  Warnings:

  - You are about to drop the column `phone` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_phone_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "phone";
