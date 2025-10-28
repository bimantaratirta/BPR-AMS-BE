// services/customerService.js
import joi from "joi";
import BaseError from "../../../base_classes/base-error.js";
import { PrismaService } from "../../../common/service/prisma.service.js";
import { buildQueryOptions } from "../../../utils/buildQueryOptions.js";
import customerQueryConfig from "./customer-query-config.js";

class CustomerService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async create(data, user) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    const { customer, employee, non_employee, business } = data || {};

    if (user.role !== "LO") {
      throw BaseError.badRequest(
        `Only users with role LO can create customers`
      );
    }

    // Guard dasar
    if (!customer) {
      fail("Customer payload is required", "customer");
      throw new joi.ValidationError(validation, stack);
    }

    // Aturan konsistensi work_type ↔ payload
    const wt = customer.work_type; // 'Wirausaha' | 'Karyawan' | 'Pekerja Lepas' | undefined

    // Tidak boleh kirim lebih dari satu blok pekerjaan sekaligus
    const blocksProvided =
      (employee ? 1 : 0) + (non_employee ? 1 : 0) + (business ? 1 : 0);
    if (blocksProvided > 1) {
      fail(
        "Only one of employee, non_employee, or business may be provided",
        "work_block"
      );
    }

    // Jika work_type ada, harus cocok dengan blok yang dikirim
    if (wt) {
      if (wt === "Karyawan") {
        if (!employee)
          fail("Employee block is required for Karyawan", "employee");
        if (non_employee)
          fail(
            "non_employee block is not allowed for Karyawan",
            "non_employee"
          );
        if (business)
          fail("business block is not allowed for Karyawan", "business");
      } else if (wt === "Pekerja Lepas") {
        if (!non_employee)
          fail(
            "NonEmployee block is required for Pekerja Lepas",
            "non_employee"
          );
        if (employee)
          fail("employee block is not allowed for Pekerja Lepas", "employee");
        if (business)
          fail("business block is not allowed for Pekerja Lepas", "business");
      } else if (wt === "Wirausaha") {
        if (!business)
          fail("Business block is required for Wirausaha", "business");
        if (employee)
          fail("employee block is not allowed for Wirausaha", "employee");
        if (non_employee)
          fail(
            "non_employee block is not allowed for Wirausaha",
            "non_employee"
          );
      }
    } else {
      // Bila work_type tidak diisi, tidak boleh kirim blok pekerjaan/usaha
      if (employee || non_employee || business) {
        fail(
          "work_type is required when sending employee/non_employee/business block",
          "work_type"
        );
      }
    }

    if (validation) {
      throw new joi.ValidationError(validation, stack);
    }

    // Jalankan transaksi
    return this.prisma.$transaction(async (tx) => {
      let employeeData = null;
      let nonEmployeeData = null;
      let businessData = null;

      // Buat blok pekerjaan/usaha bila ada
      if (wt === "Karyawan" && employee) {
        employeeData = await tx.employee.create({ data: employee });
      }
      if (wt === "Pekerja Lepas" && non_employee) {
        nonEmployeeData = await tx.nonEmployee.create({ data: non_employee });
      }
      if (wt === "Wirausaha" && business) {
        businessData = await tx.business.create({ data: business });
      }

      // Buat customer — abaikan id yang datang dari body (kami set dari hasil create di atas)
      const customerData = await tx.customer.create({
        data: {
          name: customer.name,
          ktp_number: customer.ktp_number,
          date_of_birth: customer.date_of_birth ?? null,
          address: customer.address ?? null,
          rt_rw: customer.rt_rw ?? null,
          village: customer.village ?? null,
          phone_number: customer.phone_number ?? null,
          employee_id: employeeData?.id ?? null,
          non_employee_id: nonEmployeeData?.id ?? null,
          business_id: businessData?.id ?? null,
          // status bisa Anda set default di Prisma (DRAFT), atau isi manual di sini.
          // status: 'DRAFT',
          created_by: user?.id ?? null,
        },
        include: {
          employee: true,
          non_employee: true,
          business: true,
        },
      });

      return {
        ...customerData,
        work_type: wt ?? null, // echo kembali utk kemudahan klien
      };
    });
  }

  async list({ unitId, query } = {}) {
    // Scope ke pembuat data (created_by), bukan unit_id
    const options = buildQueryOptions(customerQueryConfig, query, {
      created_by: unitId,
    });

    const [data, count] = await Promise.all([
      this.prisma.customer.findMany(options),
      this.prisma.customer.count({ where: options.where }),
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

  async listCustomerByLo(id, { query } = {}) {
    // Scope ke pembuat data (created_by), bukan unit_id
    const options = buildQueryOptions(customerQueryConfig, query, {
      created_by: id,
    });

    const [data, count] = await Promise.all([
      this.prisma.customer.findMany(options),
      this.prisma.customer.count({ where: options.where }),
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
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        employee: true,
        non_employee: true,
        business: true,
        // report: {
        //   orderBy: { created_at: 'desc' },
        //   // include apa pun yang Anda perlukan; contoh minimal:
        //   select: {
        //     id: true,
        //     status: true,
        //     process: true,
        //     created_at: true,
        //   },
        // },
      },
    });
    if (!customer) throw BaseError.notFound("Customer not found");
    return { ...customer, work_type: this._inferWorkTypeFromCurrent(customer) };
  }

  async update(id, data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    const { customer, employee, non_employee, business } = data || {};
    if (!customer) {
      fail("Customer payload is required", "customer");
      throw new joi.ValidationError(validation, stack);
    }

    // Ambil current
    const current = await this.prisma.customer.findUnique({
      where: { id },
      include: { employee: true, non_employee: true, business: true },
    });
    if (!current) throw BaseError.notFound("Customer not found");

    // Hitung blok yang dikirim
    const blocksProvided =
      (employee ? 1 : 0) + (non_employee ? 1 : 0) + (business ? 1 : 0);
    if (blocksProvided > 1) {
      fail(
        "Only one of employee, non_employee, or business may be provided",
        "work_block"
      );
    }

    // Tentukan target work_type (pakai payload kalau ada, kalau tidak pakai current)
    const prevWorkType = this._inferWorkTypeFromCurrent(current);
    const targetWorkType =
      customer.work_type ?? this._inferWorkTypeFromCurrent(current);

    // Jika tidak ada work_type (baik di payload maupun di DB) tapi user mengirim blok, tidak konsisten
    if (!targetWorkType && blocksProvided === 1) {
      fail(
        "work_type is required when sending employee/non_employee/business block",
        "work_type"
      );
    }

    // Validasi kombinasinya (blok & *_id)
    // Tidak boleh mix id override + blok baru untuk tipe yang sama
    if (employee && customer.employee_id) {
      fail(
        "Provide either employee block or employee_id, not both",
        "employee"
      );
    }
    if (non_employee && customer.non_employee_id) {
      fail(
        "Provide either non_employee block or non_employee_id, not both",
        "non_employee"
      );
    }
    if (business && customer.business_id) {
      fail(
        "Provide either business block or business_id, not both",
        "business"
      );
    }

    // Validasi kesesuaian work_type ↔ blok/id yang dikirim
    if (targetWorkType === "Karyawan") {
      if (non_employee || business)
        fail(
          "Only employee block is allowed for work_type Karyawan",
          "work_type"
        );
      if (customer.non_employee_id || customer.business_id) {
        fail(
          "Only employee_id is allowed for work_type Karyawan",
          "work_type_fk"
        );
      }
    } else if (targetWorkType === "Pekerja Lepas") {
      if (employee || business)
        fail(
          "Only non_employee block is allowed for work_type Pekerja Lepas",
          "work_type"
        );
      if (customer.employee_id || customer.business_id) {
        fail(
          "Only non_employee_id is allowed for work_type Pekerja Lepas",
          "work_type_fk"
        );
      }
    } else if (targetWorkType === "Wirausaha") {
      if (employee || non_employee)
        fail(
          "Only business block is allowed for work_type Wirausaha",
          "work_type"
        );
      if (customer.employee_id || customer.non_employee_id) {
        fail(
          "Only business_id is allowed for work_type Wirausaha",
          "work_type_fk"
        );
      }
    }

    if (validation) throw new joi.ValidationError(validation, stack);

    // Eksekusi
    return this.prisma.$transaction(async (tx) => {
      let newEmployeeId = current.employee_id ?? null;
      let newNonEmployeeId = current.non_employee_id ?? null;
      let newBusinessId = current.business_id ?? null;

      // Helper: verifikasi ID yang direferensikan user
      const ensureExists = async (table, refId, path) => {
        const found = await tx[table].findUnique({
          where: { id: refId },
          select: { id: true },
        });
        if (!found) fail(`${table} not found`, path);
        if (validation) throw new joi.ValidationError(validation, stack);
        return refId;
      };

      // APPLY per target work_type
      if (targetWorkType === "Karyawan") {
        // a) jika ada block employee → create/update
        if (employee) {
          if (newEmployeeId) {
            await tx.employee.update({
              where: { id: newEmployeeId },
              data: employee,
            });
          } else {
            const created = await tx.employee.create({ data: employee });
            newEmployeeId = created.id;
          }
        }
        // b) jika ada employee_id → re-link
        if (customer.employee_id) {
          newEmployeeId = await ensureExists(
            "employee",
            customer.employee_id,
            "employee_id"
          );
        }
        // c) pastikan ada link employee (entah dari block atau id atau eksisting)
        if (!newEmployeeId) {
          fail(
            "Employee is required for work_type Karyawan (provide employee block or employee_id)",
            "employee"
          );
          throw new joi.ValidationError(validation, stack);
        }
        // d) null-kan yang tidak relevan
        newNonEmployeeId = null;
        newBusinessId = null;
      }

      if (targetWorkType === "Pekerja Lepas") {
        if (non_employee) {
          if (newNonEmployeeId) {
            await tx.nonEmployee.update({
              where: { id: newNonEmployeeId },
              data: non_employee,
            });
          } else {
            const created = await tx.nonEmployee.create({ data: non_employee });
            newNonEmployeeId = created.id;
          }
        }
        if (customer.non_employee_id) {
          newNonEmployeeId = await ensureExists(
            "nonEmployee",
            customer.non_employee_id,
            "non_employee_id"
          );
        }
        if (!newNonEmployeeId) {
          fail(
            "Non-employee is required for work_type Pekerja Lepas (provide non_employee block or non_employee_id)",
            "non_employee"
          );
          throw new joi.ValidationError(validation, stack);
        }
        newEmployeeId = null;
        newBusinessId = null;
      }

      if (targetWorkType === "Wirausaha") {
        if (business) {
          if (newBusinessId) {
            await tx.business.update({
              where: { id: newBusinessId },
              data: business,
            });
          } else {
            const created = await tx.business.create({ data: business });
            newBusinessId = created.id;
          }
        }
        if (customer.business_id) {
          newBusinessId = await ensureExists(
            "business",
            customer.business_id,
            "business_id"
          );
        }
        if (!newBusinessId) {
          fail(
            "Business is required for work_type Wirausaha (provide business block or business_id)",
            "business"
          );
          throw new joi.ValidationError(validation, stack);
        }
        newEmployeeId = null;
        newNonEmployeeId = null;
      }

      // Jika targetWorkType tidak ada (tetap null) → kita izinkan update data customer dasar tanpa menyentuh link pekerjaan
      // Namun jika user mengirim blok saat targetWorkType null, kita sudah fail sebelumnya.

      // Update Customer
      const updated = await tx.customer.update({
        where: { id: current.id },
        data: {
          name: customer.name,
          ktp_number: customer.ktp_number,
          date_of_birth: customer.date_of_birth ?? current.date_of_birth,
          address: customer.address ?? current.address,
          rt_rw: customer.rt_rw ?? current.rt_rw,
          village: customer.village ?? current.village,
          phone_number: customer.phone_number ?? current.phone_number,
          employee_id: newEmployeeId,
          non_employee_id: newNonEmployeeId,
          business_id: newBusinessId,
        },
        include: { employee: true, non_employee: true, business: true },
      });

      if (targetWorkType && prevWorkType && targetWorkType !== prevWorkType) {
        if (prevWorkType === "Wirausaha" && current.business_id) {
          await tx.business.delete({ where: { id: current.business_id } });
        } else if (prevWorkType === "Karyawan" && current.employee_id) {
          await tx.employee.delete({ where: { id: current.employee_id } });
        } else if (
          prevWorkType === "Pekerja Lepas" &&
          current.non_employee_id
        ) {
          await tx.nonEmployee.delete({
            where: { id: current.non_employee_id },
          });
        }
      }

      const changes = [];

      // Validasi dan catat perubahan untuk setiap field

      if (customer.name && customer.name !== current.name) {
        changes.push(`Name changed from ${current.name} to ${customer.name}`);
      }

      if (customer.ktp_number && customer.ktp_number !== current.ktp_number) {
        changes.push(
          `KTP number changed from ${current.ktp_number} to ${customer.ktp_number}`
        );
      }

      if (
        customer.date_of_birth &&
        customer.date_of_birth !== current.date_of_birth
      ) {
        changes.push(
          `Date of birth changed from ${current.date_of_birth} to ${customer.date_of_birth}`
        );
      }

      if (customer.address && customer.address !== current.address) {
        changes.push(
          `Address changed from ${current.address} to ${customer.address}`
        );
      }

      if (customer.rt_rw && customer.rt_rw !== current.rt_rw) {
        changes.push(
          `RT/RW changed from ${current.rt_rw} to ${customer.rt_rw}`
        );
      }

      if (customer.village && customer.village !== current.village) {
        changes.push(
          `Village changed from ${current.village} to ${customer.village}`
        );
      }

      if (
        customer.phone_number &&
        customer.phone_number !== current.phone_number
      ) {
        changes.push(
          `Phone number changed from ${current.phone_number} to ${customer.phone_number}`
        );
      }

      if (
        customer.employee_id &&
        customer.employee_id !== current.employee_id
      ) {
        changes.push(
          `Employee ID changed from ${current.employee_id} to ${customer.employee_id}`
        );
      }

      if (
        customer.non_employee_id &&
        customer.non_employee_id !== current.non_employee_id
      ) {
        changes.push(
          `Non-employee ID changed from ${current.non_employee_id} to ${customer.non_employee_id}`
        );
      }

      if (
        customer.business_id &&
        customer.business_id !== current.business_id
      ) {
        changes.push(
          `Business ID changed from ${current.business_id} to ${customer.business_id}`
        );
      }

      // Buat entri log pembaruan
      if (changes.length > 0) {
        await tx.customerUpdateLog.create({
          data: {
            customer_id: current.id,
            updated_by: current.created_by, // Ganti dengan ID user yang melakukan update
            changes: changes.join(", "), // Gabungkan perubahan yang dilakukan
          },
        });
      }

      return {
        ...updated,
        work_type: targetWorkType ?? null,
      };
    });
  }

  async remove(id) {
    await this.detail(id); // untuk validasi eksistensi

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  _inferWorkTypeFromCurrent(current) {
    if (current.employee_id) return "Karyawan";
    if (current.non_employee_id) return "Pekerja Lepas";
    if (current.business_id) return "Wirausaha";
    return null;
  }
}

export default new CustomerService();
