/*
  Warnings:

  - You are about to drop the column `debetor_id` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `process` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the `business` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `debetors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_created_by_fkey";

-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_debetor_id_fkey";

-- DropForeignKey
ALTER TABLE "debetors" DROP CONSTRAINT "debetors_business_id_fkey";

-- DropForeignKey
ALTER TABLE "debetors" DROP CONSTRAINT "debetors_employment_id_fkey";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "debetor_id",
DROP COLUMN "process",
DROP COLUMN "status",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "business_id" TEXT,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "employee_id" TEXT,
ADD COLUMN     "ktp_number" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "non_employee_id" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "rt_rw" TEXT,
ADD COLUMN     "village" TEXT,
ALTER COLUMN "created_by" DROP NOT NULL;

-- DropTable
DROP TABLE "business";

-- DropTable
DROP TABLE "debetors";

-- DropTable
DROP TABLE "employments";

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "company_name" TEXT,
    "company_address" TEXT,
    "company_phone" TEXT,
    "position" TEXT,
    "work" TEXT,
    "salary" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "non_employees" (
    "id" TEXT NOT NULL,
    "salary_frequency" TEXT,
    "work" TEXT,
    "salary" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "non_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "business_type" TEXT,
    "employee_count" TEXT,
    "revenue" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "process" "Process" NOT NULL,
    "customer_id" TEXT,
    "lo_id" TEXT,
    "slo_id" TEXT,
    "am_id" TEXT,
    "identity_validation" BOOLEAN NOT NULL,
    "domicile_validation" BOOLEAN NOT NULL,
    "job_validation" BOOLEAN NOT NULL,
    "customer_snapshot" JSONB NOT NULL,
    "employee_snapshot" JSONB,
    "non_employee_snapshot" JSONB,
    "business_snapshot" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_photos" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "report_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_photos_report_id_sort_order_idx" ON "report_photos"("report_id", "sort_order");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_non_employee_id_fkey" FOREIGN KEY ("non_employee_id") REFERENCES "non_employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_lo_id_fkey" FOREIGN KEY ("lo_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_slo_id_fkey" FOREIGN KEY ("slo_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_am_id_fkey" FOREIGN KEY ("am_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_photos" ADD CONSTRAINT "report_photos_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
