/*
  Warnings:

  - The values [SEND_SLO,DECLINE_SLO,SEND_AM] on the enum `Process` will be removed. If these variants are still used in the database, this will fail.
  - The values [NO_GOOD] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Process_new" AS ENUM ('DECLINE_LO', 'REVIEW_SLO', 'DECLINE_REVIEW_SLO', 'EVALUATION_SLO', 'DECLINE_EVALUATION_SLO', 'REVIEW_AM', 'ACCEPTED_AM', 'DECLINE_AM');
ALTER TABLE "public"."reports" ALTER COLUMN "process" TYPE "public"."Process_new" USING ("process"::text::"public"."Process_new");
ALTER TYPE "public"."Process" RENAME TO "Process_old";
ALTER TYPE "public"."Process_new" RENAME TO "Process";
DROP TYPE "public"."Process_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Status_new" AS ENUM ('GOOD', 'BAD');
ALTER TABLE "public"."reports" ALTER COLUMN "status" TYPE "public"."Status_new" USING ("status"::text::"public"."Status_new");
ALTER TABLE "public"."evaluations" ALTER COLUMN "status_character" TYPE "public"."Status_new" USING ("status_character"::text::"public"."Status_new");
ALTER TABLE "public"."evaluations" ALTER COLUMN "status_capacity" TYPE "public"."Status_new" USING ("status_capacity"::text::"public"."Status_new");
ALTER TABLE "public"."evaluations" ALTER COLUMN "status_condition" TYPE "public"."Status_new" USING ("status_condition"::text::"public"."Status_new");
ALTER TABLE "public"."evaluations" ALTER COLUMN "status_capital" TYPE "public"."Status_new" USING ("status_capital"::text::"public"."Status_new");
ALTER TYPE "public"."Status" RENAME TO "Status_old";
ALTER TYPE "public"."Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
COMMIT;
