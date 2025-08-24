import db from '../../../config/db.js';
class PINEKService {
  async getAll(page, limit) {
    let datas;
    if (page && limit) {
      datas = await db.PINEK.findMany({
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
        },
      });
    } else {
      datas = await db.PINEK.findMany({
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
        },
      });
    }
    return datas;
  }
  async getById(id) {
    const data = await db.PINEK.findUnique({
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
      },
    });
    return data;
  }
  async create({
    nomor_surat,
    tanggal_surat_permohonan_kredit,
    tanggal_surat_persetujuan_kredit,
    nama_debitur,
    nik_debitur,
    status_debitur,
    tempat_lahir_debitur,
    tanggal_lahir_debitur,
    alamat_rumah_debitur,
    pekerjaan_debitur,
    nama_penjamin,
    nik_penjamin,
    tempat_lahir_penjamin,
    tanggal_lahir_penjamin,
    hubungan_penjamin_debitur,
    alamat_rumah_penjamin,
    // nama_shm,
    nama_barang,
    detail_jaminan,
    nominal_pinjaman,
    bunga_pinjaman,
    jangka_waktu,
    nominal_angsuran,
    tanggal_angsuran_pertama,
    tanggal_angsuran_terakhir,
    hutang_keseluruhan,
    tenggat_angsuran,
    rekening_pinjaman,
    tujuan_penggunaan,
    provisi_persen,
    provisi_nominal,
    nama_asuransi,
    asuransi_jiwa_nominal,
    materai_nominal,
    total_biaya,
    submitted_at,
    userID,
  }) {
    const newPINEK = await db.PINEK.create({
      data: {
        nomor_surat: nomor_surat,
        tanggal_surat_permohonan_kredit: tanggal_surat_permohonan_kredit
          ? new Date(tanggal_surat_permohonan_kredit)
          : null,
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
        pekerjaan_debitur: pekerjaan_debitur,
        nama_penjamin: nama_penjamin,
        nik_penjamin: nik_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        alamat_rumah_penjamin: alamat_rumah_penjamin,
        // nama_shm: nama_shm,
        nama_barang: nama_barang,
        detail_jaminan: detail_jaminan,
        nominal_pinjaman: nominal_pinjaman,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
        nominal_angsuran: nominal_angsuran,
        tanggal_angsuran_pertama: tanggal_angsuran_pertama
          ? new Date(tanggal_angsuran_pertama)
          : null,
        tanggal_angsuran_terakhir: tanggal_angsuran_terakhir
          ? new Date(tanggal_angsuran_terakhir)
          : null,
        hutang_keseluruhan: hutang_keseluruhan,
        tenggat_angsuran: tenggat_angsuran,
        rekening_pinjaman: rekening_pinjaman,
        tujuan_penggunaan: tujuan_penggunaan,
        provisi_persen: provisi_persen,
        provisi_nominal: provisi_nominal,
        nama_asuransi: nama_asuransi,
        asuransi_jiwa_nominal: asuransi_jiwa_nominal,
        materai_nominal: materai_nominal,
        total_biaya: total_biaya,
        submitted_at: new Date(),
        userID: userID,
      },
    });
    if (!newPINEK) {
      throw new Error('Create PINEK failed');
    }
    return newPINEK;
  }
  async update(
    id,
    {
      nomor_surat,
      tanggal_surat_permohonan_kredit,
      tanggal_surat_persetujuan_kredit,
      nama_debitur,
      nik_debitur,
      status_debitur,
      tempat_lahir_debitur,
      tanggal_lahir_debitur,
      alamat_rumah_debitur,
      pekerjaan_debitur,
      nama_penjamin,
      nik_penjamin,
      tempat_lahir_penjamin,
      tanggal_lahir_penjamin,
      hubungan_penjamin_debitur,
      alamat_rumah_penjamin,
      // nama_shm,
      nama_barang,
      detail_jaminan,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      nominal_angsuran,
      tanggal_angsuran_pertama,
      tanggal_angsuran_terakhir,
      hutang_keseluruhan,
      tenggat_angsuran,
      rekening_pinjaman,
      tujuan_penggunaan,
      provisi_persen,
      provisi_nominal,
      nama_asuransi,
      asuransi_jiwa_nominal,
      materai_nominal,
      total_biaya,
      status,
      submitted_at,
      userID,
    }
  ) {
    const updatedPINEK = await db.PINEK.update({
      where: {
        id: id,
      },
      data: {
        nomor_surat: nomor_surat,
        tanggal_surat_permohonan_kredit: tanggal_surat_permohonan_kredit
          ? new Date(tanggal_surat_permohonan_kredit)
          : null,
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
        pekerjaan_debitur: pekerjaan_debitur,
        nama_penjamin: nama_penjamin,
        nik_penjamin: nik_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        alamat_rumah_penjamin: alamat_rumah_penjamin,
        // nama_shm: nama_shm,
        nama_barang: nama_barang,
        detail_jaminan: detail_jaminan,
        nominal_pinjaman: nominal_pinjaman,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
        nominal_angsuran: nominal_angsuran,
        tanggal_angsuran_pertama: tanggal_angsuran_pertama
          ? new Date(tanggal_angsuran_pertama)
          : null,
        tanggal_angsuran_terakhir: tanggal_angsuran_terakhir
          ? new Date(tanggal_angsuran_terakhir)
          : null,
        hutang_keseluruhan: hutang_keseluruhan,
        tenggat_angsuran: tenggat_angsuran,
        rekening_pinjaman: rekening_pinjaman,
        tujuan_penggunaan: tujuan_penggunaan,
        provisi_persen: provisi_persen,
        provisi_nominal: provisi_nominal,
        nama_asuransi: nama_asuransi,
        asuransi_jiwa_nominal: asuransi_jiwa_nominal,
        materai_nominal: materai_nominal,
        total_biaya: total_biaya,
        status: status,
        updated_at: new Date(),
        submitted_at,
        userID: userID,
      },
    });

    return updatedPINEK;
  }

  async deleteById(id) {
    const data = await db.PINEK.delete({
      where: {
        id: id,
      },
    });
    return data;
  }
}

export default new PINEKService();
