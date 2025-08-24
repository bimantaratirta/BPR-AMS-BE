import db from '../../../config/db.js';
class KMSMService {
  async getAll(page, limit) {
    let datas;
    if (page && limit) {
      datas = await db.KMSM.findMany({
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
      datas = await db.KMSM.findMany({
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
    const data = await db.KMSM.findUnique({
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
    hubungan_debitur_penjamin,
    jenis_kelamin_debitur,
    nik_debitur,
    alamat_usaha_debitur,
    alamat_rumah_debitur,
    tanggal_lahir_debitur,
    tempat_lahir_debitur,
    pekerjaan_debitur,
    nama_penjamin,
    tempat_lahir_penjamin,
    tanggal_lahir_penjamin,
    nik_penjamin,
    hubungan_penjamin_debitur,
    nama_barang,
    harga_barang,
    no_bpkb,
    // nama_shm,
    detail_jaminan,
    nominal_pinjaman,
    bunga_pinjaman,
    jangka_waktu,
    tujuan_penggunaan,
    nominal_angsuran,
    tanggal_angsuran_pertama,
    tanggal_angsuran_terakhir,
    hutang_keseluruhan,
    tenggat_angsuran,
    provisi_persen,
    administrasi_persen,
    provisi_nominal,
    materai_nominal,
    asuransi_tlo_nominal,
    administrasi_nominal,
    notaris_nominal,
    total_biaya,
    submitted_at,
    userID,
  }) {
    const newKMSM = await db.KMSM.create({
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
        hubungan_debitur_penjamin: hubungan_debitur_penjamin,
        jenis_kelamin_debitur: jenis_kelamin_debitur,
        nik_debitur: nik_debitur,
        alamat_usaha_debitur: alamat_usaha_debitur,
        alamat_rumah_debitur: alamat_rumah_debitur,
        tanggal_lahir_debitur: tanggal_lahir_debitur
          ? new Date(tanggal_lahir_debitur)
          : null,
        tempat_lahir_debitur: tempat_lahir_debitur,
        pekerjaan_debitur: pekerjaan_debitur,
        nama_penjamin: nama_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        nik_penjamin: nik_penjamin,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        nama_barang: nama_barang,
        harga_barang: harga_barang,
        no_bpkb: no_bpkb,
        // nama_shm: nama_shm,
        detail_jaminan: detail_jaminan,
        nominal_pinjaman: nominal_pinjaman,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
        tujuan_penggunaan: tujuan_penggunaan,
        nominal_angsuran: nominal_angsuran,
        tanggal_angsuran_pertama: tanggal_angsuran_pertama
          ? new Date(tanggal_angsuran_pertama)
          : null,
        tanggal_angsuran_terakhir: tanggal_angsuran_terakhir
          ? new Date(tanggal_angsuran_terakhir)
          : null,
        hutang_keseluruhan: hutang_keseluruhan,
        tenggat_angsuran: tenggat_angsuran,
        provisi_persen: provisi_persen,
        administrasi_persen: administrasi_persen,
        provisi_nominal: provisi_nominal,
        materai_nominal: materai_nominal,
        asuransi_tlo_nominal: asuransi_tlo_nominal,
        administrasi_nominal: administrasi_nominal,
        notaris_nominal: notaris_nominal,
        total_biaya: total_biaya,
        submitted_at: new Date(),
        userID: userID,
      },
    });
    if (!newKMSM) {
      throw new Error('Create KMSM failed');
    }
    return newKMSM;
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
      hubungan_debitur_penjamin,
      jenis_kelamin_debitur,
      nik_debitur,
      alamat_usaha_debitur,
      alamat_rumah_debitur,
      tanggal_lahir_debitur,
      tempat_lahir_debitur,
      pekerjaan_debitur,
      nama_penjamin,
      tempat_lahir_penjamin,
      tanggal_lahir_penjamin,
      nik_penjamin,
      hubungan_penjamin_debitur,
      nama_barang,
      harga_barang,
      no_bpkb,
      // nama_shm,
      detail_jaminan,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      tujuan_penggunaan,
      nominal_angsuran,
      tanggal_angsuran_pertama,
      tanggal_angsuran_terakhir,
      hutang_keseluruhan,
      tenggat_angsuran,
      provisi_persen,
      administrasi_persen,
      provisi_nominal,
      materai_nominal,
      asuransi_tlo_nominal,
      administrasi_nominal,
      notaris_nominal,
      total_biaya,
      status,
      submitted_at,
      userID,
    }
  ) {
    const updatedKMSM = await db.KMSM.update({
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
        hubungan_debitur_penjamin: hubungan_debitur_penjamin,
        jenis_kelamin_debitur: jenis_kelamin_debitur,
        nik_debitur: nik_debitur,
        alamat_usaha_debitur: alamat_usaha_debitur,
        alamat_rumah_debitur: alamat_rumah_debitur,
        tanggal_lahir_debitur: tanggal_lahir_debitur
          ? new Date(tanggal_lahir_debitur)
          : null,
        tempat_lahir_debitur: tempat_lahir_debitur,
        pekerjaan_debitur: pekerjaan_debitur,
        nama_penjamin: nama_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        nik_penjamin: nik_penjamin,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        nama_barang: nama_barang,
        harga_barang: harga_barang,
        no_bpkb: no_bpkb,
        // nama_shm: nama_shm,
        detail_jaminan: detail_jaminan,
        nominal_pinjaman: nominal_pinjaman,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
        tujuan_penggunaan: tujuan_penggunaan,
        nominal_angsuran: nominal_angsuran,
        tanggal_angsuran_pertama: tanggal_angsuran_pertama
          ? new Date(tanggal_angsuran_pertama)
          : null,
        tanggal_angsuran_terakhir: tanggal_angsuran_terakhir
          ? new Date(tanggal_angsuran_terakhir)
          : null,
        hutang_keseluruhan: hutang_keseluruhan,
        tenggat_angsuran: tenggat_angsuran,
        provisi_persen: provisi_persen,
        administrasi_persen: administrasi_persen,
        provisi_nominal: provisi_nominal,
        materai_nominal: materai_nominal,
        asuransi_tlo_nominal: asuransi_tlo_nominal,
        administrasi_nominal: administrasi_nominal,
        notaris_nominal: notaris_nominal,
        total_biaya: total_biaya,
        status: status,
        updated_at: new Date(),
        submitted_at,
        userID: userID,
      },
    });

    return updatedKMSM;
  }

  async deleteById(id) {
    const data = await db.KMSM.delete({
      where: {
        id: id,
      },
    });
    return data;
  }
}

export default new KMSMService();
