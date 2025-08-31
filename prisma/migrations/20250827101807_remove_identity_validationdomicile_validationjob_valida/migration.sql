/*
  Warnings:

  - You are about to drop the column `domicile_validation` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `identity_validation` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `job_validation` on the `reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reports" DROP COLUMN "domicile_validation",
DROP COLUMN "identity_validation",
DROP COLUMN "job_validation";
