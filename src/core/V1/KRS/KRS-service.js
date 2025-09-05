import db from '../../../config/db.js';
class KRSService {
  async getAll(page, limit) {
    let datas;
    if (page && limit) {
      datas = await db.KRS.findMany({
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
      datas = await db.KRS.findMany({
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
    const data = await db.KRS.findUnique({
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
    nik_debitur,
    status_debitur,
    hubungan_debitur_penjamin,
    jenis_kelamin_debitur,
    tempat_lahir_debitur,
    tanggal_lahir_debitur,
    alamat_usaha_debitur,
    alamat_rumah_debitur,
    pekerjaan_debitur,
    nama_penjamin,
    nik_penjamin,
    tempat_lahir_penjamin,
    tanggal_lahir_penjamin,
    hubungan_penjamin_debitur,
    nama_shm,
    nik_shm,
    alamat_shm,
    detail_jaminan,
    nominal_pinjaman,
    bunga_pinjaman,
    jangka_waktu,
    tujuan_penggunaan,
    nominal_angsuran,
    tanggal_angsuran_terakhir,
    hutang_keseluruhan,
    tenggat_angsuran,
    tanggal_angsuran_pertama,
    provisi_persen,
    administrasi_persen,
    provisi_nominal,
    administrasi_nominal,
    nama_asuransi,
    asuransi_jiwa_nominal,
    materai_nominal,
    total_biaya,
    submitted_at,
    userID,
  }) {
    const newKRS = await db.KRS.create({
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
        nik_debitur: nik_debitur,
        status_debitur: status_debitur,
        hubungan_debitur_penjamin: hubungan_debitur_penjamin,
        jenis_kelamin_debitur: jenis_kelamin_debitur,
        tempat_lahir_debitur: tempat_lahir_debitur,
        tanggal_lahir_debitur: tanggal_lahir_debitur
          ? new Date(tanggal_lahir_debitur)
          : null,
        alamat_usaha_debitur: alamat_usaha_debitur,
        alamat_rumah_debitur: alamat_rumah_debitur,
        pekerjaan_debitur: pekerjaan_debitur,
        nama_penjamin: nama_penjamin,
        nik_penjamin: nik_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        nama_shm: nama_shm,
        nik_shm: nik_shm,
        alamat_shm: alamat_shm,
        detail_jaminan: detail_jaminan,
        nominal_pinjaman: nominal_pinjaman,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
        tujuan_penggunaan: tujuan_penggunaan,
        nominal_angsuran: nominal_angsuran,
        tanggal_angsuran_terakhir: tanggal_angsuran_terakhir
          ? new Date(tanggal_angsuran_terakhir)
          : null,
        hutang_keseluruhan: hutang_keseluruhan,
        tenggat_angsuran: tenggat_angsuran,
        tanggal_angsuran_pertama: tanggal_angsuran_pertama
          ? new Date(tanggal_angsuran_pertama)
          : null,
        provisi_persen: provisi_persen,
        administrasi_persen: administrasi_persen,
        provisi_nominal: provisi_nominal,
        administrasi_nominal: administrasi_nominal,
        nama_asuransi: nama_asuransi,
        asuransi_jiwa_nominal: asuransi_jiwa_nominal,
        materai_nominal: materai_nominal,
        total_biaya: total_biaya,
        submitted_at: new Date(),
        userID: userID,
      },
    });
    if (!newKRS) {
      throw new Error('Create KRS failed');
    }
    return newKRS;
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
      nik_debitur,
      status_debitur,
      hubungan_debitur_penjamin,
      jenis_kelamin_debitur,
      tempat_lahir_debitur,
      tanggal_lahir_debitur,
      alamat_usaha_debitur,
      alamat_rumah_debitur,
      pekerjaan_debitur,
      nama_penjamin,
      nik_penjamin,
      tempat_lahir_penjamin,
      tanggal_lahir_penjamin,
      hubungan_penjamin_debitur,
      nama_shm,
      nik_shm,
      alamat_shm,
      detail_jaminan,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      tujuan_penggunaan,
      nominal_angsuran,
      tanggal_angsuran_terakhir,
      hutang_keseluruhan,
      tenggat_angsuran,
      tanggal_angsuran_pertama,
      provisi_persen,
      administrasi_persen,
      provisi_nominal,
      administrasi_nominal,
      nama_asuransi,
      asuransi_jiwa_nominal,
      materai_nominal,
      total_biaya,
      status,
      submitted_at,
      userID,
    }
  ) {
    const updatedKRS = await db.KRS.update({
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
        nik_debitur: nik_debitur,
        status_debitur: status_debitur,
        hubungan_debitur_penjamin: hubungan_debitur_penjamin,
        jenis_kelamin_debitur: jenis_kelamin_debitur,
        tempat_lahir_debitur: tempat_lahir_debitur,
        tanggal_lahir_debitur: tanggal_lahir_debitur
          ? new Date(tanggal_lahir_debitur)
          : null,
        alamat_usaha_debitur: alamat_usaha_debitur,
        alamat_rumah_debitur: alamat_rumah_debitur,
        pekerjaan_debitur: pekerjaan_debitur,
        nama_penjamin: nama_penjamin,
        nik_penjamin: nik_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        nama_shm: nama_shm,
        nik_shm: nik_shm,
        alamat_shm: alamat_shm,
        detail_jaminan: detail_jaminan,
        nominal_pinjaman: nominal_pinjaman,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
        tujuan_penggunaan: tujuan_penggunaan,
        nominal_angsuran: nominal_angsuran,
        tanggal_angsuran_terakhir: tanggal_angsuran_terakhir
          ? new Date(tanggal_angsuran_terakhir)
          : null,
        hutang_keseluruhan: hutang_keseluruhan,
        tenggat_angsuran: tenggat_angsuran,
        tanggal_angsuran_pertama: tanggal_angsuran_pertama
          ? new Date(tanggal_angsuran_pertama)
          : null,
        provisi_persen: provisi_persen,
        administrasi_persen: administrasi_persen,
        provisi_nominal: provisi_nominal,
        administrasi_nominal: administrasi_nominal,
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

    return updatedKRS;
  }

  async deleteById(id) {
    const data = await db.KRS.delete({
      where: {
        id: id,
      },
    });
    return data;
  }
}

export default new KRSService();
