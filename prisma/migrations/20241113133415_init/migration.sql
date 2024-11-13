-- CreateEnum
CREATE TYPE "CYCLE" AS ENUM ('FIVE_HOURS', 'TWELVE_HOURS', 'DAY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "dbuser" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "database" TEXT NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Backup" (
    "id" SERIAL NOT NULL,
    "summary" TEXT NOT NULL,
    "repeatsEvery" "CYCLE" NOT NULL,
    "successful" BOOLEAN NOT NULL,
    "startedOn" TIMESTAMP(3) NOT NULL,
    "completedOn" TIMESTAMP(3) NOT NULL,
    "connectionId" INTEGER NOT NULL,

    CONSTRAINT "Backup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Backup" ADD CONSTRAINT "Backup_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
