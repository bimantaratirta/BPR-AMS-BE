import { createdResponse, successResponse } from '../../../utils/response.js';
import PINEKService from './PINEK-service.js';
import path from 'path';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { exec } from 'child_process';
import { formatRupiahDenganHuruf } from '../../../utils/formatTerbilangRupiah.js';
import { formatRupiah } from '../../../utils/formatRupiah.js';
import { getHariDalamBahasaIndonesia } from '../../../utils/getHariDalamBahasaIndonesia.js';

class PINEKController {
  async get(req, res) {
    const { page, limit } = req.query;
    const datas = await PINEKService.getAll(page, limit);
    return successResponse(res, datas);
  }

  async getById(req, res) {
    const { id } = req.params;
    const data = await PINEKService.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'PINEK not found' });
    }

    return successResponse(res, data);
  }

  async post(req, res) {
    const {
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
      is_submitted,
    } = req.body;

    const userID = req.app.locals.user;

    const newPINEK = await PINEKService.create({
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
      is_submitted,
      userID,
    });

    if (!newPINEK) {
      throw Error('Failed to create PINEK');
    }

    return createdResponse(res, newPINEK);
  }

  async generatePDF(req, res) {
    try {
      const { id } = req.params;
      const dbData = await PINEKService.getById(id);

      if (!dbData) {
        return res.status(404).json({ message: 'PINEK not found' });
      }

      const tanggal = new Date(dbData.tanggal_surat_persetujuan_kredit);
      const tanggal1 = new Date(dbData.tanggal_lahir_debitur);
      const tanggal2 = new Date(dbData.tanggal_lahir_penjamin);
      const tanggal3 = new Date(dbData.tanggal_surat_permohonan_kredit);
      const tanggal4 = new Date(dbData.tanggal_angsuran_pertama);
      const tanggal5 = new Date(dbData.tanggal_angsuran_terakhir);
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
      const formattedTanggal5 = `${tanggal5.getDate()} ${
        bulanIndonesia[tanggal5.getMonth()]
      } ${tanggal5.getFullYear()}`;

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
      const formatAsuransiJiwaNominal = `${formatRupiah(
        dbData.asuransi_jiwa_nominal
      )}`;
      const formatMateraiNominal = `${formatRupiah(dbData.materai_nominal)}`;

      const data = {
        hari: getHariDalamBahasaIndonesia(formattedTanggal),
        nomor_surat: dbData.nomor_surat,
        tanggal_surat_persetujuan_kredit: formattedTanggal,
        nama_debitur: dbData.nama_debitur,
        pekerjaan_debitur: dbData.pekerjaan_debitur,
        tempat_lahir_debitur: dbData.tempat_lahir_debitur,
        tanggal_lahir_debitur: formattedTanggal1,
        tempat_tinggal_debitur: dbData.alamat_rumah_debitur,
        no_ktp_debitur: dbData.nik_debitur,
        mendapat_persetujuan: dbData.hubungan_penjamin_debitur,
        nama_penjamin: dbData.nama_penjamin,
        tempat_lahir_penjamin: dbData.tempat_lahir_penjamin,
        tanggal_lahir_penjamin: formattedTanggal2,
        no_ktp_penjamin: dbData.nik_penjamin,
        tempat_tinggal_penjamin: dbData.alamat_rumah_penjamin,
        tanggal_permohonan_kredit: formattedTanggal3,
        debitur_menerima_pinjaman: formatNominalPinjaman,
        dikenakan_bunga: dbData.bunga_pinjaman,
        nama_barang: dbData.nama_barang,
        detail_jaminan: dbData.detail_jaminan,
        total_seluruh_hutang: formatHutangKeseluruhan,
        jangka_waktu_hutang: dbData.jangka_waktu,
        mengangsur_paling_lambat: dbData.tenggat_angsuran,
        pemotongan_gaji: formatNominalAngsuran,
        tanggal_mengangsur_pertama: formattedTanggal4,
        tanggal_mengangsur_terakhir: formattedTanggal5,
        provisi_persen: dbData.provisi_persen,
        provisi_nominal: formatProvisiNominal,
        nama_asuransi: dbData.nama_asuransi,
        asuransi_jiwa_nominal: formatAsuransiJiwaNominal,
        materai_nominal: formatMateraiNominal,
        total_biaya: formatTotalBiaya,
      };

      const templatePath = path.resolve('src/templates/', 'PINEK.docx');

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
      const docxFilename = `PINEK_${id}_${timestamp}.docx`;
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
      const dbData = await PINEKService.getById(id);

      if (!dbData) {
        return res.status(404).json({ message: 'PINEK not found' });
      }

      const tanggal = new Date(dbData.tanggal_surat_persetujuan_kredit);
      const tanggal1 = new Date(dbData.tanggal_lahir_debitur);
      const tanggal2 = new Date(dbData.tanggal_lahir_penjamin);
      const tanggal3 = new Date(dbData.tanggal_surat_permohonan_kredit);
      const tanggal4 = new Date(dbData.tanggal_angsuran_pertama);
      const tanggal5 = new Date(dbData.tanggal_angsuran_terakhir);
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
      const formattedTanggal5 = `${tanggal5.getDate()} ${
        bulanIndonesia[tanggal5.getMonth()]
      } ${tanggal5.getFullYear()}`;

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
      const formatAsuransiJiwaNominal = `${formatRupiah(
        dbData.asuransi_jiwa_nominal
      )}`;
      const formatMateraiNominal = `${formatRupiah(dbData.materai_nominal)}`;

      const data = {
        hari: getHariDalamBahasaIndonesia(formattedTanggal),
        nomor_surat: dbData.nomor_surat,
        tanggal_surat_persetujuan_kredit: formattedTanggal,
        nama_debitur: dbData.nama_debitur,
        pekerjaan_debitur: dbData.pekerjaan_debitur,
        tempat_lahir_debitur: dbData.tempat_lahir_debitur,
        tanggal_lahir_debitur: formattedTanggal1,
        tempat_tinggal_debitur: dbData.alamat_rumah_debitur,
        no_ktp_debitur: dbData.nik_debitur,
        mendapat_persetujuan: dbData.hubungan_penjamin_debitur,
        nama_penjamin: dbData.nama_penjamin,
        tempat_lahir_penjamin: dbData.tempat_lahir_penjamin,
        tanggal_lahir_penjamin: formattedTanggal2,
        no_ktp_penjamin: dbData.nik_penjamin,
        tempat_tinggal_penjamin: dbData.alamat_rumah_penjamin,
        tanggal_permohonan_kredit: formattedTanggal3,
        debitur_menerima_pinjaman: formatNominalPinjaman,
        dikenakan_bunga: dbData.bunga_pinjaman,
        total_seluruh_hutang: formatHutangKeseluruhan,
        jangka_waktu_hutang: dbData.jangka_waktu,
        nama_barang: dbData.nama_barang,
        detail_jaminan: dbData.detail_jaminan,
        mengangsur_paling_lambat: dbData.tenggat_angsuran,
        pemotongan_gaji: formatNominalAngsuran,
        tanggal_mengangsur_pertama: formattedTanggal4,
        tanggal_mengangsur_terakhir: formattedTanggal5,
        provisi_persen: dbData.provisi_persen,
        provisi_nominal: formatProvisiNominal,
        nama_asuransi: dbData.nama_asuransi,
        asuransi_jiwa_nominal: formatAsuransiJiwaNominal,
        materai_nominal: formatMateraiNominal,
        total_biaya: formatTotalBiaya,
      };

      const templatePath = path.resolve('src/templates/', 'PINEK.docx');

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
      const docxFilename = `PINEK_${id}_${timestamp}.docx`;

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
    const updatedPINEK = await PINEKService.update(id, payload);

    if (!updatedPINEK) {
      return res.status(404).json({ message: 'PINEK not found' });
    }

    return successResponse(res, updatedPINEK);
  }

  async deleteById(req, res) {
    const { id } = req.params;
    const data = await PINEKService.deleteById(id);

    if (!data) {
      return res.status(404).json({ message: 'PINEK not found' });
    }

    return successResponse(res, data);
  }
}

export default new PINEKController();
