// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

console.log(Object.keys(prisma));

async function main() {
  const user = await prisma.user.create({
    data: {
      username: "adminSuper",
      password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
      role: "PIC",
    },
  });

  // await prisma.kSSM.create({
  //   data: {
  //     nomor_surat: "007951.0/1",
  //     tanggal_surat_permohonan_kredit: new Date("2025-01-01"),
  //     tanggal_surat_persetujuan_kredit: new Date("2025-01-05"),
  //     nama: "MUHAMAD JAMALUDIN",
  //     jabatan: "AREA MANAGER",
  //     nama_debitur: "DEDE SUTRIS",
  //     nik_debitur: "3209061103910008",
  //     status_debitur: "Kawin",
  //     hubungan_debitur_penjamin: "Suami",
  //     alamat_usaha_debitur: "DUSUN 03 RT 01 RW 06 DESA KARANGMEKAR KAB CIREBON",
  //     alamat_rumah_debitur: "DUSUN 03 RT 01 RW 06 DESA KARANGMEKAR KAB CIREBON",
  //     tempat_lahir_debitur: "CIREBON",
  //     tanggal_lahir_debitur: new Date("1990-05-15"),
  //     pekerjaan_debitur: "BURUH HARIAN LEPAS",
  //     jenis_kelamin_debitur: "Laki-Laki",
  //     nama_penjamin: "ADE SURYANI",
  //     nik_penjamin: "6543210987654321",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tanggal_lahir_penjamin: new Date("1985-08-22"),
  //     hubungan_penjamin_debitur: "Istri",
  //     alamat_rumah_penjamin:
  //       "DUSUN 03 RT 01 RW 06 DESA KARANGMEKAR KAB CIREBON",
  //     nama_barang: "KENDARAAN BERMOTOR RODA DUA",
  //     no_bpkb: "M-00718385",
  //     harga_barang: 15000000,
  //     detail_jaminan:
  //       "BPKB NOMOR P-08011239 AN ADE SURYANI ALAMAT JAMINAN DESA KARANGMEKAR RT 01/06 KEC KARANGSEMBUNG KAB CIREBON. MEREK/TYPE HONDA C1M02N41L0 A/T TAHUN 2019 WARNA HITAM MERAH ISI SILINDER 110 CC NO RANGKA MH1JM611XKK044768 NO MESIN JM61F1044943 ",
  //     nominal_pinjaman: 10000000,
  //     bunga_pinjaman: 25.8,
  //     jangka_waktu: 12,
  //     tujuan_penggunaan: "TAMBAHAN MODAL",
  //     nominal_angsuran: 950000,
  //     tanggal_angsuran_pertama: new Date("2025-02-01"),
  //     tanggal_angsuran_terakhir: new Date("2026-01-01"),
  //     hutang_keseluruhan: 11400000,
  //     tenggat_angsuran: 30,
  //     provisi_persen: 1.0,
  //     provisi_nominal: 100000,
  //     administrasi_persen: 0.5,
  //     administrasi_nominal: 50000,
  //     materai_nominal: 10000,
  //     asuransi_jiwa_nominal: 30000,
  //     asuransi_tlo_nominal: 25000,
  //     notaris_nominal: 150000,
  //     total_biaya: 365000,
  //     submitted_at: new Date(),
  //     userID: user.id,
  //   },
  // });

  // await prisma.kSS.create({
  //   data: {
  //     nomor_surat: "004454.7/1",
  //     tanggal_surat_permohonan_kredit: new Date("2025-03-01"),
  //     tanggal_surat_persetujuan_kredit: new Date("2025-03-05"),
  //     nama: "SRI HANDAYANI",
  //     jabatan: "KEPALA CABANG",
  //     nama_debitur: "TATANG SUPRATMAN",
  //     nik_debitur: "3210010202800002",
  //     status_debitur: "Kawin",
  //     hubungan_debitur_penjamin: "Istri",
  //     alamat_usaha_debitur: "JL. RAYA KUNINGAN KM 3 NO 10",
  //     alamat_rumah_debitur: "PERUM GRIYA CIREBON INDAH BLOK B2 NO 6",
  //     pekerjaan_debitur: "Wirausaha",
  //     tempat_lahir_debitur: "CIREBON",
  //     tanggal_lahir_debitur: new Date("1980-02-02"),
  //     nama_penjamin: "RINA SUSANTI",
  //     nik_penjamin: "3210010202830001",
  //     alamat_rumah_penjamin: "PERUM GRIYA CIREBON INDAH BLOK B2 NO 6",
  //     tempat_lahir_penjamin: "CIREBON",
  //     hubungan_penjamin_debitur: "Istri",
  //     tanggal_lahir_penjamin: new Date("1983-02-02"),
  //     nama_shm: "TATANG SUPRATMAN",
  //     nik_shm: "3210010202800002",
  //     alamat_shm: "JL. KESAMBI DALAM NO 4",
  //     detail_jaminan: "SHM NO 1123 AN. TATANG SUPRATMAN, LUAS 150M2, CIREBON",
  //     nominal_pinjaman: 20000000,
  //     bunga_pinjaman: 18,
  //     jangka_waktu: 24,
  //     tujuan_penggunaan: "MODAL USAHA",
  //     nominal_angsuran: 950000,
  //     tanggal_angsuran_dimulai: new Date("2025-04-01"),
  //     tanggal_angsuran_terakhir: new Date("2027-03-01"),
  //     hutang_keseluruhan: 22800000,
  //     provisi_persen: 1,
  //     administrasi_persen: 0.5,
  //     provisi_nominal: 200000,
  //     administrasi_nominal: 100000,
  //     nama_asuransi: "ASURANSI BERSAMA",
  //     asuransi_nominal: 150000,
  //     materai_nominal: 10000,
  //     notaris_nominal: 250000,
  //     total_biaya: 710000,
  //     submitted_at: new Date(),
  //     userID: user.id,
  //   },
  // });

  // await prisma.pINEK.create({
  //   data: {
  //     nomor_surat: "001308.0/1",
  //     tanggal_surat_permohonan_kredit: new Date("2025-05-10"),
  //     tanggal_surat_persetujuan_kredit: new Date("2025-05-12"),
  //     nama_debitur: "SARI WULANDARI",
  //     nik_debitur: "3276016204930003",
  //     status_debitur: "Belum Kawin",
  //     tempat_lahir_debitur: "CIREBON",
  //     tanggal_lahir_debitur: new Date("1993-04-20"),
  //     alamat_rumah_debitur: "PERUM GUNUNG SARI BLOK C NO 5",
  //     pekerjaan_debitur: "KARYAWATI",
  //     nama_penjamin: "DEDI SUPRIADI",
  //     nik_penjamin: "3276016204800002",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tanggal_lahir_penjamin: new Date("1980-04-12"),
  //     hubungan_penjamin_debitur: "Kakak",
  //     alamat_rumah_penjamin: "PERUM GUNUNG SARI BLOK C NO 5",
  //     nama_barang: "IJAZAH S1 + BPJS KESEHATAN",
  //     detail_jaminan: "IJAZAH ORIGINAL + BPJS KESEHATAN AKTIF",
  //     nominal_pinjaman: 5000000,
  //     bunga_pinjaman: 20,
  //     jangka_waktu: 10,
  //     nominal_angsuran: 550000,
  //     tanggal_angsuran_pertama: new Date("2025-06-01"),
  //     tanggal_angsuran_terakhir: new Date("2026-03-01"),
  //     hutang_keseluruhan: 5500000,
  //     tenggat_angsuran: 1,
  //     rekening_pinjaman: "112001002999",
  //     tujuan_penggunaan: "PENDIDIKAN",
  //     provisi_persen: 1,
  //     provisi_nominal: 50000,
  //     nama_asuransi: "ASURANSI PENDIDIKAN",
  //     asuransi_jiwa_nominal: 25000,
  //     materai_nominal: 10000,
  //     total_biaya: 85000,
  //     submitted_at: new Date(),
  //     userID: user.id,
  //   },
  // });

  // await prisma.fLEKSI.create({
  //   data: {
  //     nomor_surat: "000689.0/1",
  //     tanggal_surat_persetujuan_kredit: new Date("2025-07-01"),
  //     nama_debitur: "NURUL AINI",
  //     status_debitur: "Kawin",
  //     jenis_kelamin_debitur: "Perempuan",
  //     tempat_lahir_debitur: "CIREBON",
  //     tanggal_lahir_debitur: new Date("1992-08-10"),
  //     alamat_rumah_debitur: "PERUM RANCAEKER BLOK D5 NO 8",
  //     nik_debitur: "3276016208920004",
  //     nama_penjamin: "AGUS SURYANA",
  //     nik_penjamin: "3276016208880003",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tanggal_lahir_penjamin: new Date("1988-09-18"),
  //     hubungan_penjamin_debitur: "Suami",
  //     alamat_rumah_penjamin: "PERUM RANCAEKER BLOK D5 NO 8",
  //     nominal_pinjaman: 6000000,
  //     bunga_pinjaman: 20.0,
  //     jangka_waktu: 10,
  //     tujuan_penggunaan: "PEMBELIAN PERABOT RUMAH",
  //     rekening_pinjaman: "112001002776",
  //     nominal_angsuran: 660000,
  //     tanggal_angsuran_pertama: new Date("2025-08-01"),
  //     tenggat_angsuran: "Senin",
  //     submitted_at: new Date(),
  //     userID: user.id,
  //     barang_elektronik: {
  //       createMany: {
  //         data: [
  //           {
  //             nama_barang: "TV LED",
  //             tipe: "SAMSUNG 43 INCH",
  //             harga: 3000000,
  //           },
  //         ],
  //       },
  //     },
  //     barang_furniture: {
  //       createMany: {
  //         data: [
  //           {
  //             nama_barang: "LEMARI BAJU",
  //             tipe: "3 PINTU MINIMALIS",
  //             harga: 2000000,
  //           },
  //         ],
  //       },
  //     },
  //     barang_jaminan_lainnya: {
  //       createMany: {
  //         data: [
  //           {
  //             nama_barang: "KARPET PERSIA",
  //           },
  //         ],
  //       },
  //     },
  //   },
  // });

  // await prisma.pROCIM.create({
  //   data: {
  //     nomor_surat: "000280.1/1",
  //     tanggal_surat_persetujuan_kredit: new Date("2025-01-15"),
  //     nama_debitur: "NUR KHOLIS",
  //     nik_debitur: "3210112301890007",
  //     status_debitur: "Kawin",
  //     tempat_lahir_debitur: "CIREBON",
  //     tanggal_lahir_debitur: new Date("1989-03-12"),
  //     alamat_rumah_debitur: "DESA KERTAWINANGUN KEC MANDIRANCAN KAB KUNINGAN",
  //     nama_penjamin: "MIRA WULANDARI",
  //     nik_penjamin: "3210112301900002",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tanggal_lahir_penjamin: new Date("1990-03-22"),
  //     alamat_rumah_penjamin: "DESA KERTAWINANGUN KEC MANDIRANCAN KAB KUNINGAN",
  //     nominal_pinjaman: 8000000,
  //     bunga_pinjaman: 18.5,
  //     jangka_waktu: 10,
  //     rekening_pinjaman: "112001002110",
  //     nominal_angsuran: 870000,
  //     tanggal_angsuran_pertama: new Date("2025-02-15"),
  //     tenggat_angsuran: "Senin",
  //     userID: user.id,
  //     submitted_at: new Date(),
  //     barang_elektronik: {
  //       createMany: {
  //         data: [
  //           {
  //             nama_barang: "KULKAS",
  //             tipe: "LG SMART 2PINTU",
  //             harga: 3000000,
  //           },
  //         ],
  //       },
  //     },
  //     barang_furniture: {
  //       createMany: {
  //         data: [
  //           {
  //             nama_barang: "SOFA",
  //             tipe: "L SHAPE MODERN",
  //             harga: 2500000,
  //           },
  //         ],
  //       },
  //     },
  //     barang_jaminan_lainnya: {
  //       createMany: {
  //         data: [
  //           {
  //             nama_barang: "SEPEDA LISTRIK",
  //           },
  //         ],
  //       },
  //     },
  //   },
  // });

  // await prisma.kSM.create({
  //   data: {
  //     nomor_surat: "001100.2/1",
  //     tanggal_surat_permohonan_kredit: new Date("2025-06-10"),
  //     tanggal_surat_persetujuan_kredit: new Date("2025-06-15"),
  //     nama_debitur: "ROFIUDIN",
  //     nik_debitur: "3210122301890001",
  //     status_debitur: "Kawin",
  //     tempat_lahir_debitur: "CIREBON",
  //     tanggal_lahir_debitur: new Date("1989-03-12"),
  //     alamat_rumah_debitur: "DESA SINDANGJAWA BLOK KARANGANYAR RT 01 RW 02",
  //     pekerjaan_debitur: "PEDAGANG",
  //     nama_penjamin: "SRI KURNIA",
  //     nik_penjamin: "3210122301930002",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tanggal_lahir_penjamin: new Date("1993-05-20"),
  //     hubungan_penjamin_debitur: "Istri",
  //     nominal_pinjaman: 10000000,
  //     bunga_pinjaman: 24.0,
  //     jangka_waktu: 12,
  //     nominal_angsuran: 950000,
  //     tanggal_angsuran_pertama: new Date("2025-07-10"),
  //     tanggal_angsuran_terakhir: new Date("2026-06-10"),
  //     hutang_keseluruhan: 11400000,
  //     tenggat_angsuran: 10,
  //     tujuan_penggunaan: "TAMBAHAN MODAL USAHA",
  //     provisi_persen: 1.0,
  //     provisi_nominal: 100000,
  //     administrasi_persen: 0.5,
  //     administrasi_nominal: 50000,
  //     administrasi_persen: 0.5,
  //     alamat_rumah_debitur: "DESA SINDANGJAWA BLOK KARANGANYAR RT 01 RW 02",
  //     alamat_usaha_debitur: "DESA SINDANGJAWA BLOK KARANGANYAR RT 01 RW 02",
  //     asuransi_nominal: 0,
  //     asuransi_tlo_nominal: 0,
  //     bunga_pinjaman: 24,
  //     detail_jaminan: "DESA SINDANGJAWA BLOK KARANGANYAR RT 01 RW 02",
  //     harga_barang: 0,
  //     hubungan_debitur_penjamin: "Suami",
  //     hubungan_penjamin_debitur: "Istri",
  //     hutang_keseluruhan: 11400000,
  //     jabatan: "Area Manager ",
  //     jangka_waktu: 12,
  //     jenis_kelamin_debitur: "Laki-laki",
  //     materai_nominal: 10000,
  //     nama: "Budiono Sudarmono",
  //     nama_barang: "Vario",
  //     nama_debitur: "ROFIUDIN",
  //     nama_penjamin: "SRI KURNIA",
  //     nik_debitur: "3210122301890001",
  //     nik_penjamin: "3210122301930002",
  //     no_bpkb: "N-20204567",
  //     nominal_angsuran: 950000,
  //     nominal_pinjaman: 10000000,
  //     nomor_surat: "001100.2/1",
  //     notaris_nominal: 0,
  //     pekerjaan_debitur: "PEDAGANG",
  //     provisi_nominal: 100000,
  //     provisi_persen: 1,
  //     status_debitur: "Kawin",
  //     submitted_at: new Date(),
  //     tanggal_angsuran_pertama: new Date("2025-05-01"),
  //     tanggal_angsuran_terakhir: new Date("2025-05-01"),
  //     tanggal_lahir_debitur: new Date(),
  //     tanggal_lahir_penjamin: new Date(),
  //     tanggal_surat_permohonan_kredit: new Date(),
  //     tanggal_surat_persetujuan_kredit: new Date(),
  //     tempat_lahir_debitur: "CIREBON",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tenggat_angsuran: 10,
  //     total_biaya: 160000,
  //     tujuan_penggunaan: "TAMBAHAN MODAL USAHA",
  //     submitted_at: new Date(),
  //     userID: user.id,
  //   },
  // });

  // await prisma.kMSM.create({
  //   data: {
  //     nomor_surat: "001322.6/1",
  //     tanggal_surat_permohonan_kredit: new Date("2025-04-01"),
  //     tanggal_surat_persetujuan_kredit: new Date("2025-04-05"),
  //     nama: "RENDI MAULANA",
  //     jabatan: "ACCOUNT OFFICER",
  //     nama_debitur: "RUDI SANTOSA",
  //     status_debitur: "Kawin",
  //     hubungan_debitur_penjamin: "Suami",
  //     jenis_kelamin_debitur: "Laki-Laki",
  //     nik_debitur: "3209111201930003",
  //     tempat_lahir_debitur: "MAJALENGKA",
  //     tanggal_lahir_debitur: new Date("1993-12-12"),
  //     alamat_usaha_debitur: "DESA RAJAGALUH WETAN RT 02 RW 01",
  //     alamat_rumah_debitur: "DESA RAJAGALUH WETAN RT 02 RW 01",
  //     pekerjaan_debitur: "TUKANG LAS",
  //     nama_penjamin: "SITI AMINAH",
  //     tempat_lahir_penjamin: "MAJALENGKA",
  //     tanggal_lahir_penjamin: new Date("1995-06-30"),
  //     nik_penjamin: "3209113006950004",
  //     hubungan_penjamin_debitur: "Istri",
  //     nama_barang: "SEPEDA MOTOR HONDA",
  //     harga_barang: 14000000,
  //     no_bpkb: "BPKB-987654",
  //     detail_jaminan:
  //       "BPKB NO. BPKB-987654 AN. SITI AMINAH, MERK HONDA VARIO 125 TAHUN 2021, WARNA HITAM, NO. RANGKA MH1JF5124MK001234, NO. MESIN JF51E-1001234",
  //     nominal_pinjaman: 10000000,
  //     bunga_pinjaman: 18.5,
  //     jangka_waktu: 12,
  //     tujuan_penggunaan: "MODAL KERJA",
  //     nominal_angsuran: 925000,
  //     tanggal_angsuran_pertama: new Date("2025-05-01"),
  //     tanggal_angsuran_terakhir: new Date("2026-04-01"),
  //     hutang_keseluruhan: 11100000,
  //     tenggat_angsuran: 1,
  //     provisi_persen: 1.0,
  //     provisi_nominal: 100000,
  //     administrasi_persen: 0.5,
  //     administrasi_nominal: 50000,
  //     materai_nominal: 10000,
  //     asuransi_tlo_nominal: 20000,
  //     notaris_nominal: 100000,
  //     total_biaya: 280000,
  //     submitted_at: new Date(),
  //     userID: user.id,
  //   },
  // });

  // await prisma.kRS.create({
  //   data: {
  //     nomor_surat: "004650.7/1",
  //     tanggal_surat_permohonan_kredit: new Date("2025-03-10"),
  //     tanggal_surat_persetujuan_kredit: new Date("2025-03-15"),
  //     nama: "AGUS SANTOSO",
  //     jabatan: "ACCOUNT OFFICER",
  //     nama_debitur: "BUDI PRATAMA",
  //     nik_debitur: "3210041202850005",
  //     status_debitur: "Kawin",
  //     hubungan_debitur_penjamin: "Suami",
  //     jenis_kelamin_debitur: "Laki-Laki",
  //     tempat_lahir_debitur: "CIREBON",
  //     tanggal_lahir_debitur: new Date("1985-02-12"),
  //     alamat_usaha_debitur: "JL. PELABUHAN NO. 10 CIREBON",
  //     alamat_rumah_debitur: "JL. PELABUHAN NO. 10 CIREBON",
  //     pekerjaan_debitur: "PEDAGANG KELONTONG",
  //     nama_penjamin: "NINA MARLINA",
  //     nik_penjamin: "3210042506850006",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tanggal_lahir_penjamin: new Date("1985-06-25"),
  //     hubungan_penjamin_debitur: "Istri",
  //     nama_shm: "BUDI PRATAMA",
  //     nik_shm: "3210041202850005",
  //     alamat_shm: "JL. PELABUHAN NO. 10 CIREBON",
  //     detail_jaminan:
  //       "SHM No. 1234567 atas nama BUDI PRATAMA, Luas 120 m², Desa Citemu, Kec. Mundu, Kab. Cirebon",
  //     nominal_pinjaman: 20000000,
  //     bunga_pinjaman: 18.0,
  //     jangka_waktu: 18,
  //     tujuan_penggunaan: "RENOVASI RUMAH",
  //     nominal_angsuran: 1250000,
  //     tanggal_angsuran_pertama: new Date("2025-04-01"),
  //     tanggal_angsuran_terakhir: new Date("2026-09-01"),
  //     hutang_keseluruhan: 22500000,
  //     tenggat_angsuran: 1,
  //     provisi_persen: 1.0,
  //     administrasi_persen: 0.5,
  //     provisi_nominal: 200000,
  //     administrasi_nominal: 100000,
  //     nama_asuransi: "Asuransi Jaga Jiwa",
  //     asuransi_jiwa_nominal: 150000,
  //     materai_nominal: 10000,
  //     total_biaya: 460000,
  //     submitted_at: new Date(),
  //     userID: user.id,
  //   },
  // });

  // await prisma.kMM.create({
  //   data: {
  //     nomor_surat: "000323.9/1",
  //     tanggal_surat_permohonan_kredit: new Date("2025-04-10"),
  //     tanggal_surat_persetujuan_kredit: new Date("2025-04-15"),
  //     nama: "INDRA YULIANA",
  //     jabatan: "ACCOUNT OFFICER",
  //     nama_debitur: "JONI SUPRIADI",
  //     nik_debitur: "3210031504900006",
  //     status_debitur: "Kawin",
  //     hubungan_debitur_penjamin: "Suami",
  //     jenis_kelamin_debitur: "Laki-Laki",
  //     tanggal_lahir_debitur: new Date("1990-04-15"),
  //     tempat_lahir_debitur: "CIREBON",
  //     alamat_usaha_debitur: "JL. MAWAR NO. 45 CIREBON",
  //     alamat_rumah_debitur: "JL. MAWAR NO. 45 CIREBON",
  //     pekerjaan_debitur: "WIRAUSAHA",
  //     nama_penjamin: "SUSI MELANI",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tanggal_lahir_penjamin: new Date("1992-07-12"),
  //     nik_penjamin: "3210031207920003",
  //     hubungan_penjamin_debitur: "Istri",
  //     nama_barang: "MOBIL TOYOTA AVANZA",
  //     harga_barang: 120000000,
  //     no_bpkb: "BPKB-AVZ-789654",
  //     detail_jaminan:
  //       "BPKB MOBIL TOYOTA AVANZA, WARNA HITAM, TAHUN 2020, NOMOR RANGKA MHFCW123456789101, NOMOR MESIN CW456789",
  //     nominal_pinjaman: 80000000,
  //     bunga_pinjaman: 15.5,
  //     jangka_waktu: 24,
  //     tujuan_penggunaan: "MODAL USAHA",
  //     nominal_angsuran: 3850000,
  //     tanggal_angsuran_pertama: new Date("2025-05-01"),
  //     tanggal_angsuran_terakhir: new Date("2027-04-01"),
  //     hutang_keseluruhan: 92400000,
  //     tenggat_angsuran: 1,
  //     provisi_persen: 1.0,
  //     administrasi_persen: 0.5,
  //     provisi_nominal: 800000,
  //     administrasi_nominal: 400000,
  //     materai_nominal: 10000,
  //     asuransi_jiwa_nominal: 250000,
  //     nama_asuransi: "Asuransi Mobil Sejahtera",
  //     asuransi_tlo_nominal: 350000,
  //     notaris_nominal: 200000,
  //     total_biaya: 2010000,
  //     submitted_at: new Date(),
  //     userID: user.id,
  //   },
  // });

  // await prisma.kMS.create({
  //   data: {
  //     nomor_surat: "000971.7/1",
  //     tanggal_surat_permohonan_kredit: new Date("2025-02-10"),
  //     tanggal_surat_persetujuan_kredit: new Date("2025-02-15"),
  //     nama: "RINA WULANDARI",
  //     jabatan: "ACCOUNT OFFICER",
  //     nama_debitur: "AGUS SUPRIYANTO",
  //     status_debitur: "Kawin",
  //     alamat_usaha_debitur: "JL. MELATI NO. 88 CIREBON",
  //     alamat_rumah_debitur: "JL. MELATI NO. 88 CIREBON",
  //     nik_debitur: "3210030803820001",
  //     pekerjaan_debitur: "Wirausaha",
  //     hubungan_debitur_penjamin: "Suami",
  //     alamat_rumah_penjamin: "JL. MELATI NO. 88 CIREBON",
  //     nama_penjamin: "DESI NURMALASARI",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tanggal_lahir_penjamin: new Date("1985-06-22"),
  //     nik_penjamin: "3210032206850004",
  //     hubungan_penjamin_debitur: "Istri",
  //     nama_shm: "AGUS SUPRIYANTO",
  //     alamat_shm: "JL. MELATI NO. 88 CIREBON",
  //     nik_shm: "3210030803820001",
  //     detail_jaminan:
  //       "SHM NO. 123456789 ATAS NAMA AGUS SUPRIYANTO, LUAS 200M2, LOKASI JL. MELATI NO. 88 CIREBON",
  //     nominal_pinjaman: 75000000,
  //     tujuan_penggunaan: "MODAL PERLUASAN TOKO",
  //     jangka_waktu: 18,
  //     bunga_pinjaman: 14.0,
  //     tanggal_angsuran_terakhir: new Date("2026-08-01"),
  //     tenggat_angsuran: 1,
  //     tanggal_angsuran_pertama: new Date("2025-03-01"),
  //     nominal_angsuran: 4700000,
  //     hutang_keseluruhan: 84600000,
  //     provisi_persen: 1.0,
  //     provisi_nominal: 750000,
  //     administrasi_persen: 0.5,
  //     administrasi_nominal: 375000,
  //     materai_nominal: 10000,
  //     notaris_nominal: 200000,
  //     nama_asuransi_jiwa: "Asuransi Hidup Sejahtera",
  //     asuransi_jiwa_nominal: 300000,
  //     total_biaya: 1635000,
  //     submitted_at: new Date(),
  //     userID: user.id,
  //   },
  // });

  // await prisma.kEF.create({
  //   data: {
  //     nomor_surat: "000019.1/1",
  //     tanggal_surat_permohonan_kredit: new Date("2025-03-01"),
  //     tanggal_surat_persetujuan_kredit: new Date("2025-03-05"),
  //     nama_debitur: "NURUL HIKMAH",
  //     status_debitur: "Belum Kawin",
  //     nik_debitur: "3209051101990003",
  //     no_hp_debitur: "081234567890",
  //     jenis_kelamin_debitur: "Perempuan",
  //     hubungan_debitur_penjamin: "Anak",
  //     tempat_lahir_debitur: "CIREBON",
  //     tanggal_lahir_debitur: new Date("1999-01-11"),
  //     nama_usaha_debitur: "Toko Sumber Berkah",
  //     alamat_usaha_debitur: "JL. RAYA PLOSOKEREP NO. 25 CIREBON",
  //     alamat_rumah_debitur: "JL. RAYA PLOSOKEREP NO. 25 CIREBON",
  //     pekerjaan_debitur: "PEDAGANG KELONTONG",
  //     nama_penjamin: "SUHARTI",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tanggal_lahir_penjamin: new Date("1970-04-15"),
  //     nik_penjamin: "3209051504700006",
  //     hubungan_penjamin_debitur: "Ibu",
  //     jumlah_barang: 1,
  //     nama_barang: "KULKAS",
  //     merek_barang: "SHARP",
  //     tipe_barang: "SJ-195MD-SR",
  //     ukuran_barang: "185 Liter",
  //     warna_barang: "Silver",
  //     harga_barang: 3200000,
  //     detail_jaminan:
  //       "Kulkas SHARP 185L SJ-195MD-SR warna silver sebagai jaminan.",
  //     bunga_pinjaman: 18.0,
  //     jangka_waktu: 12,
  //     tanggal_angsuran_terakhir: new Date("2026-03-01"),
  //     tenggat_angsuran: 1,
  //     tanggal_angsuran_pertama: new Date("2025-04-01"),
  //     nominal_angsuran: 310000,
  //     hutang_keseluruhan: 3720000,
  //     provisi_persen: 1.0,
  //     provisi_nominal: 32000,
  //     administrasi_persen: 0.5,
  //     administrasi_nominal: 16000,
  //     materai_nominal: 10000,
  //     fidusia_nominal: 15000,
  //     total_biaya: 73000,
  //     submitted_at: new Date(),
  //     userID: user.id,
  //   },
  // });

  // await prisma.kAR.create({
  //   data: {
  //     nomor_surat: "000235.6/1",
  //     tanggal_surat_permohonan_kredit: new Date("2025-04-01"),
  //     tanggal_surat_persetujuan_kredit: new Date("2025-04-05"),
  //     nama: "BUDI SANTOSO",
  //     jabatan: "KOORDINATOR PEMASARAN",
  //     nama_debitur: "AGUS SETIAWAN",
  //     nik_debitur: "3209062204870002",
  //     status_debitur: "Kawin",
  //     hubungan_debitur_penjamin: "Suami",
  //     jenis_kelamin_debitur: "Laki-Laki",
  //     tempat_lahir_debitur: "CIREBON",
  //     tanggal_lahir_debitur: new Date("1987-04-22"),
  //     alamat_usaha_debitur: "JL. RAYA WERU KM. 8 CIREBON",
  //     alamat_rumah_debitur: "JL. RAYA WERU KM. 8 CIREBON",
  //     pekerjaan_debitur: "SOPIR TRUK",
  //     nama_penjamin: "DEWI LESTARI",
  //     nik_penjamin: "3209061205890005",
  //     tempat_lahir_penjamin: "CIREBON",
  //     tanggal_lahir_penjamin: new Date("1989-05-12"),
  //     hubungan_penjamin_debitur: "Istri",
  //     alamat_rumah_penjamin: "JL. RAYA WERU KM. 8 CIREBON",
  //     nama_barang: "HONDA BEAT CBS 2020",
  //     no_bpkb: "N-20204567",
  //     detail_jaminan:
  //       "BPKB MOTOR HONDA BEAT CBS TAHUN 2020 WARNA PUTIH BIRU, NO. RANGKA MH1JF5115LK023456, NO. MESIN JF51E1234567",
  //     nominal_pinjaman: 8000000,
  //     bunga_pinjaman: 22.5,
  //     jangka_waktu: 12,
  //     nominal_angsuran: 750000,
  //     tanggal_angsuran_pertama: new Date("2025-05-01"),
  //     tanggal_angsuran_terakhir: new Date("2026-04-01"),
  //     hutang_keseluruhan: 9000000,
  //     tenggat_angsuran: 1,
  //     provisi_persen: 1.0,
  //     administrasi_nominal: 40000,
  //     provisi_nominal: 80000,
  //     materai_nominal: 10000,
  //     asuransi_jiwa_nominal: 25000,
  //     nama_asuransi: "Asuransi Jiwa Sejahtera",
  //     notaris_nominal: 120000,
  //     total_biaya: 275000,
  //     submitted_at: new Date(),
  //     userID: user.id,
  //   },
  // });

  await prisma.region.createMany({
    data: [
      { id: "b82f9447-7a60-4daf-b888-d053390c836e", region: "Barat" },
      { id: "a9b69d5d-6f10-456a-9e0a-80e94a0e9cb7", region: "Selatan" },
      { id: "2372b1f6-a5f7-4160-beea-5463bad5145f", region: "Timur" },
    ],
  });

  await prisma.branch.createMany({
    data: [
      // Barat
      {
        id: "4dfc5d80-9312-418a-9bff-10e9cfcdb21e",
        branch: "PUSAT",
        region_id: "b82f9447-7a60-4daf-b888-d053390c836e",
        address: "Jl. Raya Pusat No.1, Jakarta",
      },
      {
        id: "5a4f6e1c-2d3b-4f4a-9f1e-3c9e8f7b6c2a",
        branch: "CWN",
        region_id: "b82f9447-7a60-4daf-b888-d053390c836e",
        address: "Jl. Cendana No.15, Jakarta",
      },

      // Selatan
      {
        id: "8e9f0a1b-3c4d-5e6f-0a1b-2c3d4e5f6a7b",
        branch: "SEDONG",
        region_id: "a9b69d5d-6f10-456a-9e0a-80e94a0e9cb7",
        address: "Jl. Sedong No.3, Yogyakarta",
      },
      {
        id: "9f0a1b2c-4d5e-6f7a-1b2c-3d4e5f6a7b8c",
        branch: "BEBER",
        region_id: "a9b69d5d-6f10-456a-9e0a-80e94a0e9cb7",
        address: "Jl. Beber Raya No.10, Yogyakarta",
      },

      // Timur
      {
        id: "12345678-9abc-def0-1234-56789abcdef0",
        branch: "SINDANG",
        region_id: "2372b1f6-a5f7-4160-beea-5463bad5145f",
        address: "Jl. Sindang No.9, Surabaya",
      },
      {
        id: "3483c2d7-b6e8-4f9a-8c7d-6594e1f2a3b4",
        branch: "KARSEM",
        region_id: "2372b1f6-a5f7-4160-beea-5463bad5145f",
        address: "Jl. Karsem No.20, Surabaya",
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        id: "f6a1806e-0875-4e01-8169-3201702cfa18",
        name: "Bambang",
        username: "bambang.direksi",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        role: "Direksi",
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        id: "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c",
        name: "Supriadi",
        username: "supriadi.am",
        region_id: "b82f9447-7a60-4daf-b888-d053390c836e",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        role: "AM",
      },
      {
        id: "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3e4f5g6h",
        name: "Asdi Muslihun",
        username: "asdi.am",
        region_id: "a9b69d5d-6f10-456a-9e0a-80e94a0e9cb7",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        role: "AM",
      },
      {
        id: "h6g5f4e3-d2c1-0b9a-8e7f-6d5c4b3a2f1e",
        name: "Jamaluddin",
        username: "jamaluddin.am",
        region_id: "2372b1f6-a5f7-4160-beea-5463bad5145f",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        role: "AM",
      },
    ],
  });

  // Step 2: Create SLO (Supervisor) users, each SLO linked to an AM user
  await prisma.user.createMany({
    data: [
      // SLO for Supriadi (AM)
      {
        id: "d4e5f6a7-b8c9-0a1b-2c3d-4e5f6a7b8c9d",
        name: "Vicky",
        username: "vicky.slo",
        branch_id: "4dfc5d80-9312-418a-9bff-10e9cfcdb21e",
        region_id: "b82f9447-7a60-4daf-b888-d053390c836e",
        supervisor_id: "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c", // Refers to Supriadi (AM)
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        role: "SLO",
      },
      {
        id: "e5f6a7b8-c9d0-1a2b-3c4d-5e6f7a8b9c0d",
        name: "Subriana",
        username: "subriana.slo",
        branch_id: "5a4f6e1c-2d3b-4f4a-9f1e-3c9e8f7b6c2a",
        region_id: "b82f9447-7a60-4daf-b888-d053390c836e",
        supervisor_id: "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c", // Refers to Supriadi (AM)
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        role: "SLO",
      },

      // SLO for Asdi Muslihun (AM)
      {
        id: "f6a7b8c9-d0e1-2a3b-4c5d-6e7f8a9b0c1d",
        name: "Imam",
        username: "imam.slo",
        branch_id: "8e9f0a1b-3c4d-5e6f-0a1b-2c3d4e5f6a7b",
        region_id: "a9b69d5d-6f10-456a-9e0a-80e94a0e9cb7",
        supervisor_id: "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3e4f5g6h", // Refers to Asdi Muslihun (AM)
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        role: "SLO",
      },
      {
        id: "a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d",
        name: "Arifin",
        username: "arifin.slo",
        branch_id: "9f0a1b2c-4d5e-6f7a-1b2c-3d4e5f6a7b8c",
        region_id: "a9b69d5d-6f10-456a-9e0a-80e94a0e9cb7",
        supervisor_id: "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3e4f5g6h", // Refers to Asdi Muslihun (AM)
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        role: "SLO",
      },

      // SLO for Jamaluddin (AM)
      {
        id: "b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e",
        branch_id: "12345678-9abc-def0-1234-56789abcdef0",
        region_id: "2372b1f6-a5f7-4160-beea-5463bad5145f",
        name: "Uha",
        username: "uha.slo",
        supervisor_id: "h6g5f4e3-d2c1-0b9a-8e7f-6d5c4b3a2f1e", // Refers to Jamaluddin (AM)
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        role: "SLO",
      },
      {
        id: "c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f",
        branch_id: "3483c2d7-b6e8-4f9a-8c7d-6594e1f2a3b4",
        region_id: "2372b1f6-a5f7-4160-beea-5463bad5145f",
        name: "Neneng",
        username: "neneng.slo",
        supervisor_id: "h6g5f4e3-d2c1-0b9a-8e7f-6d5c4b3a2f1e", // Refers to Jamaluddin (AM)
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        role: "SLO",
      },
    ],
  });

  // Step 3: Create LO (Local Operator) users, each SLO will have 2 LOs
  await prisma.user.createMany({
    data: [
      // LOs for Vicky (SLO)
      {
        id: "e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b",
        name: "Lia Oktaviani",
        username: "lia.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        branch_id: "4dfc5d80-9312-418a-9bff-10e9cfcdb21e",
        region_id: "b82f9447-7a60-4daf-b888-d053390c836e",
        supervisor_id: "d4e5f6a7-b8c9-0a1b-2c3d-4e5f6a7b8c9d", // Refers to SLO Vicky
        role: "LO",
      },
      {
        id: "f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c",
        name: "Rina Suryani",
        username: "rina.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        branch_id: "4dfc5d80-9312-418a-9bff-10e9cfcdb21e",
        region_id: "b82f9447-7a60-4daf-b888-d053390c836e",
        supervisor_id: "d4e5f6a7-b8c9-0a1b-2c3d-4e5f6a7b8c9d", // Refers to SLO Vicky
        role: "LO",
      },

      // LOs for Subriana (SLO)
      {
        id: "a9b0c1d2-e3f4-5a6b-7c8d-9e0f1a2b3c4d",
        name: "Dedi Kurniawan",
        username: "dedi.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        branch_id: "5a4f6e1c-2d3b-4f4a-9f1e-3c9e8f7b6c2a",
        region_id: "b82f9447-7a60-4daf-b888-d053390c836e",
        supervisor_id: "e5f6a7b8-c9d0-1a2b-3c4d-5e6f7a8b9c0d", // Refers to SLO Subriana
        role: "LO",
      },
      {
        id: "b0c1d2e3-f4a5-6b7c-8d9e-0f1a2b3c4d5e",
        name: "Sari Wulandari",
        username: "sari.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        branch_id: "5a4f6e1c-2d3b-4f4a-9f1e-3c9e8f7b6c2a",
        region_id: "b82f9447-7a60-4daf-b888-d053390c836e",
        supervisor_id: "e5f6a7b8-c9d0-1a2b-3c4d-5e6f7a8b9c0d", // Refers to SLO Subriana
        role: "LO",
      },

      // LOs for Imam (SLO)
      {
        id: "c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f",
        name: "Andi Pratama",
        username: "andi.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        branch_id: "8e9f0a1b-3c4d-5e6f-0a1b-2c3d4e5f6a7b",
        region_id: "a9b69d5d-6f10-456a-9e0a-80e94a0e9cb7",
        supervisor_id: "f6a7b8c9-d0e1-2a3b-4c5d-6e7f8a9b0c1d", // Refers to SLO Imam
        role: "LO",
      },
      {
        id: "d2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7g",
        name: "Maya Sari",
        username: "maya.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        branch_id: "8e9f0a1b-3c4d-5e6f-0a1b-2c3d4e5f6a7b",
        region_id: "a9b69d5d-6f10-456a-9e0a-80e94a0e9cb7",
        supervisor_id: "f6a7b8c9-d0e1-2a3b-4c5d-6e7f8a9b0c1d", // Refers to SLO Imam
        role: "LO",
      },

      // LOs for Arifin (SLO)
      {
        id: "e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7g8h",
        name: "Rudi Hartono",
        username: "rudi.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        branch_id: "9f0a1b2c-4d5e-6f7a-1b2c-3d4e5f6a7b8c",
        region_id: "a9b69d5d-6f10-456a-9e0a-80e94a0e9cb7",
        supervisor_id: "a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d", // Refers to SLO Arifin
        role: "LO",
      },
      {
        id: "f4a5b6c7-d8e9-0f1a-2b3c-4d5e6f7g8h9i",
        name: "Sinta Dewi",
        username: "sinta.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        branch_id: "9f0a1b2c-4d5e-6f7a-1b2c-3d4e5f6a7b8c",
        region_id: "a9b69d5d-6f10-456a-9e0a-80e94a0e9cb7",
        supervisor_id: "a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d", // Refers to SLO Arifin
        role: "LO",
      },

      // LOs for Uha (SLO)
      {
        id: "a5b6c7d8-e9f0-1a2b-3c4d-5e6f7g8h9i0j",
        name: "Sri Wahyuni",
        username: "sri.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        supervisor_id: "b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e",
        branch_id: "12345678-9abc-def0-1234-56789abcdef0",
        region_id: "2372b1f6-a5f7-4160-beea-5463bad5145f",
        role: "LO",
      },
      {
        id: "a6b7c8d9-e0f1-2a3b-4c5d-6e7f8g9h0i1j",
        name: "Kaya Lestari",
        username: "kaya.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        supervisor_id: "b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e",
        branch_id: "12345678-9abc-def0-1234-56789abcdef0",
        region_id: "2372b1f6-a5f7-4160-beea-5463bad5145f",
        role: "LO",
      },

      // LOs for Neneng (SLO)
      {
        id: "we3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7g8h",
        name: "Eka Putri",
        username: "eka.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        supervisor_id: "c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f",
        branch_id: "3483c2d7-b6e8-4f9a-8c7d-6594e1f2a3b4",
        region_id: "2372b1f6-a5f7-4160-beea-5463bad5145f",
        role: "LO",
      },
      {
        id: "s4a5b6c7-d8e9-0f1a-2b3c-4d5e6f7g8h9i",
        name: "Fiqa Ramadhani",
        username: "fiqa.lo",
        password: await bcrypt.hash("Password123.", await bcrypt.genSalt(10)),
        supervisor_id: "c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f",
        branch_id: "3483c2d7-b6e8-4f9a-8c7d-6594e1f2a3b4",
        region_id: "2372b1f6-a5f7-4160-beea-5463bad5145f",
        role: "LO",
      },
    ],
  });

  // Step 4: Create Employees, Customers, and Reports

  // Helper function untuk menghasilkan tanggal acak dalam bulan Oktober 2025
  function getRandomDateInOctober() {
    const randomDay = Math.floor(Math.random() * 31) + 1; // Acak antara 1 hingga 31
    return new Date(
      `2025-10-${randomDay.toString().padStart(2, "0")}T09:28:17.915Z`
    );
  }

  // Membuat data untuk employee
  await prisma.employee.createMany({
    data: Array.from({ length: 96 }, (_, index) => ({
      id: `714566fc-a337-44a0-86a3-d7e53d1cec${(index + 1)
        .toString()
        .padStart(2, "0")}`, // Unique ID
      company_name: `Company  ${(index + 1).toString().padStart(2, "0")}`, // Same company name for all
      company_address: `Address No.${index + 1}`, // Same address for all
      company_phone: "123456789", // Same phone number for all
      position: `Position ${index + 1}`, // Unique position (e.g., "Position 1", "Position 2", etc.)
      work: `Work ${index + 1}`, // Same work for all
      salary: 1000000, // Incremental salary for variety
      created_at: new Date("2025-10-23T09:28:17.915Z"), // Consistent timestamp
      updated_at: new Date("2025-10-23T09:28:17.915Z"), // Consistent timestamp
      deleted_at: null, // No deletion date
    })),
  });

  // Mengambil data employees untuk referensi created_by
  const employees = await prisma.user.findMany({
    where: {
      role: "LO", // Fetching only Local Operator roles
    },
  });

  // Membuat data untuk customers
  await prisma.customer.createMany({
    data: Array.from({ length: 96 }, (_, index) => ({
      id: `cd913355-0c30-4d20-98e3-542cd0c56a${(index + 1)
        .toString()
        .padStart(2, "0")}`, // Unique ID
      name: `Customer ${index + 1}`, // Unique customer name
      ktp_number: `123456789`, // Incremental KTP number
      date_of_birth: new Date("1985-06-15T00:00:00.000Z"), // Same date of birth for all
      address: `Address No. ${index + 1}`, // Incremental address
      rt_rw: `01/03`, // Same RT/RW for all
      village: `Gubeng`, // Same village for all
      phone_number: `123456789`, // Incremental phone number
      employee_id: `714566fc-a337-44a0-86a3-d7e53d1cec${(index + 1)
        .toString()
        .padStart(2, "0")}`, // Unique employee ID
      non_employee_id: null,
      business_id: null,
      created_by: employees[Math.floor(index / 8)].id, // Every 8 customers share the same created_by (LO role)
      created_at: getRandomDateInOctober(), // Menggunakan fungsi untuk tanggal acak dalam Oktober 2025
      updated_at: new Date("2025-10-23T09:28:17.915Z"), // Consistent timestamp
      deleted_at: null, // No deletion date
    })),
  });

  // Step 5: Create Reports for Customers with All 8 Process Logic
  const reportsData = [];

  const processes = [
    "DECLINE_LO",
    "REVIEW_SLO",
    "DECLINE_REVIEW_SLO",
    "EVALUATION_SLO",
    "DECLINE_EVALUATION_SLO",
    "REVIEW_AM",
    "APPROVE_AM",
    "DECLINE_AM",
  ];

  for (let i = 0; i < 96; i++) {
    const lo = employees[Math.floor(i / 8)]; // Find LO for this group
    const customer = await prisma.customer.findUnique({
      where: {
        id: `cd913355-0c30-4d20-98e3-542cd0c56a${(i + 1)
          .toString()
          .padStart(2, "0")}`,
      },
    });

    const slo = await prisma.user.findUnique({
      where: {
        id: lo.supervisor_id, // Find SLO linked to LO
      },
    });

    const am = await prisma.user.findUnique({
      where: {
        id: slo.supervisor_id, // Find AM linked to SLO
      },
    });

    // Fetch employee snapshot using employee_id from the customer data
    const employeeSnapshot = await prisma.employee.findUnique({
      where: {
        id: customer.employee_id, // Get employee data using the employee_id from the customer
      },
    });

    // Define process based on customer index
    const process = processes[i % 8]; // This ensures each customer gets a unique process based on their position

    // Determine the status based on the process
    let status = "GOOD"; // Default status
    if (
      process === "DECLINE_LO" ||
      process === "DECLINE_REVIEW_SLO" ||
      process === "DECLINE_EVALUATION_SLO" ||
      process === "DECLINE_AM"
    ) {
      status = "BAD"; // Set status to BAD if any of the DECLINE processes
    }

    // Add report data for each customer
    reportsData.push({
      id: `d220788b-a4bd-45dc-9eb5-5fcd46c56fb${(i + 1)
        .toString()
        .padStart(2, "0")}`, // Unique report ID
      status: status, // Use the status based on the process
      process: process,
      customer_id: customer.id,
      lo_id: lo.id,
      slo_id: slo.id,
      am_id: am.id,
      review_by_slo:
        process === "DECLINE_REVIEW_SLO" ||
        process === "DECLINE_EVALUATION_SLO" ||
        process === "REVIEW_AM" ||
        process === "APPROVE_AM" ||
        process === "DECLINE_AM"
          ? new Date("2025-10-23T09:28:17.915Z")
          : null,
      review_by_am:
        process === "APPROVE_AM" || process === "DECLINE_AM"
          ? new Date("2025-10-23T09:28:17.915Z")
          : null,
      customer_snapshot: {
        id: customer.id,
        name: customer.name,
        rt_rw: customer.rt_rw,
        address: customer.address,
        village: customer.village,
        work_type: "Karyawan", // Dummy data for work_type
        created_at: customer.created_at,
        created_by: lo.id,
        ktp_number: customer.ktp_number,
        updated_at: customer.updated_at,
        business_id: customer.business_id,
        employee_id: customer.employee_id,
        phone_number: customer.phone_number,
        date_of_birth: customer.date_of_birth,
        non_employee_id: customer.non_employee_id,
      },
      employee_snapshot: {
        id: employeeSnapshot.id,
        salary: employeeSnapshot.salary,
        position: employeeSnapshot.position,
        created_at: employeeSnapshot.created_at,
        occupation: employeeSnapshot.occupation,
        updated_at: employeeSnapshot.updated_at,
        company_name: employeeSnapshot.company_name,
        company_phone: employeeSnapshot.company_phone,
        company_address: employeeSnapshot.company_address,
      },
      non_employee_snapshot: null,
      business_snapshot: null,
      created_at: new Date("2025-10-23T09:28:17.915Z"),
      updated_at: new Date("2025-10-23T09:28:17.915Z"),
      deleted_at: null,
    });
  }

  // Insert all reports at once
  await prisma.report.createMany({
    data: reportsData,
  });

  await prisma.reportPhoto.createMany({
    data: Array.from({ length: 96 }, (_, index) => ({
      id: `a1998d8e-af58-4c1b-b498-1788895aff${(index + 1)
        .toString()
        .padStart(2, "0")}`,
      report_id: `d220788b-a4bd-45dc-9eb5-5fcd46c56fb${(index + 1)
        .toString()
        .padStart(2, "0")}`,
      url: "/reports/b4700667-875d-4142-b47a-10eea34038c6.png",
      created_at: new Date("2025-10-23T09:28:17.915Z"), // Gunakan `new Date()` atau string ISO 8601
      updated_at: new Date("2025-10-23T09:28:17.915Z"), // Gunakan `new Date()` atau string ISO 8601
      deleted_at: null, // Jika tidak ada nilai, biarkan `null`
    })),
  });

  // Step 6: Create ReviewCustomer for each Report, excluding DECLINE_LO and REVIEW_LO
  const reviewData = [];

  for (let i = 0; i < reportsData.length; i++) {
    const report = reportsData[i];

    // Skip creating reviewCustomer for DECLINE_LO and REVIEW_LO
    if (report.process === "DECLINE_LO" || report.process === "REVIEW_SLO") {
      continue; // Skip this iteration and don't add a review
    }

    // Determine the review data based on the process
    let reviewIdentity = true;
    let reviewDomicile = true;
    let reviewWork = true;

    // Adjust the review data based on the process
    if (report.process === "DECLINE_REVIEW_SLO") {
      reviewWork = false; // Only `review_work` is false for DECLINE_REVIEW_SLO
    }

    // Create review data for each report based on the process
    reviewData.push({
      id: `31407469-806f-4363-9dea-6642bef069f${(i + 1)
        .toString()
        .padStart(2, "0")}`, // Unique ID for review
      report_id: report.id, // Link the review to the report
      status_review: "COMPLETED",
      review_identity: reviewIdentity, // True by default
      review_domicile: reviewDomicile, // True by default
      review_work: reviewWork, // True or false based on the process
    });
  }

  // Insert all reviewCustomer records at once
  await prisma.reviewCustomer.createMany({
    data: reviewData,
  });

  // Step 7: Create Evaluation for each Report based on Process
  const evaluationData = [];

  for (let i = 0; i < reportsData.length; i++) {
    const report = reportsData[i];

    // Skip creating evaluation for DECLINE_LO, REVIEW_SLO, DECLINE_REVIEW_SLO, and EVALUATION_SLO
    if (
      report.process === "DECLINE_LO" ||
      report.process === "REVIEW_SLO" ||
      report.process === "DECLINE_REVIEW_SLO" ||
      report.process === "EVALUATION_SLO"
    ) {
      console.log(
        `Skipping evaluation creation for report ${report.id} due to process: ${report.process}`
      );
      continue; // Skip this iteration and don't add an evaluation
    }

    // Create evaluation data based on the process
    let statusCharacter = "GOOD";
    let statusCapacity = "GOOD";
    let statusCondition = "GOOD";
    let statusCapital = "GOOD";

    // If the process is DECLINE_EVALUATION_SLO, change status_capital to BAD
    if (report.process === "DECLINE_EVALUATION_SLO") {
      statusCapital = "BAD";
    }

    // Create evaluation data
    evaluationData.push({
      id: `b1f4d5e6-7a8b-9c0d-1e2f-3a4b5c6d7e8f${(i + 1)
        .toString()
        .padStart(2, "0")}`, // Unique ID for evaluation
      report_id: report.id, // Link the evaluation to the report
      status_review: "COMPLETED",
      character:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      status_character: statusCharacter, // Status for character
      capacity:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      status_capacity: statusCapacity, // Status for capacity
      condition:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      status_condition: statusCondition, // Status for condition
      capital:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      status_capital: statusCapital, // Status for capital
    });
  }

  // Insert all evaluation records at once
  await prisma.evaluation.createMany({
    data: evaluationData,
  });

  // Step 10: Create ReviewCustomer for each Report based on Process
  const reviewCustomerData = [];
  const evaluationCustomerData = [];
  const reviewEvaluationData = [];

  for (let i = 0; i < reportsData.length; i++) {
    const report = reportsData[i];

    // Skip creating ReviewEvaluation for DECLINE_LO, REVIEW_SLO, DECLINE_REVIEW_SLO, EVALUATION_SLO, DECLINE_EVALUATION_SLO, and REVIEW_AM
    if (
      report.process === "DECLINE_LO" ||
      report.process === "REVIEW_SLO" ||
      report.process === "DECLINE_REVIEW_SLO" ||
      report.process === "EVALUATION_SLO" ||
      report.process === "DECLINE_EVALUATION_SLO" ||
      report.process === "REVIEW_AM"
    ) {
      console.log(
        `Skipping creation for report ${report.id} due to process: ${report.process}`
      );
      continue; // Skip this iteration and don't add a reviewCustomer or reviewEvaluation
    }

    // Ensure that report_id exists
    const existingReport = await prisma.report.findUnique({
      where: {
        id: report.id, // Ensure that the report exists before creating review/evaluation
      },
    });

    if (!existingReport) {
      console.log(
        `Skipping report creation because report_id ${report.id} does not exist.`
      );
      continue;
    }

    // Step 1: Create ReviewCustomer for APPROVE_AM
    if (report.process === "APPROVE_AM") {
      reviewCustomerData.push({
        id: `e2f5d6c7-b8a9-0c1d-2e3f-4a5b6c7d8e9f${(i + 1)
          .toString()
          .padStart(2, "0")}`,
        evaluation_id: `b1f4d5e6-7a8b-9c0d-1e2f-3a4b5c6d7e8f${(i + 1)
          .toString()
          .padStart(2, "0")}`,
        status_review: "COMPLETED",
        review_character: true,
        review_capacity: true,
        review_condition: true,
        review_capital: true, // All true for APPROVE_AM
      });

      // Create Evaluation for APPROVE_AM
      evaluationCustomerData.push({
        id: `b1f4d5e6-7a8b-9c0d-1e2f-3a4b5c6d7e8f${(i + 1)
          .toString()
          .padStart(2, "0")}`,
        report_id: report.id, // Link evaluation to the report
        status_review: "COMPLETED",
        character:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        status_character: "GOOD",
        capacity:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        status_capacity: "GOOD",
        condition:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        status_condition: "GOOD",
        capital:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        status_capital: "GOOD",
      });
    }

    // Step 2: Create ReviewEvaluation for DECLINE_AM
    if (report.process === "DECLINE_AM") {
      reviewEvaluationData.push({
        id: `e2f5d6c7-b8a9-0c1d-2e3f-4a5b6c7d8e9f${(i + 1)
          .toString()
          .padStart(2, "0")}`,
        evaluation_id: `b1f4d5e6-7a8b-9c0d-1e2f-3a4b5c6d7e8f${(i + 1)
          .toString()
          .padStart(2, "0")}`,
        status_review: "COMPLETED",
        review_character: true,
        review_capacity: true,
        review_condition: true,
        review_capital: false, // Review capital is false for DECLINE_AM
      });
    }
  }

  // // Insert all reviewCustomer records at once
  // await prisma.reviewCustomer.createMany({
  //   data: reviewCustomerData,
  // });

  // // Insert all evaluationCustomer records at once
  // await prisma.evaluation.createMany({
  //   data: evaluationCustomerData,
  // });

  // Insert all reviewEvaluation records at once
  await prisma.reviewEvaluation.createMany({
    data: reviewEvaluationData,
  });

  // await prisma.report.createMany({
  //   data: [
  //     {
  //       id: "d220788b-a4bd-45dc-9eb5-5fcd46c56fb6",
  //       status: "GOOD",
  //       process: "APPROVE_AM",
  //       customer_id: "cd913355-0c30-4d20-98e3-542cd0c56a83",
  //       lo_id: "e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b",
  //       slo_id: "d4e5f6a7-b8c9-0a1b-2c3d-4e5f6a7b8c9d",
  //       am_id: "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c",
  //       customer_snapshot: {
  //         id: "cd913355-0c30-4d20-98e3-542cd0c56a83",
  //         name: "Bagus Budiman",
  //         rt_rw: "01/03",
  //         address: "Jl. Merauke No. 10, Surabaya",
  //         village: "Gubeng",
  //         work_type: "Karyawan",
  //         created_at: "2025-10-23T09:28:17.915Z",
  //         created_by: "e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b",
  //         ktp_number: "1234567890123456",
  //         updated_at: "2025-10-23T09:28:17.915Z",
  //         business_id: null,
  //         employee_id: "714566fc-a337-44a0-86a3-d7e53d1cec6f",
  //         phone_number: "625232243563",
  //         date_of_birth: "1985-06-15T00:00:00.000Z",
  //         non_employee_id: null,
  //       },
  //       employee_snapshot: {
  //         id: "714566fc-a337-44a0-86a3-d7e53d1cec6f",
  //         salary: 11000000,
  //         position: "Junior Software Development",
  //         created_at: "2025-10-23T09:28:17.915Z",
  //         occupation: "Software Development",
  //         updated_at: "2025-10-23T09:28:17.915Z",
  //         company_name: "PT Maju Jaya",
  //         company_phone: "625132152936",
  //         company_address: "JL. Sri Kartini No.43",
  //       },
  //       non_employee_snapshot: null,
  //       business_snapshot: null,
  //       created_at: new Date("2025-10-23T09:28:17.915Z"), // Gunakan `new Date()` atau string ISO 8601
  //       updated_at: new Date("2025-10-23T09:28:17.915Z"), // Gunakan `new Date()` atau string ISO 8601
  //       deleted_at: null, // Jika tidak ada nilai, biarkan `null`
  //     },
  //   ],
  // });

  // await prisma.reportPhoto.createMany({
  //   data: [
  //     {
  //       id: "a1998d8e-af58-4c1b-b498-1788895aff9d",
  //       report_id: "d220788b-a4bd-45dc-9eb5-5fcd46c56fb6",
  //       url: "/reports/b4700667-875d-4142-b47a-10eea34038c6.png",
  //       created_at: new Date("2025-10-23T09:28:17.915Z"), // Gunakan `new Date()` atau string ISO 8601
  //       updated_at: new Date("2025-10-23T09:28:17.915Z"), // Gunakan `new Date()` atau string ISO 8601
  //       deleted_at: null, // Jika tidak ada nilai, biarkan `null`
  //     },
  //   ],
  // });

  // await prisma.reviewCustomer.createMany({
  //   data: [
  //     {
  //       id: "31407469-806f-4363-9dea-6642bef069f3",
  //       report_id: "d220788b-a4bd-45dc-9eb5-5fcd46c56fb6",
  //       review_identity: true,
  //       review_domicile: true,
  //       review_work: true,
  //     },
  //   ],
  // });
  // await prisma.evaluation.createMany({
  //   data: [
  //     {
  //       id: "b1f4d5e6-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
  //       report_id: "d220788b-a4bd-45dc-9eb5-5fcd46c56fb6",
  //       character:
  //         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //       status_character: "GOOD",
  //       capacity:
  //         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //       status_capacity: "GOOD",
  //       condition:
  //         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //       status_condition: "GOOD",
  //       capital:
  //         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //       status_capital: "GOOD",
  //     },
  //   ],
  // });
  // await prisma.reviewEvaluation.createMany({
  //   data: [
  //     {
  //       id: "e2f5d6c7-b8a9-0c1d-2e3f-4a5b6c7d8e9f",
  //       evaluation_id: "b1f4d5e6-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
  //       review_character: true,
  //       review_capacity: true,
  //       review_condition: true,
  //       review_capital: true,
  //     },
  //   ],
  // });

  console.log("✅ Seed data berhasil dibuat.");
}
