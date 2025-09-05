import db from '../../../config/db.js';

class FLEKSIService {
  async getAll(page, limit) {
    let datas;
    if (page && limit) {
      datas = await db.FLEKSI.findMany({
        take: limit,
        skip: (page - 1) * limit,
        include: {
          User: {
            select: {
              id: true,
              username: true,
              role: true,
              created_at: true,
              updated_at: true,
            },
          },
          barang_elektronik: true,
          barang_furniture: true,
          barang_jaminan_lainnya: true,
        },
      });
    } else {
      datas = await db.FLEKSI.findMany({
        include: {
          User: {
            select: {
              id: true,
              username: true,
              role: true,
              created_at: true,
              updated_at: true,
            },
          },
          barang_elektronik: true,
          barang_furniture: true,
          barang_jaminan_lainnya: true,
        },
      });
    }
    return datas;
  }

  async getById(id) {
    const data = await db.FLEKSI.findUnique({
      where: {
        id: id,
      },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            role: true,
            created_at: true,
            updated_at: true,
          },
        },
        barang_elektronik: true,
        barang_furniture: true,
        barang_jaminan_lainnya: true,
      },
    });
    return data;
  }

  async create({
    nomor_surat,
    tanggal_surat_persetujuan_kredit,
    nama_debitur,
    status_debitur,
    jenis_kelamin_debitur,
    tempat_lahir_debitur,
    tanggal_lahir_debitur,
    alamat_rumah_debitur,
    nik_debitur,
    nama_penjamin,
    nik_penjamin,
    tempat_lahir_penjamin,
    tanggal_lahir_penjamin,
    hubungan_penjamin_debitur,
    alamat_rumah_penjamin,
    // nama_shm,
    nominal_pinjaman,
    bunga_pinjaman,
    jangka_waktu,
    tujuan_penggunaan,
    rekening_pinjaman,
    nominal_angsuran,
    tanggal_angsuran_pertama,
    tenggat_angsuran,
    barang_elektronik,
    barang_furniture,
    barang_jaminan_lainnya,
    submitted_at,
    userID,
  }) {
    const newFLEKSI = await db.FLEKSI.create({
      data: {
        nomor_surat: nomor_surat,
        tanggal_surat_persetujuan_kredit: tanggal_surat_persetujuan_kredit
          ? new Date(tanggal_surat_persetujuan_kredit)
          : null,
        nama_debitur: nama_debitur,
        status_debitur: status_debitur,
        jenis_kelamin_debitur: jenis_kelamin_debitur,
        tempat_lahir_debitur: tempat_lahir_debitur,
        tanggal_lahir_debitur: tanggal_lahir_debitur
          ? new Date(tanggal_lahir_debitur)
          : null,
        alamat_rumah_debitur: alamat_rumah_debitur,
        nik_debitur: nik_debitur,
        nama_penjamin: nama_penjamin,
        nik_penjamin: nik_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        alamat_rumah_penjamin: alamat_rumah_penjamin,
        // nama_shm: nama_shm,
        nominal_pinjaman: nominal_pinjaman,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
        tujuan_penggunaan: tujuan_penggunaan,
        rekening_pinjaman: rekening_pinjaman,
        nominal_angsuran: nominal_angsuran,
        tenggat_angsuran: tenggat_angsuran,
        tanggal_angsuran_pertama: tanggal_angsuran_pertama
          ? new Date(tanggal_angsuran_pertama)
          : null,
        barang_elektronik: {
          create: barang_elektronik?.map((item) => ({
            nama_barang: item.nama_barang,
            tipe: item.tipe,
            harga: item.harga,
          })),
        },
        barang_furniture: {
          create: barang_furniture?.map((item) => ({
            nama_barang: item.nama_barang,
            tipe: item.tipe,
            harga: item.harga,
          })),
        },
        barang_jaminan_lainnya: {
          create: barang_jaminan_lainnya?.map((item) => ({
            nama_barang: item.nama_barang,
          })),
        },
        submitted_at: new Date(),
        userID,
      },
      include: {
        barang_elektronik: true,
        barang_furniture: true,
        barang_jaminan_lainnya: true,
      },
    });

    if (!newFLEKSI) {
      throw new Error('Create FLEKSI failed');
    }
    return newFLEKSI;
  }

  async update(
    id,
    {
      nomor_surat,
      tanggal_surat_persetujuan_kredit,
      nama_debitur,
      status_debitur,
      jenis_kelamin_debitur,
      tempat_lahir_debitur,
      tanggal_lahir_debitur,
      alamat_rumah_debitur,
      nik_debitur,
      nama_penjamin,
      nik_penjamin,
      tempat_lahir_penjamin,
      tanggal_lahir_penjamin,
      hubungan_penjamin_debitur,
      alamat_rumah_penjamin,
      // nama_shm,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      tujuan_penggunaan,
      rekening_pinjaman,
      nominal_angsuran,
      tanggal_angsuran_pertama,
      tenggat_angsuran,
      barang_elektronik,
      barang_furniture,
      barang_jaminan_lainnya,
      status,
      submitted_at,
      userID,
    }
  ) {
    // First delete related records
    await db.fleksiBarangElektronik.deleteMany({
      where: { fleksi_id: id },
    });

    await db.fleksiBarangFurniture.deleteMany({
      where: { fleksi_id: id },
    });

    await db.fleksiBarangJaminanLainnya.deleteMany({
      where: { fleksi_id: id },
    });

    const updatedFLEKSI = await db.FLEKSI.update({
      where: {
        id: id,
      },
      data: {
        nomor_surat: nomor_surat,
        tanggal_surat_persetujuan_kredit: tanggal_surat_persetujuan_kredit
          ? new Date(tanggal_surat_persetujuan_kredit)
          : null,
        nama_debitur: nama_debitur,
        status_debitur: status_debitur,
        jenis_kelamin_debitur: jenis_kelamin_debitur,
        tempat_lahir_debitur: tempat_lahir_debitur,
        tanggal_lahir_debitur: tanggal_lahir_debitur
          ? new Date(tanggal_lahir_debitur)
          : null,
        alamat_rumah_debitur: alamat_rumah_debitur,
        nik_debitur: nik_debitur,
        nama_penjamin: nama_penjamin,
        nik_penjamin: nik_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        alamat_rumah_penjamin: alamat_rumah_penjamin,
        // nama_shm: nama_shm,
        nominal_pinjaman: nominal_pinjaman,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
        tujuan_penggunaan: tujuan_penggunaan,
        rekening_pinjaman: rekening_pinjaman,
        nominal_angsuran: nominal_angsuran,
        tenggat_angsuran: tenggat_angsuran,
        tanggal_angsuran_pertama: tanggal_angsuran_pertama
          ? new Date(tanggal_angsuran_pertama)
          : null,
        barang_elektronik: {
          create: barang_elektronik?.map((item) => ({
            nama_barang: item.nama_barang,
            tipe: item.tipe,
            harga: item.harga,
          })),
        },
        barang_furniture: {
          create: barang_furniture?.map((item) => ({
            nama_barang: item.nama_barang,
            tipe: item.tipe,
            harga: item.harga,
          })),
        },
        barang_jaminan_lainnya: {
          create: barang_jaminan_lainnya?.map((item) => ({
            nama_barang: item.nama_barang,
          })),
        },
        status: status,
        updated_at: new Date(),
        submitted_at,
        userID: userID,
      },
      include: {
        barang_elektronik: true,
        barang_furniture: true,
        barang_jaminan_lainnya: true,
      },
    });

    return updatedFLEKSI;
  }

  async deleteById(id) {
    await db.fleksiBarangElektronik.deleteMany({
      where: { fleksi_id: id },
    });

    await db.fleksiBarangFurniture.deleteMany({
      where: { fleksi_id: id },
    });

    await db.fleksiBarangJaminanLainnya.deleteMany({
      where: { fleksi_id: id },
    });

    const data = await db.FLEKSI.delete({
      where: {
        id: id,
      },
    });
    return data;
  }
}

export default new FLEKSIService();
