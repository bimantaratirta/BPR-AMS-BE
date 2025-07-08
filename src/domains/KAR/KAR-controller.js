import { createdResponse, successResponse } from '../../utils/response.js';
import KARService from './KAR-service.js';
import path from 'path';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { exec } from 'child_process';
import { __dirname, __filename } from '../../utils/path.js';
import { formatRupiahDenganHuruf } from '../../utils/formatTerbilangRupiah.js';
import { formatRupiah } from '../../utils/formatRupiah.js';
import { getHariDalamBahasaIndonesia } from '../../utils/getHariDalamBahasaIndonesia.js';

class KARController {
  async get(req, res) {
    const { page, limit } = req.query;
    const datas = await KARService.getAll(page, limit);
    return successResponse(res, datas);
  }

  async getById(req, res) {
    const { id } = req.params;
    const data = await KARService.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'KAR not found' });
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
      alamat_rumah_penjamin,
      nama_barang,
      no_bpkb,
      // nama_shm,
      detail_jaminan,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      nominal_angsuran,
      tanggal_angsuran_pertama,
      tanggal_angsuran_terakhir,
      hutang_keseluruhan,
      tenggat_angsuran,
      provisi_persen,
      administrasi_nominal,
      provisi_nominal,
      materai_nominal,
      asuransi_jiwa_nominal,
      nama_asuransi,
      notaris_nominal,
      total_biaya,
      is_submitted,
    } = req.body;

    const userID = req.app.locals.user;

    const newKAR = await KARService.create({
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
      alamat_rumah_penjamin,
      nama_barang,
      no_bpkb,
      // nama_shm,
      detail_jaminan,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      nominal_angsuran,
      tanggal_angsuran_pertama,
      tanggal_angsuran_terakhir,
      hutang_keseluruhan,
      tenggat_angsuran,
      provisi_persen,
      administrasi_nominal,
      provisi_nominal,
      materai_nominal,
      asuransi_jiwa_nominal,
      nama_asuransi,
      notaris_nominal,
      total_biaya,
      is_submitted,
      userID,
    });

    if (!newKAR) {
      throw Error('Failed to create KAR');
    }

    return createdResponse(res, newKAR);
  }

  async generatePDF(req, res) {
    try {
      const { id } = req.params;
      const dbData = await KARService.getById(id);

      if (!dbData) {
        return res.status(404).json({ message: 'KAR not found' });
      }

      const tanggal = new Date(dbData.tanggal_surat_permohonan_kredit);
      const tanggal1 = new Date(dbData.tanggal_surat_persetujuan_kredit);
      const tanggal2 = new Date(dbData.tanggal_lahir_debitur);
      const tanggal3 = new Date(dbData.tanggal_lahir_penjamin);
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
        nominal: formatNominalPinjaman,
        suku_bunga: dbData.bunga_pinjaman,
        jangka_waktu: dbData.jangka_waktu,
        biaya_provisi: dbData.provisi_persen,
        biaya_administrasi: formatAdministrasiNominal,
        detail_jaminan: dbData.detail_jaminan,
        no_bpkb: dbData.no_bpkb,
        pekerjaan_debitur: dbData.pekerjaan_debitur,
        tempat_lahir_debitur: dbData.tempat_lahir_debitur,
        tanggal_lahir_debitur: formattedTanggal2,
        no_ktp_debitur: dbData.nik_debitur,
        hubungan_debitur_penjamin: dbData.hubungan_debitur_penjamin,
        nama_penjamin: dbData.nama_penjamin,
        tempat_lahir_penjamin: dbData.tempat_lahir_penjamin,
        tanggal_lahir_penjamin: formattedTanggal3,
        bertempat_tinggal_sama: dbData.hubungan_penjamin_debitur,
        no_ktp_penjamin: dbData.nik_penjamin,
        utang_atas_kredit_sebesar: formatHutangKeseluruhan,
        tenggat_mengangsur_tiap_bulan: dbData.tenggat_angsuran,
        nilai_mengangsur: formatNominalAngsuran,
        tanggal_mengangsur_pertama: formattedTanggal4,
        tanggal_mengangsur_terakhir: formattedTanggal5,
        biaya_provisi_sebesar: formatProvisiNominal,
        biaya_materai_sebesar: formatMateraiNominal,
        biaya_asuransi_jiwa_sebesar: formatAsuransiJiwaNominal,
        nama_asuransi_jiwa: dbData.nama_asuransi,
        biaya_notaris_sebesar: formatNotarisNominal,
        total_biaya: formatTotalBiaya,
        nama_barang: dbData.nama_barang,
      };

      const templatePath = path.resolve('src/templates/', 'KAR.docx');

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
      const docxFilename = `KAR_${id}_${timestamp}.docx`;
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
      const dbData = await KARService.getById(id);

      if (!dbData) {
        return res.status(404).json({ message: 'KAR not found' });
      }

      const tanggal = new Date(dbData.tanggal_surat_permohonan_kredit);
      const tanggal1 = new Date(dbData.tanggal_surat_persetujuan_kredit);
      const tanggal2 = new Date(dbData.tanggal_lahir_debitur);
      const tanggal3 = new Date(dbData.tanggal_lahir_penjamin);
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
        nominal: formatNominalPinjaman,
        suku_bunga: dbData.bunga_pinjaman,
        jangka_waktu: dbData.jangka_waktu,
        biaya_provisi: dbData.provisi_persen,
        biaya_administrasi: formatAdministrasiNominal,
        detail_jaminan: dbData.detail_jaminan,
        no_bpkb: dbData.no_bpkb,
        pekerjaan_debitur: dbData.pekerjaan_debitur,
        tempat_lahir_debitur: dbData.tempat_lahir_debitur,
        tanggal_lahir_debitur: formattedTanggal2,
        no_ktp_debitur: dbData.nik_debitur,
        hubungan_debitur_penjamin: dbData.hubungan_debitur_penjamin,
        nama_penjamin: dbData.nama_penjamin,
        tempat_lahir_penjamin: dbData.tempat_lahir_penjamin,
        tanggal_lahir_penjamin: formattedTanggal3,
        bertempat_tinggal_sama: dbData.hubungan_penjamin_debitur,
        no_ktp_penjamin: dbData.nik_penjamin,
        utang_atas_kredit_sebesar: formatHutangKeseluruhan,
        tenggat_mengangsur_tiap_bulan: dbData.tenggat_angsuran,
        nilai_mengangsur: formatNominalAngsuran,
        tanggal_mengangsur_pertama: formattedTanggal4,
        tanggal_mengangsur_terakhir: formattedTanggal5,
        biaya_provisi_sebesar: formatProvisiNominal,
        biaya_materai_sebesar: formatMateraiNominal,
        biaya_asuransi_jiwa_sebesar: formatAsuransiJiwaNominal,
        nama_asuransi_jiwa: dbData.nama_asuransi,
        biaya_notaris_sebesar: formatNotarisNominal,
        total_biaya: formatTotalBiaya,
        nama_barang: dbData.nama_barang,
      };

      const templatePath = path.resolve('src/templates/', 'KAR.docx');

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
      const docxFilename = `KAR_${id}_${timestamp}.docx`;

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
    const updatedKAR = await KARService.update(id, payload);

    if (!updatedKAR) {
      return res.status(404).json({ message: 'KAR not found' });
    }

    return successResponse(res, updatedKAR);
  }

  async deleteById(req, res) {
    const { id } = req.params;
    const data = await KARService.deleteById(id);

    if (!data) {
      return res.status(404).json({ message: 'KAR not found' });
    }

    return successResponse(res, data);
  }
}

export default new KARController();
