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

      const isCustomerDataComplete =
        customer.name &&
        customer.ktp_number &&
        customer.date_of_birth &&
        customer.address &&
        customer.rt_rw &&
        customer.village &&
        customer.phone_number &&
        (customer.employee_id ||
          customer.non_employee_id ||
          customer.business_id);

      if (!isCustomerDataComplete) {
        throw BaseError.badRequest(
          "Customer data is incomplete. Cannot create report."
        );
      }

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
          // process: { in: processMap[currentUser.role] || [] },
        }
      : null;

    const options = buildQueryOptions(reportQueryConfig, query, baseWhere);

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
    if (current.employee_id) return "Karyawan";
    if (current.non_employee_id) return "Pekerja Lepas";
    if (current.business_id) return "Wirausaha";
    return null;
  }
}

export default new ReportService();
