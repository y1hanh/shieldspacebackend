/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `birthDate` DATETIME(3) NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;
