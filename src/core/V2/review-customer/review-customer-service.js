// modules/report/report-service.js
import BaseError from '../../../base_classes/base-error.js';
import { PrismaService } from '../../../common/service/prisma.service.js';
// import S3Service from '../../../common/service/s3.service.js';
// import { buildQueryOptions } from '../../../utils/buildQueryOptions.js';
// import reportQueryConfig from './report-query-config.js';

class ReviewCustomerService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async create(data, currentUser) {
    const result = await this.prisma.$transaction(async (tx) => {
      const report = await tx.report.findFirst({
        where: { id: data.report_id },
      });
      if (!report) throw BaseError.notFound('Report not found');

      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: 'SLO' },
      });
      if (!user) throw BaseError.forbidden('Only SLO can create review');

      if (report.slo_id !== currentUser.id) {
        throw BaseError.forbidden('Cannot review this report');
      }

      const existingReview = await tx.reviewCustomer.findFirst({
        where: { report_id: data.report_id },
      });
      if (existingReview) {
        throw BaseError.duplicate('Review for this report already exists');
      }

      const statusReport =
        data.review_identity && data.review_domicile && data.review_work
          ? 'GOOD'
          : 'NOT_GOOD';

      const reviewCustomer = await tx.reviewCustomer.create({
        data: {
          report_id: data.report_id,
          review_identity: data.review_identity,
          review_domicile: data.review_domicile,
          review_work: data.review_work,
        },
      });

      await tx.report.update({
        where: { id: data.report_id },
        data: { status: statusReport },
      });

      return reviewCustomer;
    });

    return result;
  }

  async list() {
    const result = await this.prisma.reviewCustomer.findMany();
    return result;
  }
}

export default new ReviewCustomerService();
