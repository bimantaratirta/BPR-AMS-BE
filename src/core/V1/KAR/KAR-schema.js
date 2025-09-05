import Joi from 'joi';
import JoiDate from '@joi/date';

const JoiExtended = Joi.extend(JoiDate);

const createKAR = JoiExtended.object({
  nomor_surat: JoiExtended.string().optional().min(0),
  tanggal_surat_permohonan_kredit: JoiExtended.date()
    .format('YYYY/MM/DD')
    .optional(),
  tanggal_surat_persetujuan_kredit: JoiExtended.date()
    .format('YYYY/MM/DD')
    .optional(),
  nama: JoiExtended.string().optional().min(0),
  jabatan: JoiExtended.string().optional().min(0),
  nama_debitur: JoiExtended.string().optional().min(0),
  nik_debitur: JoiExtended.string().optional().min(0),
  status_debitur: JoiExtended.string().optional().min(0),
  hubungan_debitur_penjamin: JoiExtended.string().optional().min(0),
  jenis_kelamin_debitur: JoiExtended.string().optional().min(0),
  tempat_lahir_debitur: JoiExtended.string().optional().min(0),
  tanggal_lahir_debitur: JoiExtended.date().format('YYYY/MM/DD').optional(),
  alamat_usaha_debitur: JoiExtended.string().optional().min(0),
  alamat_rumah_debitur: JoiExtended.string().optional().min(0),
  pekerjaan_debitur: JoiExtended.string().optional().min(0),
  nama_penjamin: JoiExtended.string().optional().min(0),
  nik_penjamin: JoiExtended.string().optional().min(0),
  tempat_lahir_penjamin: JoiExtended.string().optional().min(0),
  tanggal_lahir_penjamin: JoiExtended.date().format('YYYY/MM/DD').optional(),
  hubungan_penjamin_debitur: JoiExtended.string().optional().min(0),
  alamat_rumah_penjamin: JoiExtended.string().optional().min(0),
  nama_barang: JoiExtended.string().optional().min(0),
  no_bpkb: JoiExtended.string().optional().min(0),
  // nama_shm: JoiExtended.string().optional().min(0),
  detail_jaminan: JoiExtended.string().optional().min(0),
  nominal_pinjaman: JoiExtended.number().optional().min(0),
  bunga_pinjaman: JoiExtended.number().optional().min(0),
  jangka_waktu: JoiExtended.number().optional().min(0),
  nominal_angsuran: JoiExtended.number().optional().min(0),
  tanggal_angsuran_pertama: JoiExtended.date().format('YYYY/MM/DD').optional(),
  tanggal_angsuran_terakhir: JoiExtended.date().format('YYYY/MM/DD').optional(),
  hutang_keseluruhan: JoiExtended.number().optional().min(0),
  tenggat_angsuran: JoiExtended.number().optional().min(0),
  provisi_persen: JoiExtended.number().optional().min(0),
  administrasi_nominal: JoiExtended.number().optional().min(0),
  provisi_nominal: JoiExtended.number().optional().min(0),
  materai_nominal: JoiExtended.number().optional().min(0),
  asuransi_jiwa_nominal: JoiExtended.number().optional().min(0),
  nama_asuransi: JoiExtended.string().optional().min(0),
  notaris_nominal: JoiExtended.number().optional().min(0),
  total_biaya: JoiExtended.number().optional().min(0),
  status: JoiExtended.string().optional().min(0),
  is_submitted: JoiExtended.boolean().required(),
});

export { createKAR };
