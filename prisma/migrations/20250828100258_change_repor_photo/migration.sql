/*
  Warnings:

  - You are about to drop the column `caption` on the `report_photos` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `report_photos` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `report_photos` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `report_photos` table. All the data in the column will be lost.
  - You are about to drop the column `mime_type` on the `report_photos` table. All the data in the column will be lost.
  - You are about to drop the column `size_bytes` on the `report_photos` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `report_photos` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `report_photos` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "report_photos_report_id_sort_order_idx";

-- AlterTable
ALTER TABLE "report_photos" DROP COLUMN "caption",
DROP COLUMN "filename",
DROP COLUMN "height",
DROP COLUMN "key",
DROP COLUMN "mime_type",
DROP COLUMN "size_bytes",
DROP COLUMN "sort_order",
DROP COLUMN "width";
