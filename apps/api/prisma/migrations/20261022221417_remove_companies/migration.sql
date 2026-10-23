/*
  Warnings:

  - You are about to drop the column `company_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_company_id_fkey";

-- DropIndex
DROP INDEX "users_company_id_username_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "company_id";

-- DropTable
DROP TABLE "companies";

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
