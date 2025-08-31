/*
  Warnings:

  - The `employee_count` column on the `businesses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "employee_count",
ADD COLUMN     "employee_count" INTEGER;
