-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "character" TEXT NOT NULL,
    "status_character" "Status" NOT NULL,
    "capacity" TEXT NOT NULL,
    "status_capacity" "Status" NOT NULL,
    "condition" TEXT NOT NULL,
    "status_condition" "Status" NOT NULL,
    "capital" TEXT NOT NULL,
    "status_capital" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_evaluations" (
    "id" TEXT NOT NULL,
    "evaluation_id" TEXT NOT NULL,
    "review_character" BOOLEAN NOT NULL,
    "review_capacity" BOOLEAN NOT NULL,
    "review_condition" BOOLEAN NOT NULL,
    "review_capital" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "review_evaluations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_evaluations" ADD CONSTRAINT "review_evaluations_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "evaluations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
