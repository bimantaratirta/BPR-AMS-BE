import { createdResponse, successResponse } from '../../utils/response.js';
import PROCIMService from './PROCIM-service.js';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { exec } from 'child_process';
import fs from 'fs';
import { formatRupiahDenganHuruf } from '../../utils/formatTerbilangRupiah.js';
import { formatRupiah } from '../../utils/formatRupiah.js';
import { getHariDalamBahasaIndonesia } from '../../utils/getHariDalamBahasaIndonesia.js';
import getYear from '../../utils/getYear.js';

class PROCIMController {
  async get(req, res) {
    const { page, limit } = req.query;
    const datas = await PROCIMService.getAll(page, limit);
    return successResponse(res, datas);
  }

  async getById(req, res) {
    const { id } = req.params;
    const data = await PROCIMService.getById(id);

    if (!data) {
      return res.status(404).json({ message: 'PROCIM not found' });
    }

    return successResponse(res, data);
  }

  async post(req, res) {
    const {
      nomor_surat,
      tanggal_surat_persetujuan_kredit,
      nama_debitur,
      nik_debitur,
      status_debitur,
      tempat_lahir_debitur,
      tanggal_lahir_debitur,
      alamat_rumah_debitur,
      nama_penjamin,
      nik_penjamin,
      tempat_lahir_penjamin,
      tanggal_lahir_penjamin,
      alamat_rumah_penjamin,
      // nama_SHM,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      rekening_pinjaman,
      nominal_angsuran,
      tenggat_angsuran,
      tanggal_angsuran_pertama,
      barang_elektronik,
      barang_furniture,
      barang_jaminan_lainnya,
      is_submitted,
    } = req.body;

    const userID = req.app.locals.user;

    const newPROCIM = await PROCIMService.create({
      nomor_surat,
      tanggal_surat_persetujuan_kredit,
      nama_debitur,
      nik_debitur,
      status_debitur,
      tempat_lahir_debitur,
      tanggal_lahir_debitur,
      alamat_rumah_debitur,
      nama_penjamin,
      nik_penjamin,
      tempat_lahir_penjamin,
      tanggal_lahir_penjamin,
      alamat_rumah_penjamin,
      // nama_SHM,
      nominal_pinjaman,
      bunga_pinjaman,
      jangka_waktu,
      rekening_pinjaman,
      nominal_angsuran,
      tenggat_angsuran,
      tanggal_angsuran_pertama,
      barang_elektronik,
      barang_furniture,
      barang_jaminan_lainnya,
      is_submitted,
      userID,
    });

    if (!newPROCIM) {
      throw Error('Failed to create PROCIM');
    }

    return createdResponse(res, newPROCIM);
  }

