import db from '../../../config/db.js';

class KMSService {
  async getAll(page, limit) {
    let datas;
    if (page && limit) {
      datas = await db.KMS.findMany({
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
      datas = await db.KMS.findMany({
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
    const data = await db.KMS.findUnique({
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
    nama,
    jabatan,
    nama_debitur,
    status_debitur,
    alamat_usaha_debitur,
    alamat_rumah_debitur,
    nik_debitur,
    pekerjaan_debitur,
    hubungan_debitur_penjamin,
    alamat_rumah_penjamin,
    nama_penjamin,
    tempat_lahir_penjamin,
    tanggal_lahir_penjamin,
    nik_penjamin,
    hubungan_penjamin_debitur,
    nama_shm,
    alamat_shm,
    nik_shm,
    detail_jaminan,
    nominal_pinjaman,
    tujuan_penggunaan,
    jangka_waktu,
    bunga_pinjaman,
    tanggal_angsuran_terakhir,
    tenggat_angsuran,
    tanggal_angsuran_pertama,
    nominal_angsuran,
    hutang_keseluruhan,
    provisi_persen,
    provisi_nominal,
    administrasi_persen,
    administrasi_nominal,
    materai_nominal,
    notaris_nominal,
    nama_asuransi_jiwa,
    asuransi_jiwa_nominal,
    total_biaya,
    submitted_at,
    userID,
  }) {
    const newKMS = await db.KMS.create({
      data: {
        nomor_surat: nomor_surat,
        tanggal_surat_permohonan_kredit: tanggal_surat_permohonan_kredit
          ? new Date(tanggal_surat_permohonan_kredit)
          : null,
        tanggal_surat_persetujuan_kredit: tanggal_surat_persetujuan_kredit
          ? new Date(tanggal_surat_persetujuan_kredit)
          : null,
        nama: nama,
        jabatan: jabatan,
        nama_debitur: nama_debitur,
        status_debitur: status_debitur,
        alamat_usaha_debitur: alamat_usaha_debitur,
        alamat_rumah_debitur: alamat_rumah_debitur,
        nik_debitur: nik_debitur,
        pekerjaan_debitur: pekerjaan_debitur,
        hubungan_debitur_penjamin: hubungan_debitur_penjamin,
        alamat_rumah_penjamin: alamat_rumah_penjamin,
        nama_penjamin: nama_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        nik_penjamin: nik_penjamin,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        nama_shm: nama_shm,
        alamat_shm: alamat_shm,
        nik_shm: nik_shm,
        detail_jaminan: detail_jaminan,
        nominal_pinjaman: nominal_pinjaman,
        tujuan_penggunaan: tujuan_penggunaan,
        jangka_waktu: jangka_waktu,
        bunga_pinjaman: bunga_pinjaman,
        tanggal_angsuran_terakhir: tanggal_angsuran_terakhir
          ? new Date(tanggal_angsuran_terakhir)
          : null,
        tenggat_angsuran: tenggat_angsuran,
        tanggal_angsuran_pertama: tanggal_angsuran_pertama
          ? new Date(tanggal_angsuran_pertama)
          : null,
        nominal_angsuran: nominal_angsuran,
        hutang_keseluruhan: hutang_keseluruhan,
        provisi_persen: provisi_persen,
        provisi_nominal: provisi_nominal,
        administrasi_persen: administrasi_persen,
        administrasi_nominal: administrasi_nominal,
        materai_nominal: materai_nominal,
        notaris_nominal: notaris_nominal,
        nama_asuransi_jiwa: nama_asuransi_jiwa,
        asuransi_jiwa_nominal: asuransi_jiwa_nominal,
        total_biaya: total_biaya,
        submitted_at: new Date(),
        userID: userID,
      },
    });
    if (!newKMS) {
      throw new Error('Create KMS failed');
    }
    return newKMS;
  }

  async update(
    id,
    {
      nomor_surat,
      tanggal_surat_permohonan_kredit,
      tanggal_surat_persetujuan_kredit,
      nama,
      jabatan,
      nama_debitur,
      status_debitur,
      alamat_usaha_debitur,
      alamat_rumah_debitur,
      nik_debitur,
      pekerjaan_debitur,
      hubungan_debitur_penjamin,
      alamat_rumah_penjamin,
      nama_penjamin,
      tempat_lahir_penjamin,
      tanggal_lahir_penjamin,
      nik_penjamin,
      hubungan_penjamin_debitur,
      nama_shm,
      alamat_shm,
      nik_shm,
      detail_jaminan,
      nominal_pinjaman,
      tujuan_penggunaan,
      jangka_waktu,
      bunga_pinjaman,
      tanggal_angsuran_terakhir,
      tenggat_angsuran,
      tanggal_angsuran_pertama,
      nominal_angsuran,
      hutang_keseluruhan,
      provisi_persen,
      provisi_nominal,
      administrasi_persen,
      administrasi_nominal,
      materai_nominal,
      notaris_nominal,
      nama_asuransi_jiwa,
      asuransi_jiwa_nominal,
      total_biaya,
      status,
      submitted_at,
      userID,
    }
  ) {
    const updatedKMS = await db.KMS.update({
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
        nama: nama,
        jabatan: jabatan,
        nama_debitur: nama_debitur,
        status_debitur: status_debitur,
        alamat_usaha_debitur: alamat_usaha_debitur,
        alamat_rumah_debitur: alamat_rumah_debitur,
        nik_debitur: nik_debitur,
        pekerjaan_debitur: pekerjaan_debitur,
        hubungan_debitur_penjamin: hubungan_debitur_penjamin,
        alamat_rumah_penjamin: alamat_rumah_penjamin,
        nama_penjamin: nama_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        nik_penjamin: nik_penjamin,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        nama_shm: nama_shm,
        alamat_shm: alamat_shm,
        nik_shm: nik_shm,
        detail_jaminan: detail_jaminan,
        nominal_pinjaman: nominal_pinjaman,
        tujuan_penggunaan: tujuan_penggunaan,
        jangka_waktu: jangka_waktu,
        bunga_pinjaman: bunga_pinjaman,
        tanggal_angsuran_terakhir: tanggal_angsuran_terakhir
          ? new Date(tanggal_angsuran_terakhir)
          : null,
        tenggat_angsuran: tenggat_angsuran,
        tanggal_angsuran_pertama: tanggal_angsuran_pertama
          ? new Date(tanggal_angsuran_pertama)
          : null,
        nominal_angsuran: nominal_angsuran,
        hutang_keseluruhan: hutang_keseluruhan,
        provisi_persen: provisi_persen,
        provisi_nominal: provisi_nominal,
        administrasi_persen: administrasi_persen,
        administrasi_nominal: administrasi_nominal,
        materai_nominal: materai_nominal,
        notaris_nominal: notaris_nominal,
        nama_asuransi_jiwa: nama_asuransi_jiwa,
        asuransi_jiwa_nominal: asuransi_jiwa_nominal,
        total_biaya: total_biaya,
        status: status,
        updated_at: new Date(),
        submitted_at,
        userID: userID,
      },
    });

    return updatedKMS;
  }

  async deleteById(id) {
    const data = await db.KMS.delete({
      where: {
        id: id,
      },
    });
    return data;
  }
}

export default new KMSService();
