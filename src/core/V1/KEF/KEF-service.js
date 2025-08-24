import db from '../../../config/db.js';
class KEFService {
  async getAll(page, limit) {
    let datas;
    if (page && limit) {
      datas = await db.KEF.findMany({
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
      datas = await db.KEF.findMany({
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
    const data = await db.KEF.findUnique({
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
    tanggal_surat_persetujuan_kredit,
    tanggal_surat_permohonan_kredit,
    nama_debitur,
    status_debitur,
    nik_debitur,
    no_hp_debitur,
    jenis_kelamin_debitur,
    hubungan_debitur_penjamin,
    tempat_lahir_debitur,
    tanggal_lahir_debitur,
    nama_usaha_debitur,
    alamat_usaha_debitur,
    alamat_rumah_debitur,
    pekerjaan_debitur,
    nama_penjamin,
    tempat_lahir_penjamin,
    tanggal_lahir_penjamin,
    nik_penjamin,
    hubungan_penjamin_debitur,
    jumlah_barang,
    nama_barang,
    merek_barang,
    tipe_barang,
    ukuran_barang,
    warna_barang,
    harga_barang,
    detail_jaminan,
    bunga_pinjaman,
    jangka_waktu,
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
    fidusia_nominal,
    total_biaya,
    submitted_at,
    userID,
  }) {
    const newKEF = await db.KEF.create({
      data: {
        nomor_surat: nomor_surat,
        tanggal_surat_persetujuan_kredit: tanggal_surat_persetujuan_kredit
          ? new Date(tanggal_surat_persetujuan_kredit)
          : null,
        tanggal_surat_permohonan_kredit: tanggal_surat_permohonan_kredit
          ? new Date(tanggal_surat_permohonan_kredit)
          : null,
        nama_debitur: nama_debitur,
        status_debitur: status_debitur,
        nik_debitur: nik_debitur,
        no_hp_debitur: no_hp_debitur,
        jenis_kelamin_debitur: jenis_kelamin_debitur,
        hubungan_debitur_penjamin: hubungan_debitur_penjamin,
        tempat_lahir_debitur: tempat_lahir_debitur,
        tanggal_lahir_debitur: tanggal_lahir_debitur
          ? new Date(tanggal_lahir_debitur)
          : null,
        nama_usaha_debitur: nama_usaha_debitur,
        alamat_usaha_debitur: alamat_usaha_debitur,
        alamat_rumah_debitur: alamat_rumah_debitur,
        pekerjaan_debitur: pekerjaan_debitur,
        nama_penjamin: nama_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        nik_penjamin: nik_penjamin,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        jumlah_barang: jumlah_barang,
        nama_barang: nama_barang,
        merek_barang: merek_barang,
        tipe_barang: tipe_barang,
        ukuran_barang: ukuran_barang,
        warna_barang: warna_barang,
        harga_barang: harga_barang,
        detail_jaminan: detail_jaminan,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
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
        fidusia_nominal: fidusia_nominal,
        total_biaya: total_biaya,
        submitted_at: new Date(),
        userID: userID,
      },
    });
    if (!newKEF) {
      throw new Error('Create KEF failed');
    }
    return newKEF;
  }

  async update(
    id,
    {
      nomor_surat,
      tanggal_surat_persetujuan_kredit,
      tanggal_surat_permohonan_kredit,
      nama_debitur,
      status_debitur,
      nik_debitur,
      no_hp_debitur,
      jenis_kelamin_debitur,
      hubungan_debitur_penjamin,
      tempat_lahir_debitur,
      tanggal_lahir_debitur,
      nama_usaha_debitur,
      alamat_usaha_debitur,
      alamat_rumah_debitur,
      pekerjaan_debitur,
      nama_penjamin,
      tempat_lahir_penjamin,
      tanggal_lahir_penjamin,
      nik_penjamin,
      hubungan_penjamin_debitur,
      jumlah_barang: jumlah_barang,
      nama_barang,
      merek_barang,
      tipe_barang,
      ukuran_barang,
      warna_barang,
      harga_barang,
      detail_jaminan,
      bunga_pinjaman,
      jangka_waktu,
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
      fidusia_nominal,
      total_biaya,
      status,
      submitted_at,
      userID,
    }
  ) {
    const updatedKEF = await db.KEF.update({
      where: {
        id: id,
      },
      data: {
        nomor_surat: nomor_surat,
        tanggal_surat_persetujuan_kredit: tanggal_surat_persetujuan_kredit
          ? new Date(tanggal_surat_persetujuan_kredit)
          : null,
        tanggal_surat_permohonan_kredit: tanggal_surat_permohonan_kredit
          ? new Date(tanggal_surat_permohonan_kredit)
          : null,
        nama_debitur: nama_debitur,
        status_debitur: status_debitur,
        nik_debitur: nik_debitur,
        no_hp_debitur: no_hp_debitur,
        jenis_kelamin_debitur: jenis_kelamin_debitur,
        hubungan_debitur_penjamin: hubungan_debitur_penjamin,
        tempat_lahir_debitur: tempat_lahir_debitur,
        tanggal_lahir_debitur: tanggal_lahir_debitur
          ? new Date(tanggal_lahir_debitur)
          : null,
        nama_usaha_debitur: nama_usaha_debitur,
        alamat_usaha_debitur: alamat_usaha_debitur,
        alamat_rumah_debitur: alamat_rumah_debitur,
        pekerjaan_debitur: pekerjaan_debitur,
        nama_penjamin: nama_penjamin,
        tempat_lahir_penjamin: tempat_lahir_penjamin,
        tanggal_lahir_penjamin: tanggal_lahir_penjamin
          ? new Date(tanggal_lahir_penjamin)
          : null,
        nik_penjamin: nik_penjamin,
        hubungan_penjamin_debitur: hubungan_penjamin_debitur,
        jumlah_barang: jumlah_barang,
        nama_barang: nama_barang,
        merek_barang: merek_barang,
        tipe_barang: tipe_barang,
        ukuran_barang: ukuran_barang,
        warna_barang: warna_barang,
        harga_barang: harga_barang,
        detail_jaminan: detail_jaminan,
        bunga_pinjaman: bunga_pinjaman,
        jangka_waktu: jangka_waktu,
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
        fidusia_nominal: fidusia_nominal,
        total_biaya: total_biaya,
        status: status,
        updated_at: new Date(),
        submitted_at,
        userID: userID,
      },
    });

    return updatedKEF;
  }

  async deleteById(id) {
    const data = await db.KEF.delete({
      where: {
        id: id,
      },
    });
    return data;
  }
}

export default new KEFService();