  async generatePDF(req, res) {
    try {
      const { id } = req.params;
      const dbData = await PROCIMService.getById(id);

      if (!dbData) {
        return res.status(404).json({ message: 'FLEKSI not found' });
      }

      const tanggal = new Date(dbData.tanggal_surat_persetujuan_kredit);
      const tanggal1 = new Date(dbData.tanggal_lahir_debitur);
      const tanggal2 = new Date(dbData.tanggal_angsuran_pertama);
      const tanggal3 = new Date(dbData.tanggal_lahir_penjamin);
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

      const formatNominalPinjaman = `${formatRupiahDenganHuruf(
        dbData.nominal_pinjaman
      )}`;

      const formatNominalAngsuran = `${formatRupiah(dbData.nominal_angsuran)}`;

      //table
      const elektronik = dbData.barang_elektronik.map((item, index) => ({
        no: index + 1,
        nama_barang: item.nama_barang,
        tipe: item.tipe,
        harga: formatRupiah(item.harga),
      }));
      const furniture = dbData.barang_furniture.map((item, index) => ({
        no: index + 1,
        nama_barang: item.nama_barang,
        tipe: item.tipe,
        harga: formatRupiah(item.harga),
      }));
      function numberToAlphabet(n) {
        return String.fromCharCode(96 + n);
      }
      const barangJaminanLainnya = dbData.barang_jaminan_lainnya.map(
        (item, index) => ({
          no: numberToAlphabet(index + 3), // mulai dari 'd'
          nama_barang: item.nama_barang,
        })
      );

      const data = {
        hari: getHariDalamBahasaIndonesia(formattedTanggal),
        tahun_surat: getYear(formattedTanggal),
        tenggat_angsuran: dbData.tenggat_angsuran,
        nomor_surat: dbData.nomor_surat,
        tanggal_surat_persetujuan_kredit: formattedTanggal,
        nama_debitur: dbData.nama_debitur,
        tempat_lahir_debitur: dbData.tempat_lahir_debitur,
        tanggal_lahir_debitur: formattedTanggal1,
        alamat_debitur: dbData.alamat_rumah_debitur,
        no_ktp_debitur: dbData.nik_debitur,
        nominal_plafond: formatNominalPinjaman,
        suku_bunga_pinjaman: dbData.bunga_pinjaman,
        jangka_waktu_pinjaman: dbData.jangka_waktu,
        angsuran_pinjaman: formatNominalAngsuran,
        tanggal_angsuran_pertama: formattedTanggal2,
        nomor_rekening_pinjaman: dbData.rekening_pinjaman,
        nama_penjamin: dbData.nama_penjamin,
        tempat_lahir_penjamin: dbData.tempat_lahir_penjamin,
        tanggal_lahir_penjamin: formattedTanggal3,
        alamat_penjamin: dbData.alamat_rumah_penjamin,
        no_ktp_penjamin: dbData.nik_penjamin,
        barang_elektronik: elektronik,
        barang_furniture: furniture,
        barang_jaminan_lainnya: barangJaminanLainnya,
      };

      const templatePath = path.resolve('src/templates/', 'PROCIM.docx');

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
      const docxFilename = `PROCIM_${id}_${timestamp}.docx`;
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
      const dbData = await PROCIMService.getById(id);

      if (!dbData) {
        return res.status(404).json({ message: 'FLEKSI not found' });
      }

      const tanggal = new Date(dbData.tanggal_surat_persetujuan_kredit);
      const tanggal1 = new Date(dbData.tanggal_lahir_debitur);
      const tanggal2 = new Date(dbData.tanggal_angsuran_pertama);
      const tanggal3 = new Date(dbData.tanggal_lahir_penjamin);
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

      const formatNominalPinjaman = `${formatRupiahDenganHuruf(
        dbData.nominal_pinjaman
      )}`;

      const formatNominalAngsuran = `${formatRupiah(dbData.nominal_angsuran)}`;

      //table
      const elektronik = dbData.barang_elektronik.map((item, index) => ({
        no: index + 1,
        nama_barang: item.nama_barang,
        tipe: item.tipe,
        harga: formatRupiah(item.harga),
      }));
      const furniture = dbData.barang_furniture.map((item, index) => ({
        no: index + 1,
        nama_barang: item.nama_barang,
        tipe: item.tipe,
        harga: formatRupiah(item.harga),
      }));
      function numberToAlphabet(n) {
        return String.fromCharCode(96 + n);
      }
      const barangJaminanLainnya = dbData.barang_jaminan_lainnya.map(
        (item, index) => ({
          no: numberToAlphabet(index + 3), // mulai dari 'd'
          nama_barang: item.nama_barang,
        })
      );

      const data = {
        hari: getHariDalamBahasaIndonesia(formattedTanggal),
        tahun_surat: getYear(formattedTanggal),
        tenggat_angsuran: dbData.tenggat_angsuran,
        nomor_surat: dbData.nomor_surat,
        tanggal_surat_persetujuan_kredit: formattedTanggal,
        nama_debitur: dbData.nama_debitur,
        tempat_lahir_debitur: dbData.tempat_lahir_debitur,
        tanggal_lahir_debitur: formattedTanggal1,
        alamat_debitur: dbData.alamat_rumah_debitur,
        no_ktp_debitur: dbData.nik_debitur,
        nominal_plafond: formatNominalPinjaman,
        suku_bunga_pinjaman: dbData.bunga_pinjaman,
        jangka_waktu_pinjaman: dbData.jangka_waktu,
        angsuran_pinjaman: formatNominalAngsuran,
        tanggal_angsuran_pertama: formattedTanggal2,
        nomor_rekening_pinjaman: dbData.rekening_pinjaman,
        nama_penjamin: dbData.nama_penjamin,
        tempat_lahir_penjamin: dbData.tempat_lahir_penjamin,
        tanggal_lahir_penjamin: formattedTanggal3,
        alamat_penjamin: dbData.alamat_rumah_penjamin,
        no_ktp_penjamin: dbData.nik_penjamin,
        barang_elektronik: elektronik,
        barang_furniture: furniture,
        barang_jaminan_lainnya: barangJaminanLainnya,
      };

      const templatePath = path.resolve('src/templates/', 'PROCIM.docx');

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
      const docxFilename = `PROCIM_${id}_${timestamp}.docx`;

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
    const updatedPROCIM = await PROCIMService.update(id, payload);

    if (!updatedPROCIM) {
      return res.status(404).json({ message: 'PROCIM not found' });
    }

    return successResponse(res, updatedPROCIM);
  }

  async deleteById(req, res) {
    const { id } = req.params;
    const data = await PROCIMService.deleteById(id);

    if (!data) {
      return res.status(404).json({ message: 'PROCIM not found' });
    }

    return successResponse(res, data);
  }
}

export default new PROCIMController();
