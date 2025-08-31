/*
  Warnings:

  - The values [DRAFT] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('GOOD', 'NO_GOOD');
ALTER TABLE "reports" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- CreateTable
CREATE TABLE "review_customers" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "review_identity" BOOLEAN NOT NULL,
    "review_domicile" BOOLEAN NOT NULL,
    "review_work" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "review_customers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "review_customers" ADD CONSTRAINT "review_customers_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
