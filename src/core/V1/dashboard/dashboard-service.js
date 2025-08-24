import FLEKSIService from '../FLEKSI/FLEKSI-service.js';
import KARService from '../KAR/KAR-service.js';
import KEFService from '../KEF/KEF-service.js';
import KMMService from '../KMM/KMM-service.js';
import KMSService from '../KMS/KMS-service.js';
import KMSMService from '../KMSM/KMSM-service.js';
import KRSService from '../KRS/KRS-service.js';
import KSMService from '../KSM/KSM-service.js';
import KSSMService from '../KSSM/KSSM-service.js';
import db from '../../../config/db.js';
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  eachDayOfInterval,
  format,
} from 'date-fns';

class DashboardService {
  productTables = [
    'KSSM',
    'KSS',
    'PINEK',
    'FLEKSI',
    'PROCIM',
    'KSM',
    'KMSM',
    'KRS',
    'KMM',
    'KMS',
    'KEF',
    'KAR',
  ];
  async getAllProductStats() {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const getStat = async (Service, nama_produk) => {
      const thisMonth = await Service.countUniqueKTP({
        from: startOfThisMonth,
        to: now,
      });

      const lastMonth = await Service.countUniqueKTP({
        from: startOfLastMonth,
        to: endOfLastMonth,
      });

      const increase =
        lastMonth === 0 ? 100 : ((thisMonth - lastMonth) / lastMonth) * 100;

      return {
        nama_produk,
        unique_nasabah: thisMonth,
        increase_nasabah: parseFloat(increase.toFixed(2)),
      };
    };

    return Promise.all([
      getStat(FLEKSIService, 'FLEKSI'),
      getStat(KARService, 'KAR'),
      getStat(KEFService, 'KEF'),
      getStat(KMMService, 'KMM'),
      getStat(KMSService, 'KMS'),
      getStat(KMSMService, 'KMSM'),
      getStat(KRSService, 'KRS'),
      getStat(KSMService, 'KSM'),
      getStat(KSSMService, 'KSSM'),
      // ...add remaining products
    ]);
  }

  async getProductStats() {
    const now = new Date();
    const startCurrentMonth = startOfMonth(now);
    const endCurrentMonth = endOfMonth(now);
    const startLastMonth = startOfMonth(subMonths(now, 1));
    const endLastMonth = endOfMonth(subMonths(now, 1));

    const results = await Promise.all(
      this.productTables.map(async (productName) => {
        const model = db[productName];

        const allUnique = await model.findMany({
          select: { nik_debitur: true },
          distinct: ['nik_debitur'],
        });

        const currentMonth = await model.findMany({
          where: {
            created_at: {
              gte: startCurrentMonth,
              lte: endCurrentMonth,
            },
          },
          select: { nik_debitur: true },
          distinct: ['nik_debitur'],
        });

        const lastMonth = await model.findMany({
          where: {
            created_at: {
              gte: startLastMonth,
              lte: endLastMonth,
            },
          },
          select: { nik_debitur: true },
          distinct: ['nik_debitur'],
        });

        const count = await db[productName].count();

        const current = currentMonth.length;
        const last = lastMonth.length;

        const increase_nasabah =
          last === 0 ? 0 : Number((((current - last) / last) * 100).toFixed(2));

        return {
          nama_produk: productName,
          jumlah_produk: count,
          unique_nasabah: allUnique.length,
          increase_nasabah,
        };
      })
    );

    return results;
  }

  async getDailyProductsTraffic() {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const days = eachDayOfInterval({ start, end });

    const chartData = [];

    for (const day of days) {
      const startOfDay = new Date(`${format(day, 'yyyy-MM-dd')}T00:00:00`);
      const endOfDay = new Date(`${format(day, 'yyyy-MM-dd')}T23:59:59`);

      const row = {
        date: format(day, 'yyyy-MM-dd'),
      };

      for (const table of this.productTables) {
        try {
          const count = await db[table].count({
            where: {
              created_at: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          });

          row[table.toLowerCase()] = count;
        } catch (err) {
          console.error(`Error on ${table}:`, err);
          row[table.toLowerCase()] = 0;
        }
      }

      chartData.push(row);
    }

    return chartData;
  }

  async getCountProducts() {
    let result = [];
    for (const table of this.productTables) {
      let row = {};
      try {
        const count = await db[table].count();

        row[table.toLowerCase()] = count;

        result.push(row);
      } catch (err) {
        console.error(`Error on ${table}:`, err);
        row[table.toLowerCase()] = 0;
      }
    }

    return result;
  }
}

export default new DashboardService();
