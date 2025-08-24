-- CreateEnum
CREATE TYPE "Status" AS ENUM ('GOOD', 'NO_GOOD');

-- CreateEnum
CREATE TYPE "Process" AS ENUM ('SEND_SLO', 'REVIEW_SLO', 'DECLINE_SLO', 'SEND_AM', 'REVIEW_AM', 'ACCEPTED_AM', 'DECLINE_AM');

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "debetor_id" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "process" "Process" NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debetors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "no_ktp" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "no_hp" TEXT NOT NULL,
    "employment_id" TEXT,
    "business_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "debetors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employments" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "salary_frequency" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "employments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business" (
    "id" TEXT NOT NULL,
    "business_type" TEXT NOT NULL,
    "revenue" INTEGER NOT NULL,
    "business_photo" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "debetors_no_ktp_key" ON "debetors"("no_ktp");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_debetor_id_fkey" FOREIGN KEY ("debetor_id") REFERENCES "debetors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debetors" ADD CONSTRAINT "debetors_employment_id_fkey" FOREIGN KEY ("employment_id") REFERENCES "employments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debetors" ADD CONSTRAINT "debetors_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
