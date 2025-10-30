import BaseError from "../../../base_classes/base-error.js";
import { PrismaService } from "../../../common/service/prisma.service.js";

class ReviewEvasluationService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async list() {
    const result = await this.prisma.reviewEvaluation.findMany();
    return result;
  }

  async create(data, currentUser) {
    const result = await this.prisma.$transaction(async (tx) => {
      const evaluation = await tx.evaluation.findFirst({
        where: { id: data.evaluation_id },
      });
      if (!evaluation) throw BaseError.notFound("Evaluation not found");

      const existingReview = await tx.reviewEvaluation.findFirst({
        where: { evaluation_id: data.evaluation_id },
      });
      if (existingReview) {
        throw BaseError.duplicate("Review for this evaluation already exists");
      }

      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "AM" },
      });
      if (!user) throw BaseError.forbidden("Only AM can create review");

      const report = await tx.report.findFirst({
        where: { id: evaluation.report_id, process: "REVIEW_AM" },
      });

      if (report.am_id !== currentUser.id) {
        throw BaseError.forbidden("Cannot review this report");
      }
      if (!report) {
        throw BaseError.badRequest(
          "Report must be in REVIEW_AM process to create review"
        );
      }

      const isComplete =
        data.review_character != undefined &&
        data.review_capacity != undefined &&
        data.review_condition != undefined &&
        data.review_capital != undefined;

      if (!isComplete) {
        const statusReview = "DRAFT";
        const processReport = "REVIEW_AM";
        const statusReport = "GOOD";

        const reviewEvaluation = await tx.reviewEvaluation.create({
          data: {
            evaluation_id: data.evaluation_id,
            review_character: data.review_character,
            review_capacity: data.review_capacity,
            review_condition: data.review_condition,
            review_capital: data.review_capital,
            status_review: statusReview, // Status is DRAFT because data is incomplete
          },
        });

        await tx.report.update({
          where: { id: evaluation.report_id },
          data: { status: statusReport, process: processReport },
        });

        return reviewEvaluation;
      }

      const allFieldsValid =
        data.review_character &&
        data.review_capacity &&
        data.review_condition &&
        data.review_capital;

      let statusReview, processReport, statusReport, dateReviewCustomer;

      if (allFieldsValid) {
        // If all fields are true, set statusReview to COMPLETED, processReport to EVALUATION_SLO, and statusReport to GOOD
        statusReview = "COMPLETED";
        processReport = "APPROVE_AM";
        statusReport = "GOOD";
        dateReviewCustomer = new Date(Date.now());
      } else {
        // If any field is false, set statusReview to COMPLETED, processReport to DECLINE_REVIEW_SLO, and statusReport to BAD
        statusReview = "COMPLETED";
        processReport = "DECLINE_AM";
        statusReport = "BAD";
        dateReviewCustomer = new Date(Date.now());
      }

      const reviewEvaluation = await tx.reviewEvaluation.create({
        data: {
          evaluation_id: data.evaluation_id,
          review_character: data.review_character,
          review_capacity: data.review_capacity,
          review_condition: data.review_condition,
          review_capital: data.review_capital,
          status_review: statusReview, // Status is either COMPLETED or DRAFT
        },
      });

      await tx.report.update({
        where: { id: evaluation.report_id },
        data: {
          status: statusReport,
          process: processReport,
          date_review_am: dateReviewCustomer,
        },
      });

      return reviewEvaluation;
    });

    return result;
  }

  async update(id, data, currentUser) {
    const result = await this.prisma.$transaction(async (tx) => {
      // Find the reviewEvaluation record by id
      const reviewEvaluation = await tx.reviewEvaluation.findUnique({
        where: { id: id },
        include: { evaluation: true },
      });

      console.log(reviewEvaluation);

      if (!reviewEvaluation) {
        throw BaseError.notFound("Review Evaluation not found");
      }

      // Find the associated report
      const report = await tx.report.findFirst({
        where: { id: reviewEvaluation.report_id },
      });
      if (!report) throw BaseError.notFound("Report not found");

      // Check if the reviewEvaluation status is DRAFT (only DRAFT can be updated)
      if (reviewEvaluation.status_review !== "DRAFT") {
        throw BaseError.forbidden("Only DRAFT reviews can be updated");
      }

      // Check if the current user has the 'AM' role
      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "AM" },
      });
      if (!user) throw BaseError.forbidden("Only AM can update review");

      // Check if the user is the correct AM for the report
      if (report.am_id !== currentUser.id) {
        throw BaseError.forbidden("Cannot update this review for the report");
      }

      // Track changes for each review field
      const changes = [];

      if (data.review_character !== reviewEvaluation.review_character) {
        changes.push(
          `Review Character changed from ${reviewEvaluation.review_character} to ${data.review_character}`
        );
      }
      if (data.review_capacity !== reviewEvaluation.review_capacity) {
        changes.push(
          `Review Capacity changed from ${reviewEvaluation.review_capacity} to ${data.review_capacity}`
        );
      }
      if (data.review_condition !== reviewEvaluation.review_condition) {
        changes.push(
          `Review Condition changed from ${reviewEvaluation.review_condition} to ${data.review_condition}`
        );
      }
      if (data.review_capital !== reviewEvaluation.review_capital) {
        changes.push(
          `Review Capital changed from ${reviewEvaluation.review_capital} to ${data.review_capital}`
        );
      }

      // Check if all fields are filled
      const isComplete =
        (data.review_character !== undefined ||
          reviewEvaluation.review_character != null) &&
        (data.review_capacity !== undefined ||
          reviewEvaluation.review_capacity != null) &&
        (data.review_condition !== undefined ||
          reviewEvaluation.review_condition != null) &&
        (data.review_capital !== undefined ||
          reviewEvaluation.review_capital != null);

      let statusReview, processReport, statusReport, dateReviewCustomer;

      if (!isComplete) {
        statusReview = "DRAFT";
        processReport = "REVIEW_AM";
        statusReport = "GOOD";
        dateReviewCustomer = null;
      } else {
        const allFieldsValid =
          data.review_character &&
          data.review_capacity &&
          data.review_condition &&
          data.review_capital;

        // Determine statusReport, processReport, and statusReview based on the conditions
        if (allFieldsValid) {
          statusReport = "GOOD";
          processReport = "APPROVE_AM";
          statusReview = "COMPLETED";
          dateReviewCustomer = new Date(Date.now());
        } else {
          statusReport = "BAD";
          processReport = "DECLINE_AM";
          statusReview = "COMPLETED";
          dateReviewCustomer = new Date(Date.now());
        }
      }
      console.log(
        statusReview,
        processReport,
        statusReport,
        dateReviewCustomer
      );

      // Update the reviewEvaluation record
      const updatedReviewEvaluation = await tx.reviewEvaluation.update({
        where: { id: reviewEvaluation.id },
        data: {
          review_character: data.review_character,
          review_capacity: data.review_capacity,
          review_condition: data.review_condition,
          review_capital: data.review_capital,
          status_review: statusReview, // Updated status
        },
      });

      console.log(reviewEvaluation);

      // Update the report status and process
      await tx.report.update({
        where: { id: reviewEvaluation.evaluation.report_id },
        data: {
          status: statusReport,
          process: processReport,
          review_by_am: dateReviewCustomer,
        },
      });

      // Log the changes in the review_evaluation_update_logs table
      if (changes.length > 0) {
        await tx.reviewEvaluationUpdateLog.create({
          data: {
            review_evaluation_id: updatedReviewEvaluation.id,
            updated_by: currentUser.id,
            changes: changes.join(", "), // Join the changes with commas
          },
        });
      }

      // Return the updated reviewEvaluation

      return updatedReviewEvaluation;
    });

    return result;
  }
}
export default new ReviewEvasluationService();
