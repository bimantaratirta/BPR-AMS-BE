import db from '../../../config/db.js';
class PROCIMService {
  async getAll(page, limit) {
    let datas;
    if (page && limit) {
      datas = await db.PROCIM.findMany({
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
      datas = await db.PROCIM.findMany({
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
    const data = await db.PROCIM.findUnique({
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
    nik_debitur,
    status_debitur,
    tempat_lahir_debitur,
    tanggal_lahir_debitur,
    alamat_rumah_debitur,
    nama_penjamin,
    nik_penjamin,
    tempat_lahir_penjamin,
    tanggal_lahir_penjamin,
    alamat_rumah_penjamin,
    // nama_SHM,
    nominal_pinjaman,
    bunga_pinjaman,
    jangka_waktu,
    rekening_pinjaman,
    nominal_angsuran,
    tenggat_angsuran,
    tanggal_angsuran_pertama,
    barang_elektronik,
    barang_furniture,
    barang_jaminan_lainnya,
    submitted_at,
    userID,
  }) {
    const newPROCIM = await db.PROCIM.create({
      data: {
        nomor_surat: nomor_surat,
        tanggal_surat_persetujuan_kredit: tanggal_surat_persetujuan_kredit
          ? new Date(tanggal_surat_persetujuan_kredit)
          : null,
        nama_debitur: nama_debitur,
        nik_debitur: nik_debitur,
        status_debitur: status_debitur,
        tempat_lahir_debitur: tempat_lahir_debitur,
        tanggal_lahir_debitur: tanggal_lahir_debitur
          ? new Date(tanggal_lahir_debitur)
          : null,
        alamat_rumah_debitur: alamat_rumah_debitur,
        nama_penjamin: nama_penjamin,
        nik_penjamin: nik_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        alamat_rumah_penjamin: alamat_rumah_penjamin,
        // nama_SHM: nama_SHM,
        nominal_pinjaman: nominal_pinjaman,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
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
        userID: userID,
      },
      include: {
        barang_elektronik: true,
        barang_furniture: true,
        barang_jaminan_lainnya: true,
      },
    });
    if (!newPROCIM) {
      throw new Error('Create PROCIM failed');
    }
    return newPROCIM;
  }

  async update(
    id,
    {
      nomor_surat,
      tanggal_surat_persetujuan_kredit,
      nama_debitur,
      nik_debitur,
      status_debitur,
      tempat_lahir_debitur,
      tanggal_lahir_debitur,
      alamat_rumah_debitur,
      nama_penjamin,
      nik_penjamin,
      tempat_lahir_penjamin,
      tanggal_lahir_penjamin,
      alamat_rumah_penjamin,
      // nama_SHM,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      rekening_pinjaman,
      nominal_angsuran,
      tenggat_angsuran,
      tanggal_angsuran_pertama,
      barang_elektronik,
      barang_furniture,
      barang_jaminan_lainnya,
      status,
      submitted_at,
      userID,
    }
  ) {
    // First delete related records
    await db.procimBarangElektronik.deleteMany({
      where: { procim_id: id },
    });

    await db.procimBarangFurniture.deleteMany({
      where: { procim_id: id },
    });

    await db.procimBarangJaminanLainnya.deleteMany({
      where: { procim_id: id },
    });

    const updatedPROCIM = await db.PROCIM.update({
      where: {
        id: id,
      },
      data: {
        nomor_surat: nomor_surat,
        tanggal_surat_persetujuan_kredit: tanggal_surat_persetujuan_kredit
          ? new Date(tanggal_surat_persetujuan_kredit)
          : null,
        nama_debitur: nama_debitur,
        nik_debitur: nik_debitur,
        status_debitur: status_debitur,
        tempat_lahir_debitur: tempat_lahir_debitur,
        tanggal_lahir_debitur: tanggal_lahir_debitur
          ? new Date(tanggal_lahir_debitur)
          : null,
        alamat_rumah_debitur: alamat_rumah_debitur,
        nama_penjamin: nama_penjamin,
        nik_penjamin: nik_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        alamat_rumah_penjamin: alamat_rumah_penjamin,
        // nama_SHM: nama_SHM,
        nominal_pinjaman: nominal_pinjaman,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
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

    return updatedPROCIM;
  }

  async deleteById(id) {
    await db.procimBarangElektronik.deleteMany({
      where: { procim_id: id },
    });

    await db.procimBarangFurniture.deleteMany({
      where: { procim_id: id },
    });

    await db.procimBarangJaminanLainnya.deleteMany({
      where: { procim_id: id },
    });

    const data = await db.PROCIM.delete({
      where: {
        id: id,
      },
    });
    return data;
  }
}

export default new PROCIMService();
