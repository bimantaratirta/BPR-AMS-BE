/*
  Warnings:

  - You are about to drop the column `business_photo` on the `business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "business" DROP COLUMN "business_photo",
ALTER COLUMN "business_type" DROP NOT NULL,
ALTER COLUMN "revenue" DROP NOT NULL;

-- AlterTable
ALTER TABLE "debetors" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "no_ktp" DROP NOT NULL,
ALTER COLUMN "date_of_birth" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "no_hp" DROP NOT NULL;

-- AlterTable
ALTER TABLE "employments" ALTER COLUMN "company_name" DROP NOT NULL,
ALTER COLUMN "job_title" DROP NOT NULL,
ALTER COLUMN "salary_frequency" DROP NOT NULL,
ALTER COLUMN "salary" DROP NOT NULL;
