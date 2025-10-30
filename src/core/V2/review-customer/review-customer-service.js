// modules/report/report-service.js
import BaseError from "../../../base_classes/base-error.js";
import { PrismaService } from "../../../common/service/prisma.service.js";
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
      if (!report) throw BaseError.notFound("Report not found");

      const existingReview = await tx.reviewCustomer.findFirst({
        where: { report_id: data.report_id },
      });
      if (existingReview) {
        throw BaseError.duplicate("Review for this report already exists");
      }

      console.log(currentUser);

      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "SLO" },
      });
      if (!user) throw BaseError.forbidden("Only SLO can create review");

      if (report.slo_id !== currentUser.id) {
        throw BaseError.forbidden("Cannot review this report");
      }

      // Step 1: Check if the data is complete
      const isComplete =
        data.review_identity != undefined &&
        data.review_domicile != undefined &&
        data.review_work != undefined;

      // If data is not complete, set statusReview to DRAFT, processReport to REVIEW_SLO, and statusReport to GOOD
      if (!isComplete) {
        const statusReview = "DRAFT";
        const processReport = "REVIEW_SLO";
        const statusReport = "GOOD";

        const reviewCustomer = await tx.reviewCustomer.create({
          data: {
            report_id: data.report_id,
            review_identity: data.review_identity,
            review_domicile: data.review_domicile,
            review_work: data.review_work,
            status_review: statusReview, // Status is DRAFT because data is incomplete
          },
        });

        await tx.report.update({
          where: { id: data.report_id },
          data: {
            status: statusReport,
            process: processReport,
          },
        });

        return reviewCustomer;
      }

      // Step 2: If the data is complete, check if all fields are true
      const allFieldsValid =
        data.review_identity && data.review_domicile && data.review_work;

      let statusReview, processReport, statusReport, dateReviewCustomer;

      if (allFieldsValid) {
        // If all fields are true, set statusReview to COMPLETED, processReport to EVALUATION_SLO, and statusReport to GOOD
        statusReview = "COMPLETED";
        processReport = "EVALUATION_SLO";
        statusReport = "GOOD";
        dateReviewCustomer = null;
      } else {
        // If any field is false, set statusReview to COMPLETED, processReport to DECLINE_REVIEW_SLO, and statusReport to BAD
        statusReview = "COMPLETED";
        processReport = "DECLINE_REVIEW_SLO";
        statusReport = "BAD";
        dateReviewCustomer = new Date(Date.now());
      }

      // Step 3: Create the review and update the report status
      const reviewCustomer = await tx.reviewCustomer.create({
        data: {
          report_id: data.report_id,
          review_identity: data.review_identity,
          review_domicile: data.review_domicile,
          review_work: data.review_work,
          status_review: statusReview, // Status is either COMPLETED or DRAFT
        },
      });

      await tx.report.update({
        where: { id: data.report_id },
        data: {
          status: statusReport,
          process: processReport,
          review_by_slo: dateReviewCustomer,
        },
      });

      return reviewCustomer;
    });

    return result;
  }

  async update(id, data, currentUser) {
    const result = await this.prisma.$transaction(async (tx) => {
      const reviewCustomer = await tx.reviewCustomer.findUnique({
        where: { id: id },
        include: { report: true },
      });

      if (!reviewCustomer) {
        throw BaseError.notFound("Review customer not found");
      }

      const report = await tx.report.findFirst({
        where: { id: reviewCustomer.report_id },
      });
      if (!report) throw BaseError.notFound("Report not found");

      // If the review is not in DRAFT, prevent updates
      if (reviewCustomer.status_review !== "DRAFT") {
        throw BaseError.forbidden("Only DRAFT reviews can be updated");
      }

      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "SLO" },
      });
      if (!user) throw BaseError.forbidden("Only SLO can create review");

      if (report.slo_id !== currentUser.id) {
        throw BaseError.forbidden("Cannot review this report");
      }

      const changes = [];

      // Track changes for review_identity
      if (data.review_identity !== reviewCustomer.review_identity) {
        changes.push(
          `Review Identity changed from ${reviewCustomer.review_identity} to ${data.review_identity}`
        );
      }

      // Track changes for review_domicile
      if (data.review_domicile !== reviewCustomer.review_domicile) {
        changes.push(
          `Review Domicile changed from ${reviewCustomer.review_domicile} to ${data.review_domicile}`
        );
      }

      // Track changes for review_work
      if (data.review_work !== reviewCustomer.review_work) {
        changes.push(
          `Review Work changed from ${reviewCustomer.review_work} to ${data.review_work}`
        );
      }

      // Update review fields

      // Determine if data is complete (all fields are true)
      const isComplete =
        (data.review_identity !== undefined ||
          reviewCustomer.review_identity != null) &&
        (data.review_domicile !== undefined ||
          reviewCustomer.review_domicile != null) &&
        (data.review_work !== undefined || reviewCustomer.review_work != null);

      let statusReview, processReport, statusReport, dateReviewCustomer;

      // Check if all fields are filled
      if (!isComplete) {
        statusReview = "DRAFT";
        processReport = "REVIEW_SLO";
        statusReport = "GOOD";
        dateReviewCustomer = null;
        console.log("1.1");
      } else {
        console.log("1.2");
        // Check if all fields are true or if any are false
        const allFieldsValid =
          data.review_identity && data.review_domicile && data.review_work;

        if (allFieldsValid) {
          statusReview = "COMPLETED";
          processReport = "EVALUATION_SLO";
          statusReport = "GOOD";
          dateReviewCustomer = null;
          console.log("1.2.1");
        } else {
          statusReview = "COMPLETED";
          processReport = "DECLINE_REVIEW_SLO";
          statusReport = "BAD";
          dateReviewCustomer = new Date(Date.now());
          console.log("1.2.2");
        }
      }

      console.log(statusReview, processReport, statusReport);

      const updatedReview = await tx.reviewCustomer.update({
        where: { id: reviewCustomer.id },
        data: {
          status_review: statusReview,
          review_identity: data.review_identity,
          review_domicile: data.review_domicile,
          review_work: data.review_work,
          updated_at: new Date(), // Automatically update the timestamp
        },
      });

      // Update the report status
      await tx.report.update({
        where: { id: reviewCustomer.report_id },
        data: {
          status: statusReport,
          process: processReport,
          review_by_slo: dateReviewCustomer,
        },
      });

      // Log the update in the review_customer_update_logs table
      if (changes.length > 0) {
        await tx.reviewCustomerUpdateLog.create({
          data: {
            review_customer_id: updatedReview.id,
            updated_by: currentUser.id, // Use the ID of the user who performed the update
            changes: changes.join(", "), // Join the changes with commas
          },
        });
      }

      // Return the updated reviewCustomer
      return updatedReview;
    });

    return result;
  }

  async list() {
    const result = await this.prisma.reviewCustomer.findMany();
    return result;
  }
}

export default new ReviewCustomerService();
