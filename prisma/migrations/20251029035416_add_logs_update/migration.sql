/*
  Warnings:

  - Added the required column `status_review` to the `evaluations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_review` to the `review_customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_review` to the `review_evaluations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Status_Review" AS ENUM ('DRAFT', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."evaluations" ADD COLUMN     "status_review" "public"."Status_Review" NOT NULL,
ALTER COLUMN "character" DROP NOT NULL,
ALTER COLUMN "status_character" DROP NOT NULL,
ALTER COLUMN "capacity" DROP NOT NULL,
ALTER COLUMN "status_capacity" DROP NOT NULL,
ALTER COLUMN "condition" DROP NOT NULL,
ALTER COLUMN "status_condition" DROP NOT NULL,
ALTER COLUMN "capital" DROP NOT NULL,
ALTER COLUMN "status_capital" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."review_customers" ADD COLUMN     "status_review" "public"."Status_Review" NOT NULL,
ALTER COLUMN "review_identity" DROP NOT NULL,
ALTER COLUMN "review_domicile" DROP NOT NULL,
ALTER COLUMN "review_work" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."review_evaluations" ADD COLUMN     "status_review" "public"."Status_Review" NOT NULL,
ALTER COLUMN "review_character" DROP NOT NULL,
ALTER COLUMN "review_capacity" DROP NOT NULL,
ALTER COLUMN "review_condition" DROP NOT NULL,
ALTER COLUMN "review_capital" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."review_customer_update_logs" (
    "id" TEXT NOT NULL,
    "review_customer_id" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changes" TEXT NOT NULL,

    CONSTRAINT "review_customer_update_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evaluation_update_logs" (
    "id" TEXT NOT NULL,
    "evaluation_id" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changes" TEXT NOT NULL,

    CONSTRAINT "evaluation_update_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."review_evaluation_update_logs" (
    "id" TEXT NOT NULL,
    "review_evaluation_id" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changes" TEXT NOT NULL,

    CONSTRAINT "review_evaluation_update_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."review_customer_update_logs" ADD CONSTRAINT "review_customer_update_logs_review_customer_id_fkey" FOREIGN KEY ("review_customer_id") REFERENCES "public"."review_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evaluation_update_logs" ADD CONSTRAINT "evaluation_update_logs_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review_evaluation_update_logs" ADD CONSTRAINT "review_evaluation_update_logs_review_evaluation_id_fkey" FOREIGN KEY ("review_evaluation_id") REFERENCES "public"."review_evaluations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
