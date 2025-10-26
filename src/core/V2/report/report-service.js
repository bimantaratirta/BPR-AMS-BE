// modules/report/report-service.js
import BaseError from "../../../base_classes/base-error.js";
import { PrismaService } from "../../../common/service/prisma.service.js";
import S3Service from "../../../common/service/s3.service.js";
import { buildQueryOptions } from "../../../utils/buildQueryOptions.js";
import reportQueryConfig from "./report-query-config.js";
import ExcelJS from "exceljs";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 5; // selaras dengan multer

class ReportService {
  constructor() {
    this.prisma = new PrismaService();
    this.s3Service = new S3Service();
  }

  async generateXlsx({ currentUser, query }) {
    const selectedMonth = query.month || "October"; // Bulan yang dipilih oleh pengguna, default "October"
    const selectedYear = query.year || "2025"; // Tahun yang dipilih oleh pengguna, default "2025"

    // Data dummy untuk nasabah (untuk semua sheet)
    const nasabahData = [
      {
        created_at: "2025-01-23",
        customer_name: "Christopher Gibbs",
        address: "2689 Barbara Run, Lake Robert, DE 74712",
        rt_rw: "009/009",
        village: "East Johnmouth",
        employment: "Retail buyer",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-08-11",
        customer_name: "Brent Bell III",
        address: "1749 Kaylee Port Apt. 436, Walkerfort, ID 13821",
        rt_rw: "008/007",
        village: "West Rickyton",
        employment: null,
        business: "Montgomery LLC",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-01-12",
        customer_name: "William Long",
        address: "PSC 4996, Box 9800, APO AE 87285",
        rt_rw: "003/005",
        village: "Brooksberg",
        employment: "Information systems manager",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-05-10",
        customer_name: "Luke Franklin",
        address: "745 Lisa Throughway Apt. 955, Krystalstad, IL 48572",
        rt_rw: "007/004",
        village: "Curtiston",
        employment: null,
        business: "Cook-Rivera",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-02-07",
        customer_name: "Morgan Barnes",
        address: "5244 Mccall Estates Suite 372, Heathtown, MS 94487",
        rt_rw: "010/002",
        village: "Johnfort",
        employment: null,
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-07-19",
        customer_name: "Ava Mason",
        address: "1786 Travis Ranch, Hinesfort, CA 94577",
        rt_rw: "001/005",
        village: "Newport",
        employment: "Software Engineer",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-06-04",
        customer_name: "Dylan Brooks",
        address: "2094 Dalton Highway, Oakstone, TX 54680",
        rt_rw: "010/002",
        village: "Barrett",
        employment: null,
        business: "Byte Dynamics",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-03-15",
        customer_name: "Olivia Scott",
        address: "3694 Oakwood Drive, Parkston, NJ 30974",
        rt_rw: "005/003",
        village: "Eastbridge",
        employment: "Project Manager",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-05-25",
        customer_name: "Liam Cooper",
        address: "2873 Glenwood Way, Westford, OH 22568",
        rt_rw: "002/001",
        village: "Silverlake",
        employment: null,
        business: "Global Tech",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-04-18",
        customer_name: "Sophia Harris",
        address: "9812 Maple Road, Greenview, MA 93200",
        rt_rw: "004/009",
        village: "Clearwater",
        employment: "Product Designer",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-01-23",
        customer_name: "Christopher Gibbs",
        address: "2689 Barbara Run, Lake Robert, DE 74712",
        rt_rw: "009/009",
        village: "East Johnmouth",
        employment: "Retail buyer",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-08-11",
        customer_name: "Brent Bell III",
        address: "1749 Kaylee Port Apt. 436, Walkerfort, ID 13821",
        rt_rw: "008/007",
        village: "West Rickyton",
        employment: null,
        business: "Montgomery LLC",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-01-12",
        customer_name: "William Long",
        address: "PSC 4996, Box 9800, APO AE 87285",
        rt_rw: "003/005",
        village: "Brooksberg",
        employment: "Information systems manager",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-05-10",
        customer_name: "Luke Franklin",
        address: "745 Lisa Throughway Apt. 955, Krystalstad, IL 48572",
        rt_rw: "007/004",
        village: "Curtiston",
        employment: null,
        business: "Cook-Rivera",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-02-07",
        customer_name: "Morgan Barnes",
        address: "5244 Mccall Estates Suite 372, Heathtown, MS 94487",
        rt_rw: "010/002",
        village: "Johnfort",
        employment: null,
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-07-19",
        customer_name: "Ava Mason",
        address: "1786 Travis Ranch, Hinesfort, CA 94577",
        rt_rw: "001/005",
        village: "Newport",
        employment: "Software Engineer",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-06-04",
        customer_name: "Dylan Brooks",
        address: "2094 Dalton Highway, Oakstone, TX 54680",
        rt_rw: "010/002",
        village: "Barrett",
        employment: null,
        business: "Byte Dynamics",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-03-15",
        customer_name: "Olivia Scott",
        address: "3694 Oakwood Drive, Parkston, NJ 30974",
        rt_rw: "005/003",
        village: "Eastbridge",
        employment: "Project Manager",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-05-25",
        customer_name: "Liam Cooper",
        address: "2873 Glenwood Way, Westford, OH 22568",
        rt_rw: "002/001",
        village: "Silverlake",
        employment: null,
        business: "Global Tech",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-04-18",
        customer_name: "Sophia Harris",
        address: "9812 Maple Road, Greenview, MA 93200",
        rt_rw: "004/009",
        village: "Clearwater",
        employment: "Product Designer",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-01-17",
        customer_name: "Ethan James",
        address: "4726 Logan Parkway, Eastland, TX 78629",
        rt_rw: "010/003",
        village: "Lakeside",
        employment: "Architect",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-06-28",
        customer_name: "Mason Edwards",
        address: "3845 Granite Blvd, Glenwood, OH 65528",
        rt_rw: "008/004",
        village: "Westview",
        employment: null,
        business: "Fox Industries",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-03-29",
        customer_name: "Lucas Wright",
        address: "5650 Valley Ridge Road, Meadowview, IL 48530",
        rt_rw: "009/001",
        village: "Sunnydale",
        employment: "Marketing Specialist",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-08-02",
        customer_name: "Isabella Brooks",
        address: "3721 Meadowhill Avenue, Riverton, UT 65129",
        rt_rw: "006/008",
        village: "Riverwood",
        employment: null,
        business: "Tech Solutions",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-09-10",
        customer_name: "Benjamin Clark",
        address: "1125 Greenway Street, Mountville, PA 83102",
        rt_rw: "003/008",
        village: "Cedar Hills",
        employment: "Business Analyst",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-07-10",
        customer_name: "Charlotte Smith",
        address: "1227 Alpine Blvd, Riverbrook, KS 41534",
        rt_rw: "007/003",
        village: "Springfield",
        employment: null,
        business: "GreenTech Innovations",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-04-22",
        customer_name: "Amelia Moore",
        address: "3765 Harbor Point, Clifftown, TX 54321",
        rt_rw: "004/002",
        village: "Coastline",
        employment: "Nurse",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-06-15",
        customer_name: "Henry Harris",
        address: "2453 Cypress Street, Newtown, CO 76432",
        rt_rw: "008/001",
        village: "Woodland",
        employment: null,
        business: "SunTech Enterprises",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-05-04",
        customer_name: "Jacob Adams",
        address: "1245 Oak Street, Hilltop, CA 23654",
        rt_rw: "005/006",
        village: "Silver Valley",
        employment: "Electrical Engineer",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-09-03",
        customer_name: "Ella Morgan",
        address: "5567 Birch Avenue, Greenfield, NJ 83219",
        rt_rw: "009/002",
        village: "Riverstone",
        employment: null,
        business: "Global Industries",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-07-01",
        customer_name: "Matthew Williams",
        address: "2458 Sandstone Road, Hillcrest, NY 76341",
        rt_rw: "003/009",
        village: "Pinewood",
        employment: "Financial Advisor",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-05-28",
        customer_name: "Mia Johnson",
        address: "3142 Pine Valley Drive, Summit, CA 38570",
        rt_rw: "010/005",
        village: "Highland",
        employment: null,
        business: "Creative Solutions",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-04-12",
        customer_name: "Sophia Turner",
        address: "6578 Redwood Street, Lakeside, IL 76890",
        rt_rw: "006/004",
        village: "Silver Beach",
        employment: "Marketing Executive",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-02-24",
        customer_name: "Benjamin Lee",
        address: "8123 Maple Street, Treetown, TX 65928",
        rt_rw: "001/002",
        village: "Riverside",
        employment: null,
        business: "Tech Innovations",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-08-25",
        customer_name: "Jackson Taylor",
        address: "1024 Spruce Avenue, Greenfield, MA 98451",
        rt_rw: "009/008",
        village: "Lakeview",
        employment: null,
        business: "Design Studios",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-07-30",
        customer_name: "Harper Scott",
        address: "2859 Cedarwood Drive, Brightwood, CO 50361",
        rt_rw: "003/007",
        village: "Redwood Heights",
        employment: "Human Resources Manager",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-06-08",
        customer_name: "Lily Mitchell",
        address: "5932 Pinewood Road, Hillcrest, TX 47126",
        rt_rw: "007/002",
        village: "Hill Valley",
        employment: null,
        business: "Media Works",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-03-10",
        customer_name: "Evelyn Rodriguez",
        address: "4185 Oceanfront Blvd, Clearwater, FL 32211",
        rt_rw: "002/008",
        village: "Beachside",
        employment: "Nurse Practitioner",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-01-19",
        customer_name: "Jacob Walker",
        address: "3445 Mountainview Drive, Brightfield, IL 62473",
        rt_rw: "005/002",
        village: "Hilltown",
        employment: null,
        business: "HealthTech Solutions",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-07-22",
        customer_name: "Mason Nelson",
        address: "2945 Sunset Blvd, Oceanview, CA 84290",
        rt_rw: "004/003",
        village: "Silver Springs",
        employment: null,
        business: "Retail Enterprises",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-09-01",
        customer_name: "Zoe Robinson",
        address: "3745 Lakeshore Drive, Oakwood, MI 76540",
        rt_rw: "009/004",
        village: "Greenstone",
        employment: "Content Writer",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-05-09",
        customer_name: "Aiden Perez",
        address: "2339 Birchwood Road, Springdale, NY 45531",
        rt_rw: "008/003",
        village: "Forest Heights",
        employment: null,
        business: "Prime Solutions",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-06-21",
        customer_name: "Charlotte Phillips",
        address: "1097 Willow Way, Greenfield, NJ 92456",
        rt_rw: "007/006",
        village: "Westwood",
        employment: "Real Estate Agent",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-05-14",
        customer_name: "Liam Carter",
        address: "4621 Willowbrook Drive, Lakeside, OH 73249",
        rt_rw: "006/005",
        village: "Clearwater",
        employment: null,
        business: "Finance Solutions",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-04-20",
        customer_name: "Nora Green",
        address: "3746 Laurel Road, Newtown, CT 67432",
        rt_rw: "003/004",
        village: "Mapleton",
        employment: "Mechanical Engineer",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-03-28",
        customer_name: "Luna Bennett",
        address: "5246 Ocean Blvd, Bayside, CA 89512",
        rt_rw: "010/001",
        village: "Bayview",
        employment: null,
        business: "Bayside Ventures",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      {
        created_at: "2025-02-18",
        customer_name: "James King",
        address: "2315 Pine Street, Hilltop, TX 45123",
        rt_rw: "002/007",
        village: "Edgewood",
        employment: "Software Developer",
        business: null,
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Active",
      },
      {
        created_at: "2025-09-05",
        customer_name: "Eleanor Walker",
        address: "5641 Grandview Blvd, Westport, OH 34965",
        rt_rw: "009/005",
        village: "Parkwood",
        employment: null,
        business: "Horizon Logistics",
        salary_frequency: "Bulanan",
        lo: "LO Name",
        slo: "SLO Name",
        am: "AM Name",
        status: "Inactive",
      },
      // Tambahkan data nasabah lainnya di sini
    ];

    // Membuat workbook baru
    const workbook = new ExcelJS.Workbook();

    // Fungsi untuk menambahkan worksheet
    const addWorksheet = (sheetName) => {
      const worksheet = workbook.addWorksheet(sheetName);

      // Menambahkan Header: "DATA KUNJUNGAN PMS"
      worksheet.mergeCells("A1:M1");
      const headerCell = worksheet.getCell("A1");
      headerCell.value = "DATA KUNJUNGAN PMS";
      headerCell.font = { bold: true, size: 16 };
      headerCell.alignment = { horizontal: "center", vertical: "middle" };

      // Menambahkan header untuk kolom
      worksheet.mergeCells("A2:A3");
      worksheet.getCell("A2").value = "NO";
      worksheet.getCell("A2").font = { bold: true, size: 11 };
      worksheet.getCell("A2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("B2:B3");
      worksheet.getCell("B2").value = "TANGGAL";
      worksheet.getCell("B2").font = { bold: true, size: 11 };
      worksheet.getCell("B2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("C2:C3");
      worksheet.getCell("C2").value = "NAMA LENGKAP";
      worksheet.getCell("C2").font = { bold: true, size: 11 };
      worksheet.getCell("C2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Menambahkan header "DOMISILI" di baris ke-3 dan merge
      worksheet.mergeCells("D2:F2");
      worksheet.getCell("D2").value = "DOMISILI";
      worksheet.getCell("D2").font = { bold: true, size: 11 };
      worksheet.getCell("D2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Menambahkan sub-header untuk DOMISILI
      worksheet.getCell("D3").value = "ALAMAT";
      worksheet.getCell("D3").font = { bold: true, size: 11 };
      worksheet.getCell("E3").value = "RT/RW";
      worksheet.getCell("E3").font = { bold: true, size: 11 };
      worksheet.getCell("F3").value = "DESA";
      worksheet.getCell("F3").font = { bold: true, size: 11 };

      worksheet.mergeCells("G2:G3");
      worksheet.getCell("G2").value = "PEKERJAAN";
      worksheet.getCell("G2").font = { bold: true, size: 11 };
      worksheet.getCell("G2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("H2:H3");
      worksheet.getCell("H2").value = "USAHA";
      worksheet.getCell("H2").font = { bold: true, size: 11 };
      worksheet.getCell("H2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("I2:I3");
      worksheet.getCell("I2").value = "PENDAPATAN";
      worksheet.getCell("I2").font = { bold: true, size: 11 };
      worksheet.getCell("I2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("J2:J3");
      worksheet.getCell("J2").value = "LO";
      worksheet.getCell("J2").font = { bold: true, size: 11 };
      worksheet.getCell("J2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("K2:K3");
      worksheet.getCell("K2").value = "SLO";
      worksheet.getCell("K2").font = { bold: true, size: 11 };
      worksheet.getCell("K2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("L2:L3");
      worksheet.getCell("L2").value = "AM";
      worksheet.getCell("L2").font = { bold: true, size: 11 };
      worksheet.getCell("L2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("M2:M3");
      worksheet.getCell("M2").value = "STATUS";
      worksheet.getCell("M2").font = { bold: true, size: 11 };
      worksheet.getCell("M2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Menambahkan data nasabah
      nasabahData.forEach((nasabah, index) => {
        worksheet.addRow([
          index + 1,
          nasabah.created_at,
          nasabah.customer_name,
          nasabah.address,
          nasabah.rt_rw,
          nasabah.village,
          nasabah.employment ?? " - ",
          nasabah.business ?? " - ",
          nasabah.salary_frequency,
          nasabah.lo,
          nasabah.slo,
          nasabah.am,
          nasabah.status,
        ]);
      });

      // Menentukan lebar kolom (menyesuaikan panjang data)
      worksheet.getColumn(1).width = 5; // No
      worksheet.getColumn(2).width = 15; // Tanggal
      worksheet.getColumn(3).width = 25; // Nama Lengkap
      worksheet.getColumn(4).width = 35; // DOMISILI (ALAMAT)
      worksheet.getColumn(5).width = 15; // RT/RW
      worksheet.getColumn(6).width = 20; // Desa
      worksheet.getColumn(7).width = 20; // Pekerjaan
      worksheet.getColumn(8).width = 20; // Usaha
      worksheet.getColumn(9).width = 15; // Pendapatan
      worksheet.getColumn(10).width = 15; // LO
      worksheet.getColumn(11).width = 15; // SLO
      worksheet.getColumn(12).width = 15; // AM
      worksheet.getColumn(13).width = 10; // Status
    };

    // Tambahkan sheet berdasarkan bulan dan minggu
    addWorksheet(selectedMonth); // Bulan yang dipilih untuk sheet pertama

    // Menambahkan sheet untuk minggu-minggu berikutnya
    for (let i = 1; i <= 4; i++) {
      addWorksheet(`${selectedMonth} Minggu ${i}`);
    }

    // Menghasilkan file XLSX sebagai buffer (tanpa menyimpan ke disk)
    const xlsxBuffer = await workbook.xlsx.writeBuffer();

    return xlsxBuffer; // Mengembalikan buffer file XLSX
  }

  async create(data, files = [], currentUser) {
    if (!Array.isArray(files))
      throw BaseError.badRequest("files must be an array");
    if (files.length > MAX_FILES)
      throw BaseError.badRequest(`too many files, max ${MAX_FILES}`);
    for (const f of files) {
      if (!f || typeof f !== "object")
        throw BaseError.badRequest("invalid file payload");
      if (f.mimetype && !ALLOWED_MIME.has(f.mimetype)) {
        throw BaseError.badRequest(`unsupported mimetype: ${f.mimetype}`);
      }
      if (typeof f.size === "number" && f.size > MAX_FILE_SIZE_BYTES) {
        throw BaseError.badRequest(
          `file too large (> ${MAX_FILE_SIZE_BYTES} bytes)`
        );
      }
    }

    // 2) Upload dulu
    let uploaded = [];
    if (files.length) {
      uploaded = await Promise.all(
        files.map((f) => this.s3Service.uploadFile(f, "reports"))
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // 3a) Ambil customer + relasi
      const customer = await tx.customer.findUnique({
        where: { id: data.customer_id },
        include: {
          employee: true,
          non_employee: true,
          business: true,
          user: true,
        },
      });
      if (!customer) throw BaseError.badRequest("Customer not found");

      // 3b) Pastikan hanya satu profil kerja yang ter-link
      const links = [
        customer.employee_id ? "employee" : null,
        customer.non_employee_id ? "non_employee" : null,
        customer.business_id ? "business" : null,
      ].filter(Boolean);
      if (links.length > 1) {
        throw BaseError.badRequest(
          `Customer has multiple work profiles: ${links.join(", ")}`
        );
      }

      // 3c) Resolve LO→SLO→AM dari chain supervisor
      const loUser = await tx.user.findFirst({
        where: { id: customer.created_by, role: "LO" },
      });
      if (!loUser) throw BaseError.badRequest("LO not found for this customer");
      const sloUser = await tx.user.findFirst({
        where: { id: loUser.supervisor_id, role: "SLO" },
      });
      if (!sloUser) throw BaseError.badRequest("SLO not found for this LO");
      const amUser = await tx.user.findFirst({
        where: { id: sloUser.supervisor_id, role: "AM" },
      });
      if (!amUser) throw BaseError.badRequest("AM not found for this SLO");

      // Optional: enforce hanya LO terkait yang boleh create
      // if (!currentUser || currentUser.id !== loUser.id || currentUser.role !== 'LO') {
      //   throw BaseError.forbidden('Only responsible LO can create this report');
      // }

      // 3d) Build snapshots
      const customer_snapshot = {
        id: customer.id,
        name: customer.name,
        ktp_number: customer.ktp_number,
        date_of_birth: customer.date_of_birth,
        address: customer.address,
        rt_rw: customer.rt_rw,
        village: customer.village,
        phone_number: customer.phone_number,
        employee_id: customer.employee_id,
        non_employee_id: customer.non_employee_id,
        business_id: customer.business_id,
        work_type: this._inferWorkTypeFromCurrent(customer),
        created_by: customer.created_by,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
      };
      const employee_snapshot = customer.employee
        ? {
            id: customer.employee.id,
            company_name: customer.employee.company_name,
            company_address: customer.employee.company_address,
            company_phone: customer.employee.company_phone,
            position: customer.employee.position,
            occupation:
              customer.employee.work ?? customer.employee.position ?? null,
            salary: customer.employee.salary ?? null,
            created_at: customer.employee.created_at,
            updated_at: customer.employee.updated_at,
          }
        : null;
      const non_employee_snapshot = customer.non_employee
        ? {
            id: customer.non_employee.id,
            occupation: customer.non_employee.work ?? null,
            salary_frequency: customer.non_employee.salary_frequency ?? null,
            salary: customer.non_employee.salary ?? null,
            created_at: customer.non_employee.created_at,
            updated_at: customer.non_employee.updated_at,
          }
        : null;
      const business_snapshot = customer.business
        ? {
            id: customer.business.id,
            business_type: customer.business.business_type ?? null,
            employee_count: customer.business.employee_count ?? null,
            revenue: customer.business.revenue ?? null,
            created_at: customer.business.created_at,
            updated_at: customer.business.updated_at,
          }
        : null;

      // 3e) Map process dari status (tetap kompatibel dengan skema kamu)
      const mappedProcess =
        data.status === "GOOD"
          ? "REVIEW_SLO"
          : data.status === "BAD"
          ? "DECLINE_LO"
          : null;

      // 3f) Enrich untuk validasi persist
      const enriched = {
        customer_id: customer.id,
        lo_id: loUser.id,
        slo_id: sloUser.id,
        am_id: amUser.id,
        status: data.status,
        process: mappedProcess,
        customer_snapshot,
        employee_snapshot,
        non_employee_snapshot,
        business_snapshot,
      };

      const report = await tx.report.create({ data: enriched });

      // 3i) Simpan photos
      if (uploaded.length) {
        await tx.reportPhoto.createMany({
          data: uploaded.map((u, idx) => ({
            report_id: report.id,
            url: u,
          })),
        });
      }

      const full = await tx.report.findUnique({
        where: { id: report.id },
        include: { report_photo: true },
      });

      return full;
    });

    return result;
  }

  async update(id, data, files = [], currentUser) {
    // 1) Validasi file cepat (selaras dengan create)
    if (!Array.isArray(files))
      throw BaseError.badRequest("files must be an array");
    if (files.length > MAX_FILES)
      throw BaseError.badRequest(`too many files, max ${MAX_FILES}`);

    for (const f of files) {
      if (!f || typeof f !== "object")
        throw BaseError.badRequest("invalid file payload");
      if (f.mimetype && !ALLOWED_MIME.has(f.mimetype)) {
        throw BaseError.badRequest(`unsupported mimetype: ${f.mimetype}`);
      }
      const size = typeof f.size === "number" ? f.size : f.buffer?.length ?? 0;
      if (size > MAX_FILE_SIZE_BYTES) {
        throw BaseError.badRequest(
          `file too large (> ${MAX_FILE_SIZE_BYTES} bytes)`
        );
      }
    }

    // 2) Upload di luar transaksi
    let uploaded = [];
    if (files.length) {
      uploaded = await Promise.all(
        files.map((f) => this.s3Service.uploadFile(f, "reports"))
      );
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // 3a) Ambil report saat ini
        const current = await tx.report.findUnique({
          where: { id },
          include: { report_photo: true },
        });
        if (!current) throw BaseError.notFound("Report not found");

        // 3b) Tentukan apakah customer_id berubah
        const targetCustomerId =
          data.customer_id ?? current.customer_id ?? null;
        const customerChanged =
          targetCustomerId && targetCustomerId !== current.customer_id;

        // 3c) Siapkan variabel hasil resolusi
        let loUserId = current.lo_id ?? null;
        let sloUserId = current.slo_id ?? null;
        let amUserId = current.am_id ?? null;

        let customer_snapshot = current.customer_snapshot;
        let employee_snapshot = current.employee_snapshot ?? null;
        let non_employee_snapshot = current.non_employee_snapshot ?? null;
        let business_snapshot = current.business_snapshot ?? null;

        // 3d) Jika customer berubah, refresh snapshot + chain LO→SLO→AM
        if (customerChanged) {
          const customer = await tx.customer.findUnique({
            where: { id: targetCustomerId },
            include: {
              employee: true,
              non_employee: true,
              business: true,
              user: true,
            },
          });
          if (!customer) throw BaseError.badRequest("Customer not found");

          const links = [
            customer.employee_id ? "employee" : null,
            customer.non_employee_id ? "non_employee" : null,
            customer.business_id ? "business" : null,
          ].filter(Boolean);
          if (links.length > 1) {
            throw BaseError.badRequest(
              `Customer has multiple work profiles: ${links.join(", ")}`
            );
          }

          const loUser = await tx.user.findFirst({
            where: { id: customer.created_by, role: "LO" },
          });
          if (!loUser)
            throw BaseError.badRequest("LO not found for this customer");
          const sloUser = await tx.user.findFirst({
            where: { id: loUser.supervisor_id, role: "SLO" },
          });
          if (!sloUser) throw BaseError.badRequest("SLO not found for this LO");
          const amUser = await tx.user.findFirst({
            where: { id: sloUser.supervisor_id, role: "AM" },
          });
          if (!amUser) throw BaseError.badRequest("AM not found for this SLO");

          loUserId = loUser.id;
          sloUserId = sloUser.id;
          amUserId = amUser.id;

          customer_snapshot = {
            id: customer.id,
            name: customer.name,
            ktp_number: customer.ktp_number,
            date_of_birth: customer.date_of_birth,
            address: customer.address,
            rt_rw: customer.rt_rw,
            village: customer.village,
            phone_number: customer.phone_number,
            employee_id: customer.employee_id,
            non_employee_id: customer.non_employee_id,
            business_id: customer.business_id,
            work_type: this._inferWorkTypeFromCurrent?.(customer) ?? null,
            created_by: customer.created_by,
            created_at: customer.created_at,
            updated_at: customer.updated_at,
          };

          employee_snapshot = customer.employee
            ? {
                id: customer.employee.id,
                company_name: customer.employee.company_name,
                company_address: customer.employee.company_address,
                company_phone: customer.employee.company_phone,
                position: customer.employee.position,
                occupation:
                  customer.employee.work ?? customer.employee.position ?? null,
                salary: customer.employee.salary ?? null,
                created_at: customer.employee.created_at,
                updated_at: customer.employee.updated_at,
              }
            : null;

          non_employee_snapshot = customer.non_employee
            ? {
                id: customer.non_employee.id,
                occupation: customer.non_employee.work ?? null,
                salary_frequency:
                  customer.non_employee.salary_frequency ?? null,
                salary: customer.non_employee.salary ?? null,
                created_at: customer.non_employee.created_at,
                updated_at: customer.non_employee.updated_at,
              }
            : null;

          business_snapshot = customer.business
            ? {
                id: customer.business.id,
                business_type: customer.business.business_type ?? null,
                employee_count: customer.business.employee_count ?? null,
                revenue: customer.business.revenue ?? null,
                created_at: customer.business.created_at,
                updated_at: customer.business.updated_at,
              }
            : null;
        }

        // 3e) Status & process
        const nextStatus = data.status ?? current.status;
        let nextProcess;

        if (typeof data.process !== "undefined") {
          // hormati process eksplisit jika kamu memang ingin mengizinkannya
          nextProcess = data.process;
        } else if (nextStatus !== current.status) {
          nextProcess =
            nextStatus === "GOOD"
              ? "SEND_SLO"
              : nextStatus === "NO_GOOD"
              ? "DECLINE_SLO"
              : null; // DRAFT
        } else {
          nextProcess = current.process ?? null;
        }

        // 3f) Build data update
        const updateData = {
          customer_id: targetCustomerId,
          lo_id: loUserId,
          slo_id: sloUserId,
          am_id: amUserId,
          status: nextStatus,
          process: nextProcess,
          // snapshots: refresh jika customer berubah, jika tidak pakai snapshot yang lama
          customer_snapshot,
          employee_snapshot,
          non_employee_snapshot,
          business_snapshot,
          updated_at: new Date(),
        };

        // 3g) Update report
        const updated = await tx.report.update({
          where: { id: current.id },
          data: updateData,
        });

        // 3h) Tambahkan foto baru jika ada upload
        if (uploaded.length) {
          await tx.reportPhoto.createMany({
            data: uploaded.map((u, idx) => ({
              report_id: updated.id,
              url: u, // kamu saat create juga menyimpan "url: u"; kalau uploadFile mengembalikan objek, ubah ke u.url
              sort_order: (current.report_photo?.length ?? 0) + idx,
            })),
          });
        }

        // 3i) Return lengkap
        const full = await tx.report.findUnique({
          where: { id: updated.id },
          include: { report_photo: true },
        });

        return full;
      });

      return result;
    } catch (err) {
      // Jika perlu cleanup upload saat gagal, tambahkan pemanggilan delete di sini
      // (saat ini kamu tidak menyimpan key, jadi tidak ada penghapusan S3 yang bisa diandalkan)
      throw err;
    }
  }

  async list({ currentUser, query } = {}) {
    const roleKeyMap = {
      LO: "lo_id",
      SLO: "slo_id",
      AM: "am_id",
    };

    const processMap = {
      LO: [
        "DECLINE_LO",
        "REVIEW_SLO",
        "DECLINE_REVIEW_SLO",
        "EVALUATION_SLO",
        "DECLINE_EVALUATION_SLO",
        "REVIEW_AM",
        "APPROVE_AM",
        "DECLINE_AM",
      ],
      SLO: [
        "REVIEW_SLO",
        "DECLINE_REVIEW_SLO",
        "EVALUATION_SLO",
        "DECLINE_EVALUATION_SLO",
        "REVIEW_AM",
        "APPROVE_AM",
        "DECLINE_AM",
      ],
      AM: ["REVIEW_AM", "APPROVE_AM", "DECLINE_AM"],
    };

    const key = roleKeyMap[currentUser.role] || null;

    const baseWhere = key
      ? {
          [key]: currentUser.id,
          process: { in: processMap[currentUser.role] || [] },
        }
      : null;

    const options = buildQueryOptions(reportQueryConfig, query, baseWhere);
    console.log("options: ", JSON.stringify(options, null, 2));
    const [hasil] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where: {},
      }),
    ]);

    // Filter secara manual nama yang mengandung 'bagus' (case-insensitive)
    const filteredResults = hasil.filter((report) =>
      report.customer_snapshot?.name.toLowerCase().includes("asd")
    );

    // console.log(options);

    const [data, count] = await Promise.all([
      this.prisma.report.findMany(options),
      this.prisma.report.count({ where: options.where }),
    ]);

    const page = query?.pagination?.page ?? 1;
    const limit = query?.pagination?.limit ?? 10;
    const hasPagination = !!(query?.pagination && !query?.get_all);
    const totalPages = hasPagination ? Math.ceil(count / limit) : 1;

    return {
      data,
      meta: hasPagination
        ? {
            totalItems: count,
            totalPages,
            currentPage: Number(page),
            itemsPerPage: Number(limit),
          }
        : null,
    };
  }

  async detail(id) {
    const item = await this.prisma.report.findUnique({
      where: { id },
      include: {
        lo: { select: { id: true, name: true } },
        slo: { select: { id: true, name: true } },
        am: { select: { id: true, name: true } },
        customer: true,
        report_photo: true,
        review_customer: true,
        evaluation: true,
      },
    });

    if (!item) throw BaseError.notFound("Report not found");

    console.log(item);

    return item;
  }

  async remove(id) {
    const existing = await this.prisma.report.findUnique({ where: { id } });
    if (!existing) throw BaseError.notFound("Report not found");
    const deleted = await this.prisma.report.delete({ where: { id } });
    return { message: "Report deleted successfully", data: deleted };
  }

  _inferWorkTypeFromCurrent(current) {
    if (current.employee_id) return "Karyawan Tetap";
    if (current.non_employee_id) return "Pekerja Lepas";
    if (current.business_id) return "Pengusaha";
    return null;
  }
}

export default new ReportService();
