// prisma.service.js
// import { createSoftDeleteMiddleware } from "prisma-soft-delete-middleware";
import { createSoftDeleteMiddleware } from "prisma-soft-delete-middleware";
import { PrismaClient } from "@prisma/client";
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }

  async onModuleInit() {
    this.$use(
      createSoftDeleteMiddleware({
        models: {
          User: true,
          KSSM: true,
          KSS: true,
          PINEK: true,
          FLEKSI: true,
          PROCIM: true,
          KSM: true,
          KMSM: true,
          KRS: true,
          KMM: true,
          KMS: true,
          KEF: true,
          KAR: true,
          FleksiBarangElektronik: true,
          FleksiBarangFurniture: true,
          FleksiBarangJaminanLainnya: true,
          ProcimBarangElektronik: true,
          ProcimBarangFurniture: true,
          ProcimBarangJaminanLainnya: true,
          Region: true,
          Branch: true,
          Employee: true,
          NonEmployee: true,
          Business: true,
          Customer: true,
          Report: true,
          ReportPhoto: true,
          ReviewCustomer: true,
          Evaluation: true,
          ReviewEvaluation: true,
          SystemLog: true,
        },
        defaultConfig: {
          field: "deleted_at",
          createValue: (deleted) => {
            if (deleted) return new Date();
            return null;
          },
        },
      })
    );

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
