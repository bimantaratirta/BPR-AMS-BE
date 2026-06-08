// prisma.service.js
//
// Single shared PrismaClient for the entire app.
//
// Sebelumnya tiap domain service memanggil `new PrismaService()` di
// constructor-nya (14 tempat), dan karena class ini `extends PrismaClient`,
// SETIAP instance membuka connection pool-nya sendiri ke Postgres. Total
// koneksi = 14 * (cpu*2+1), yang menghabiskan connection slot Postgres di
// production ("remaining connection slots are reserved for ... SUPERUSER").
//
// Sekarang ada satu instance bersama. Trik constructor-return di bawah membuat
// `new PrismaService()` mengembalikan instance yang sama, jadi seluruh call
// site lama tetap bekerja tanpa perubahan, tapi hanya ada satu pool.
//
// Catatan: soft-delete middleware (prisma-soft-delete-middleware) sengaja TIDAK
// diaktifkan — schema saat ini belum punya kolom `deleted_at`, jadi
// mengaktifkannya akan membuat setiap query gagal. Aktifkan kembali setelah
// menambahkan kolom soft-delete ke model terkait di schema.prisma.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PrismaService {
  constructor() {
    // Mengembalikan object dari constructor membuat ekspresi `new` bernilai
    // object tersebut — sehingga semua `new PrismaService()` berbagi satu pool.
    return prisma;
  }
}

export default prisma;
