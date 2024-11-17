/*
  Warnings:

  - A unique constraint covering the columns `[host]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `Connection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DB_TYPE" AS ENUM ('PGSQL', 'MONGO', 'MYSQL');

-- AlterTable
ALTER TABLE "Connection" DROP COLUMN "type",
ADD COLUMN     "type" "DB_TYPE" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Connection_host_key" ON "Connection"("host");
