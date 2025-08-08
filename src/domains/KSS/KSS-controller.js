import { createdResponse, successResponse } from '../../utils/response.js';
import KSSService from './KSS-service.js';
import path from 'path';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { exec } from 'child_process';
import { formatRupiahDenganHuruf } from '../../utils/formatTerbilangRupiah.js';
import { formatRupiah } from '../../utils/formatRupiah.js';
import { getHariDalamBahasaIndonesia } from '../../utils/getHariDalamBahasaIndonesia.js';

class KSSController {
  async get(req, res) {
    const { page, limit } = req.query;
    const datas = await KSSService.getAll(page, limit);
    return successResponse(res, datas);
  }

  async getById(req, res) {
    const { id } = req.params;
    const data = await KSSService.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'KSS not found' });
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
      nik_debitur,
      status_debitur,
      hubungan_debitur_penjamin,
      alamat_usaha_debitur,
      alamat_rumah_debitur,
      pekerjaan_debitur,
      tempat_lahir_debitur,
      tanggal_lahir_debitur,
      nama_penjamin,
      nik_penjamin,
      alamat_rumah_penjamin,
      tempat_lahir_penjamin,
      hubungan_penjamin_debitur,
      tanggal_lahir_penjamin,
      nama_shm,
      nik_shm,
      alamat_shm,
      detail_jaminan,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      tujuan_penggunaan,
      nominal_angsuran,
      tanggal_angsuran_dimulai,
      tanggal_angsuran_terakhir,
      hutang_keseluruhan,
      provisi_persen,
      administrasi_persen,
      provisi_nominal,
      administrasi_nominal,
      nama_asuransi,
      asuransi_nominal,
      materai_nominal,
      notaris_nominal,
      total_biaya,
      is_submitted,
    } = req.body;

    const userID = req.app.locals.user;

    const newKSS = await KSSService.create({
      nomor_surat,
      tanggal_surat_permohonan_kredit,
      tanggal_surat_persetujuan_kredit,
      nama,
      jabatan,
      nama_debitur,
      nik_debitur,
      status_debitur,
      hubungan_debitur_penjamin,
      alamat_usaha_debitur,
      alamat_rumah_debitur,
      pekerjaan_debitur,
      tempat_lahir_debitur,
      tanggal_lahir_debitur,
      nama_penjamin,
      nik_penjamin,
      alamat_rumah_penjamin,
      tempat_lahir_penjamin,
      hubungan_penjamin_debitur,
      tanggal_lahir_penjamin,
      nama_shm,
      nik_shm,
      alamat_shm,
      detail_jaminan,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      tujuan_penggunaan,
      nominal_angsuran,
      tanggal_angsuran_dimulai,
      tanggal_angsuran_terakhir,
      hutang_keseluruhan,
      provisi_persen,
      administrasi_persen,
      provisi_nominal,
      administrasi_nominal,
      nama_asuransi,
      asuransi_nominal,
      materai_nominal,
      notaris_nominal,
      total_biaya,
      is_submitted,
      userID,
    });

    if (!newKSS) {
      throw Error('Failed to create KSS');
    }

    return createdResponse(res, newKSS);
  }

  async generatePDF(req, res) {
    try {
      const { id } = req.params;
      const dbData = await KSSService.getById(id);

      if (!dbData) {
        return res.status(404).json({ message: 'KSS not found' });
      }

      const tanggal = new Date(dbData.tanggal_surat_permohonan_kredit);
      const tanggal1 = new Date(dbData.tanggal_surat_persetujuan_kredit);
      const tanggal2 = new Date(dbData.tanggal_lahir_penjamin);
      const tanggal3 = new Date(dbData.tanggal_angsuran_dimulai);
      const tanggal4 = new Date(dbData.tanggal_angsuran_terakhir);
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
      const formatAsuransiNominal = `${formatRupiah(dbData.asuransi_nominal)}`;
      const formatMateraiNominal = `${formatRupiah(dbData.materai_nominal)}`;
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
        plaford: formatNominalPinjaman,
        jangka_waktu: dbData.jangka_waktu,
        suku_bunga: dbData.bunga_pinjaman,
        biaya_provisi: dbData.provisi_persen,
        biaya_administrasi: dbData.administrasi_persen,
        detail_jaminan: dbData.detail_jaminan,
        pekerjaan_debitur: dbData.pekerjaan_debitur,
        nama_penjamin: dbData.nama_penjamin,
        alamat_penjamin: dbData.alamat_rumah_penjamin,
        no_ktp_penjamin: dbData.nik_penjamin,
        no_ktp_debitur: dbData.nik_debitur,
        persetujuan_dari: dbData.hubungan_penjamin_debitur,
        tempat_lahir_penjamin: dbData.tempat_lahir_penjamin,
        tanggal_lahir_penjamin: formattedTanggal2,
        tinggal_sama_dengan: dbData.hubungan_debitur_penjamin,
        tujuan_penggunaan_kredit: dbData.tujuan_penggunaan,
        total_seluruh_pinjaman: formatHutangKeseluruhan,
        tanggal_angsuran_dimulai: formattedTanggal3,
        tanggal_angsuran_terakhir: formattedTanggal4,
        angsuran_tiap_bulan: formatNominalAngsuran,
        nominal_provisi: formatProvisiNominal,
        nominal_administrasi: formatAdministrasiNominal,
        nama_asuransi: dbData.nama_asuransi,
        biaya_asuransi: formatAsuransiNominal,
        biaya_materai: formatMateraiNominal,
        biaya_notaris: formatNotarisNominal,
        total_biaya: formatTotalBiaya,
        nama_shm: dbData.nama_shm,
        nik_shm: dbData.nik_shm,
        alamat_shm: dbData.alamat_shm,
      };

      const templatePath = path.resolve('src/templates/', 'KSS.docx');

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
      const docxFilename = `KSS_${id}_${timestamp}.docx`;
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
      const dbData = await KSSService.getById(id);

      if (!dbData) {
        return res.status(404).json({ message: 'KSS not found' });
      }

      const tanggal = new Date(dbData.tanggal_surat_permohonan_kredit);
      const tanggal1 = new Date(dbData.tanggal_surat_persetujuan_kredit);
      const tanggal2 = new Date(dbData.tanggal_lahir_penjamin);
      const tanggal3 = new Date(dbData.tanggal_angsuran_dimulai);
      const tanggal4 = new Date(dbData.tanggal_angsuran_terakhir);
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
      const formatAsuransiNominal = `${formatRupiah(dbData.asuransi_nominal)}`;
      const formatMateraiNominal = `${formatRupiah(dbData.materai_nominal)}`;
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
        plaford: formatNominalPinjaman,
        jangka_waktu: dbData.jangka_waktu,
        suku_bunga: dbData.bunga_pinjaman,
        biaya_provisi: dbData.provisi_persen,
        biaya_administrasi: dbData.administrasi_persen,
        detail_jaminan: dbData.detail_jaminan,
        pekerjaan_debitur: dbData.pekerjaan_debitur,
        nama_penjamin: dbData.nama_penjamin,
        alamat_penjamin: dbData.alamat_rumah_penjamin,
        no_ktp_penjamin: dbData.nik_penjamin,
        no_ktp_debitur: dbData.nik_debitur,
        persetujuan_dari: dbData.hubungan_penjamin_debitur,
        tempat_lahir_penjamin: dbData.tempat_lahir_penjamin,
        tanggal_lahir_penjamin: formattedTanggal2,
        tinggal_sama_dengan: dbData.hubungan_debitur_penjamin,
        tujuan_penggunaan_kredit: dbData.tujuan_penggunaan,
        total_seluruh_pinjaman: formatHutangKeseluruhan,
        tanggal_angsuran_dimulai: formattedTanggal3,
        tanggal_angsuran_terakhir: formattedTanggal4,
        angsuran_tiap_bulan: formatNominalAngsuran,
        nominal_provisi: formatProvisiNominal,
        nominal_administrasi: formatAdministrasiNominal,
        nama_asuransi: dbData.nama_asuransi,
        biaya_asuransi: formatAsuransiNominal,
        biaya_materai: formatMateraiNominal,
        biaya_notaris: formatNotarisNominal,
        total_biaya: formatTotalBiaya,
        nama_shm: dbData.nama_shm,
        nik_shm: dbData.nik_shm,
        alamat_shm: dbData.alamat_shm,
      };

      const templatePath = path.resolve('src/templates/', 'KSS.docx');

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
      const docxFilename = `KSS_${id}_${timestamp}.docx`;

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
    const updatedKSS = await KSSService.update(id, payload);

    if (!updatedKSS) {
      return res.status(404).json({ message: 'KSS not found' });
    }

    return successResponse(res, updatedKSS);
  }

  async deleteById(req, res) {
    const { id } = req.params;
    const data = await KSSService.deleteById(id);

    if (!data) {
      return res.status(404).json({ message: 'KSS not found' });
    }

    return successResponse(res, data);
  }
}

export default new KSSController();
