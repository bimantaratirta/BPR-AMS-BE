/*
  Warnings:

  - The `checkInTime` column on the `point_records` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."point_records" DROP COLUMN "checkInTime",
ADD COLUMN     "checkInTime" TIMESTAMP(3);
