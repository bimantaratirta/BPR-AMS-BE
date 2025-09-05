/*
  Warnings:

  - The values [ACCEPTED_AM] on the enum `Process` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[report_id]` on the table `evaluations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[report_id]` on the table `review_customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[evaluation_id]` on the table `review_evaluations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Process_new" AS ENUM ('DECLINE_LO', 'REVIEW_SLO', 'DECLINE_REVIEW_SLO', 'EVALUATION_SLO', 'DECLINE_EVALUATION_SLO', 'REVIEW_AM', 'APPROVE_AM', 'DECLINE_AM');
ALTER TABLE "public"."reports" ALTER COLUMN "process" TYPE "public"."Process_new" USING ("process"::text::"public"."Process_new");
ALTER TYPE "public"."Process" RENAME TO "Process_old";
ALTER TYPE "public"."Process_new" RENAME TO "Process";
DROP TYPE "public"."Process_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_report_id_key" ON "public"."evaluations"("report_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_customers_report_id_key" ON "public"."review_customers"("report_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_evaluations_evaluation_id_key" ON "public"."review_evaluations"("evaluation_id");
