-- CreateTable
CREATE TABLE "public"."customer_update_logs" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changes" TEXT NOT NULL,

    CONSTRAINT "customer_update_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."customer_update_logs" ADD CONSTRAINT "customer_update_logs_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
