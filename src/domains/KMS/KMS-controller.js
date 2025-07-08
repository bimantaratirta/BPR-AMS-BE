import { createdResponse, successResponse } from '../../utils/response.js';
import KMSService from './KMS-service.js';
import path from 'path';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { exec } from 'child_process';
import { __dirname, __filename } from '../../utils/path.js';
import { formatRupiahDenganHuruf } from '../../utils/formatTerbilangRupiah.js';
import { formatRupiah } from '../../utils/formatRupiah.js';
import { getHariDalamBahasaIndonesia } from '../../utils/getHariDalamBahasaIndonesia.js';

class KMSController {
  async get(req, res) {
    const { page, limit } = req.query;
    const datas = await KMSService.getAll(page, limit);
    return successResponse(res, datas);
  }

  async getById(req, res) {
    const { id } = req.params;
    const data = await KMSService.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'KMS not found' });
    }

    return successResponse(res, data);
  }

  async post(req, res) {
    const {
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
      is_submitted,
    } = req.body;

    const userID = req.app.locals.user;

    const newKMS = await KMSService.create({
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
      is_submitted,
      userID,
    });

    if (!newKMS) {
      throw Error('Failed to create KMS');
    }

    return createdResponse(res, newKMS);
  }

  async generatePDF(req, res) {
    try {
      const { id } = req.params;
      const dbData = await KMSService.getById(id);

      if (!dbData) {
        return res.status(404).json({ message: 'KMS not found' });
      }

      const tanggal = new Date(dbData.tanggal_surat_permohonan_kredit);
      const tanggal1 = new Date(dbData.tanggal_surat_persetujuan_kredit);
      const tanggal2 = new Date(dbData.tanggal_lahir_penjamin);
      const tanggal3 = new Date(dbData.tanggal_angsuran_terakhir);
      const tanggal4 = new Date(dbData.tanggal_angsuran_pertama);
      const bulanIndonesia = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const formattedTanggal = `${tanggal.getDate()} ${
        bulanIndonesia[tanggal.getMonth()]
      } ${tanggal.getFullYear()}`;
      const formattedTanggal1 = `${tanggal1.getDate()} ${
        bulanIndonesia[tanggal1.getMonth()]
      } ${tanggal1.getFullYear()}`;
      const formattedTanggal2 = `${tanggal2.getDate()} ${
        bulanIndonesia[tanggal2.getMonth()]
      } ${tanggal2.getFullYear()}`;
      const formattedTanggal3 = `${tanggal3.getDate()} ${
        bulanIndonesia[tanggal3.getMonth()]
      } ${tanggal3.getFullYear()}`;
      const formattedTanggal4 = `${tanggal4.getDate()} ${
        bulanIndonesia[tanggal4.getMonth()]
      } ${tanggal4.getFullYear()}`;

      const formatNominalPinjaman = `${formatRupiahDenganHuruf(
        dbData.nominal_pinjaman
      )}`;
      const formatHutangKeseluruhan = `${formatRupiahDenganHuruf(
        dbData.hutang_keseluruhan
      )}`;
      const formatNominalAngsuran = `${formatRupiahDenganHuruf(
        dbData.nominal_angsuran
      )}`;
      const formatTotalBiaya = `${formatRupiahDenganHuruf(dbData.total_biaya)}`;

      const formatProvisiNominal = `${formatRupiah(dbData.provisi_nominal)}`;
      const formatAdministrasiNominal = `${formatRupiah(
        dbData.administrasi_nominal
      )}`;
      const formatMateraiNominal = `${formatRupiah(dbData.materai_nominal)}`;
      const formatAsuransiJiwaNominal = `${formatRupiah(
        dbData.asuransi_jiwa_nominal
      )}`;
      const formatNotarisNominal = `${formatRupiah(dbData.notaris_nominal)}`;

      const data = {
        hari: getHariDalamBahasaIndonesia(formattedTanggal1),
        nama: dbData.nama,
        jabatan: dbData.jabatan,
        nama_debitur: dbData.nama_debitur,
        alamat_usaha_debitur: dbData.alamat_usaha_debitur,
        alamat_rumah_debitur: dbData.alamat_rumah_debitur,
        tanggal_surat_permohonan_kredit: formattedTanggal,
        tanggal_surat_persetujuan_kredit: formattedTanggal1,
        nomor_surat: dbData.nomor_surat,
        tujuan: dbData.tujuan_penggunaan,
        plafond: formatNominalPinjaman,
        jangka_waktu: dbData.jangka_waktu,
        suku_bunga: dbData.bunga_pinjaman,
        biaya_provisi: dbData.provisi_persen,
        biaya_administrasi: dbData.administrasi_persen,
        pekerjaan_debitur: dbData.pekerjaan_debitur,
        nama_SHM: dbData.nama_shm,
        alamat_shm: dbData.alamat_shm,
        alamat_penjamin: dbData.alamat_rumah_penjamin,
        no_ktp_SHM: dbData.nik_shm,
        detail_jaminan: dbData.detail_jaminan,
        no_ktp_debitur: dbData.nik_debitur,
        telah_persetujuan_dari: dbData.hubungan_penjamin_debitur,
        nama_penjamin: dbData.nama_penjamin,
        tempat_lahir_penjamin: dbData.tempat_lahir_penjamin,
        tanggal_lahir_penjamin: formattedTanggal2,
        no_ktp_penjamin: dbData.nik_penjamin,
        bertempat_sama_dengan: dbData.hubungan_debitur_penjamin,
        melunasi_hutang_sebesar: formatHutangKeseluruhan,
        tanggal_mengangsur_terakhir: formattedTanggal3,
        tanggal_mengangsur_tiap_bulan: dbData.tenggat_angsuran,
        tanggal_mengangsur_pertama: formattedTanggal4,
        nominal_angsuran: formatNominalAngsuran,
        biaya_provisi_sebesar: formatProvisiNominal,
        biaya_administrasi_sebesar: formatAdministrasiNominal,
        nama_asuransi_jiwa: dbData.nama_asuransi_jiwa,
        biaya_asuransi_jiwa_sebesar: formatAsuransiJiwaNominal,
        biaya_materai_sebesar: formatMateraiNominal,
        biaya_notaris_sebesar: formatNotarisNominal,
        biaya_jumlah: formatTotalBiaya,
      };

      const templatePath = path.resolve('src/templates/', 'KMS.docx');

      if (!fs.existsSync(templatePath)) {
        return res.status(404).json({
          error: 'Template file tidak ditemukan',
          path: templatePath,
        });
      }

      const content = fs.readFileSync(templatePath, 'binary');
      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: {
          start: '{{',
          end: '}}',
        },
      });

      doc.setData(data);

      try {
        doc.render();
      } catch (renderError) {
        return res.status(400).json({
          error: 'Template rendering failed',
          message: renderError.message,
          details: renderError.properties?.errors || [],
        });
      }

      const buf = doc.getZip().generate({ type: 'nodebuffer' });

      const outputDir = path.resolve(`output`);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const timestamp = Date.now();
      const docxFilename = `KMS_${id}_${timestamp}.docx`;
      const pdfFilename = docxFilename.replace('.docx', '.pdf');

      const docxPath = path.join(outputDir, docxFilename);
      const pdfPath = path.join(outputDir, pdfFilename);

      fs.writeFileSync(docxPath, buf);

      // Convert DOCX to PDF using LibreOffice
      const convertToPdfWithSoffice = (inputPath, outputPath) => {
        return new Promise((resolve, reject) => {
          const cmd = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
          exec(cmd, (error, stdout, stderr) => {
            if (error) {
              return reject(
                new Error(`LibreOffice error: ${stderr || stdout}`)
              );
            }

            fs.readFile(outputPath, (err, pdfBuffer) => {
              if (err) {
                return reject(new Error(`Gagal membaca PDF: ${outputPath}`));
              }
              resolve(pdfBuffer);
            });
          });
        });
      };

      try {
        const pdfBuffer = await convertToPdfWithSoffice(docxPath, pdfPath);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${pdfFilename}"`,
          'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);

        fs.unlinkSync(docxPath);
        fs.unlinkSync(pdfPath);
      } catch (pdfError) {
        console.error('Gagal konversi ke PDF:', pdfError);
        return res.status(500).json({
          error: 'PDF conversion failed',
          message: pdfError.message,
        });
      }
    } catch (error) {
      console.error('Gagal generate PDF:', error);
      res.status(500).json({
        error: 'Failed to generate PDF',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async generateDOCX(req, res) {
    try {
      const { id } = req.params;
      const dbData = await KMSService.getById(id);

      if (!dbData) {
        return res.status(404).json({ message: 'KMS not found' });
      }

      const tanggal = new Date(dbData.tanggal_surat_permohonan_kredit);
      const tanggal1 = new Date(dbData.tanggal_surat_persetujuan_kredit);
      const tanggal2 = new Date(dbData.tanggal_lahir_penjamin);
      const tanggal3 = new Date(dbData.tanggal_angsuran_terakhir);
      const tanggal4 = new Date(dbData.tanggal_angsuran_pertama);
      const bulanIndonesia = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const formattedTanggal = `${tanggal.getDate()} ${
        bulanIndonesia[tanggal.getMonth()]
      } ${tanggal.getFullYear()}`;
      const formattedTanggal1 = `${tanggal1.getDate()} ${
        bulanIndonesia[tanggal1.getMonth()]
      } ${tanggal1.getFullYear()}`;
      const formattedTanggal2 = `${tanggal2.getDate()} ${
        bulanIndonesia[tanggal2.getMonth()]
      } ${tanggal2.getFullYear()}`;
      const formattedTanggal3 = `${tanggal3.getDate()} ${
        bulanIndonesia[tanggal3.getMonth()]
      } ${tanggal3.getFullYear()}`;
      const formattedTanggal4 = `${tanggal4.getDate()} ${
        bulanIndonesia[tanggal4.getMonth()]
      } ${tanggal4.getFullYear()}`;

      const formatNominalPinjaman = `${formatRupiahDenganHuruf(
        dbData.nominal_pinjaman
      )}`;
      const formatHutangKeseluruhan = `${formatRupiahDenganHuruf(
        dbData.hutang_keseluruhan
      )}`;
      const formatNominalAngsuran = `${formatRupiahDenganHuruf(
        dbData.nominal_angsuran
      )}`;
      const formatTotalBiaya = `${formatRupiahDenganHuruf(dbData.total_biaya)}`;

      const formatProvisiNominal = `${formatRupiah(dbData.provisi_nominal)}`;
      const formatAdministrasiNominal = `${formatRupiah(
        dbData.administrasi_nominal
      )}`;
      const formatMateraiNominal = `${formatRupiah(dbData.materai_nominal)}`;
      const formatAsuransiJiwaNominal = `${formatRupiah(
        dbData.asuransi_jiwa_nominal
      )}`;
      const formatNotarisNominal = `${formatRupiah(dbData.notaris_nominal)}`;

      const data = {
        hari: getHariDalamBahasaIndonesia(formattedTanggal1),
        nama: dbData.nama,
        jabatan: dbData.jabatan,
        nama_debitur: dbData.nama_debitur,
        alamat_usaha_debitur: dbData.alamat_usaha_debitur,
        alamat_rumah_debitur: dbData.alamat_rumah_debitur,
        tanggal_surat_permohonan_kredit: formattedTanggal,
        tanggal_surat_persetujuan_kredit: formattedTanggal1,
        nomor_surat: dbData.nomor_surat,
        tujuan: dbData.tujuan_penggunaan,
        plafond: formatNominalPinjaman,
        jangka_waktu: dbData.jangka_waktu,
        suku_bunga: dbData.bunga_pinjaman,
        biaya_provisi: dbData.provisi_persen,
        biaya_administrasi: dbData.administrasi_persen,
        pekerjaan_debitur: dbData.pekerjaan_debitur,
        nama_SHM: dbData.nama_shm,
        alamat_shm: dbData.alamat_shm,
        alamat_penjamin: dbData.alamat_rumah_penjamin,
        no_ktp_SHM: dbData.nik_shm,
        detail_jaminan: dbData.detail_jaminan,
        no_ktp_debitur: dbData.nik_debitur,
        telah_persetujuan_dari: dbData.hubungan_penjamin_debitur,
        nama_penjamin: dbData.nama_penjamin,
        tempat_lahir_penjamin: dbData.tempat_lahir_penjamin,
        tanggal_lahir_penjamin: formattedTanggal2,
        no_ktp_penjamin: dbData.nik_penjamin,
        bertempat_sama_dengan: dbData.hubungan_debitur_penjamin,
        melunasi_hutang_sebesar: formatHutangKeseluruhan,
        tanggal_mengangsur_terakhir: formattedTanggal3,
        tanggal_mengangsur_tiap_bulan: dbData.tenggat_angsuran,
        tanggal_mengangsur_pertama: formattedTanggal4,
        nominal_angsuran: formatNominalAngsuran,
        biaya_provisi_sebesar: formatProvisiNominal,
        biaya_administrasi_sebesar: formatAdministrasiNominal,
        nama_asuransi_jiwa: dbData.nama_asuransi_jiwa,
        biaya_asuransi_jiwa_sebesar: formatAsuransiJiwaNominal,
        biaya_materai_sebesar: formatMateraiNominal,
        biaya_notaris_sebesar: formatNotarisNominal,
        biaya_jumlah: formatTotalBiaya,
      };

      const templatePath = path.resolve('src/templates/', 'KMS.docx');

      if (!fs.existsSync(templatePath)) {
        return res.status(404).json({
          error: 'Template file tidak ditemukan',
          path: templatePath,
        });
      }

      const content = fs.readFileSync(templatePath, 'binary');
      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: {
          start: '{{',
          end: '}}',
        },
      });

      doc.setData(data);

      try {
        doc.render();
      } catch (renderError) {
        return res.status(400).json({
          error: 'Template rendering failed',
          message: renderError.message,
          details: renderError.properties?.errors || [],
        });
      }

      const buf = doc.getZip().generate({ type: 'nodebuffer' });
      const timestamp = Date.now();
      const docxFilename = `KMS_${id}_${timestamp}.docx`;

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${docxFilename}"`,
        'Content-Length': buf.length,
      });

      res.send(buf);
    } catch (err) {
      console.error('Gagal generate DOCX:', err);
      res.status(500).json({
        error: 'Failed to generate Word document',
        message: err.message,
      });
    }
  }

  async put(req, res) {
    const { id } = req.params;
    let payload = req.body;

    const userID = req.app.locals.user;
    payload.userID = userID;
    const updatedKMS = await KMSService.update(id, payload);

    if (!updatedKMS) {
      return res.status(404).json({ message: 'KMS not found' });
    }

    return successResponse(res, updatedKMS);
  }

  async deleteById(req, res) {
    const { id } = req.params;
    const data = await KMSService.deleteById(id);

    if (!data) {
      return res.status(404).json({ message: 'KMS not found' });
    }

    return successResponse(res, data);
  }
}

export default new KMSController();
