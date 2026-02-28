import BaseError from "../../base_classes/base-error.js";
import { PrismaService } from "../../common/service/prisma.service.js";
import S3Service from "../../common/service/s3.service.js";

class AppsettingsService {
  constructor() {
    this.prisma = new PrismaService();
    this.s3Service = new S3Service();
  }

  async getAll() {
    return await this.prisma.appSettings.findMany();
  }

  async getById(id) {
    return await this.prisma.appSettings.findUnique({
      where: { id },
    });
  }

  async create(currentUser, file = [], data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    if (!file) {
      throw BaseError.badRequest("File wajib diupload");
    }

    let uploaded = [];
    if (file.length) {
      uploaded = await Promise.all(
        file.map((f) => this.s3Service.uploadFile(f, "app-settings")),
      );
    }

    console.log(currentUser);

    if (
      currentUser.userType !== "ADMIN" &&
      currentUser.userType !== "SUPER_ADMIN"
    ) {
      throw BaseError.forbidden(
        "Only admin or super admin can create app settings",
      );
    }

    // Cek apakah sudah ada data pengaturan aplikasi
    const existingSettings = await this.prisma.appSettings.findFirst();

    // Jika sudah ada data, throw error
    if (existingSettings) {
      throw new Error(
        "App settings already exist. Please update the existing settings instead of creating new ones.",
      );
    }

    // Jika tidak ada data, lanjutkan untuk membuat pengaturan baru
    const created = await this.prisma.appSettings.create({
      data: {
        ...data,
        defaultRadius: Number(data.defaultRadius),
        companyLogo: uploaded[0],
      },
    });

    if (!created) {
      fail("Failed to create app settings", "appSettings");
      throw new Joi.ValidationError(validation, stack);
    }

    return created;
  }

  async update(currentUser, id, file = [], data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    if (!file) {
      throw BaseError.badRequest("File wajib diupload");
    }

    let uploaded = [];
    if (file.length) {
      uploaded = await Promise.all(
        file.map((f) => this.s3Service.uploadFile(f, "app-settings")),
      );
    }

    console.log(currentUser);

    if (
      currentUser.userType !== "ADMIN" &&
      currentUser.userType !== "SUPER_ADMIN"
    ) {
      throw BaseError.forbidden(
        "Only admin or super admin can update app settings",
      );
    }

    // Cek apakah pengaturan aplikasi dengan ID sudah ada
    const existingSettings = await this.prisma.appSettings.findUnique({
      where: { id },
    });

    // Jika tidak ada data pengaturan aplikasi dengan ID yang diberikan, throw error
    if (!existingSettings) {
      throw new Error("App settings not found. Unable to update.");
    }

    // Lanjutkan untuk memperbarui pengaturan jika sudah ada
    const updated = await this.prisma.appSettings.update({
      where: { id },
      data: {
        ...data,
        defaultRadius: Number(data.defaultRadius),
        companyLogo:
          uploaded.length > 0 ? uploaded[0] : existingSettings.companyLogo, // Gunakan logo yang sudah ada jika tidak ada file baru
      },
    });

    if (!updated) {
      fail("Failed to update app settings", "appSettings");
      throw new Joi.ValidationError(validation, stack);
    }

    return updated;
  }

  async delete(id) {
    return await this.prisma.appSettings.delete({
      where: { id },
    });
  }
}

export default new AppsettingsService();
