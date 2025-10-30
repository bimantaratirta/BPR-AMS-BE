import BaseError from "../../../base_classes/base-error.js";
import { PrismaService } from "../../../common/service/prisma.service.js";

class EvaluationService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async create(data, currentUser) {
    const result = await this.prisma.$transaction(async (tx) => {
      const report = await tx.report.findFirst({
        where: { id: data.report_id },
      });
      if (!report) throw BaseError.notFound("Report not found");

      console.log(currentUser);
      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "SLO" },
      });
      if (!user) throw BaseError.forbidden("Only SLO can create evaluation");

      if (report.slo_id !== currentUser.id) {
        throw BaseError.forbidden("Cannot evaluate this report");
      }

      const reviewedReport = await tx.report.findFirst({
        where: { id: data.report_id, process: "EVALUATION_SLO" },
      });
      if (!reviewedReport) {
        throw BaseError.badRequest(
          "Report must be in EVALUATION_SLO process to create evaluation"
        );
      }

      const existingEvaluation = await tx.evaluation.findFirst({
        where: { report_id: data.report_id },
      });
      if (existingEvaluation) {
        throw BaseError.duplicate("Evaluation for this report already exists");
      }

      const isComplete =
        data.character != undefined &&
        data.status_character != undefined &&
        data.capacity != undefined &&
        data.status_capacity != undefined &&
        data.condition != undefined &&
        data.status_condition != undefined &&
        data.capital != undefined &&
        data.status_capital != undefined;

      if (!isComplete) {
        const statusReview = "DRAFT";
        const processReport = "EVALUATION_SLO";
        const statusReport = "GOOD";

        console.log(statusReview, processReport, statusReport);

        const evaluation = await tx.evaluation.create({
          data: {
            report_id: data.report_id,
            character: data.character,
            status_character: data.status_character,
            capacity: data.capacity,
            status_capacity: data.status_capacity,
            condition: data.condition,
            status_condition: data.status_condition,
            capital: data.capital,
            status_capital: data.status_capital,
            status_review: statusReview, // Status is DRAFT because data is incomplete
          },
        });

        await tx.report.update({
          where: { id: data.report_id },
          data: {
            status: statusReport,
            process: processReport,
            status: statusReport,
          },
        });

        return evaluation;
      }

      const allFieldsValid =
        data.character &&
        data.status_character &&
        data.capacity &&
        data.status_capacity &&
        data.condition &&
        data.status_condition &&
        data.capital &&
        data.status_capital;

      let statusReview, processReport, statusReport, dateReviewCustomer;

      if (!allFieldsValid) {
        // If not all fields are filled, return an error or prevent creation
        throw new Error(
          "All fields must be filled before creating the evaluation."
        );
      }

      // Check if all status fields are "GOOD"
      const allGood =
        data.status_character === "GOOD" &&
        data.status_capacity === "GOOD" &&
        data.status_condition === "GOOD" &&
        data.status_capital === "GOOD";

      // Determine statusReport and processReport based on the conditions
      if (allGood) {
        statusReport = "GOOD";
        processReport = "REVIEW_AM";
        statusReview = "COMPLETED";
        dateReviewCustomer = new Date(Date.now());
      } else {
        statusReport = "BAD";
        processReport = "DECLINE_EVALUATION_SLO";
        statusReview = "COMPLETED";
        dateReviewCustomer = new Date(Date.now());
      }
      console.log(
        statusReview,
        processReport,
        statusReport,
        dateReviewCustomer
      );

      // Step 3: Create the evaluation record and update the report status
      const evaluation = await tx.evaluation.create({
        data: {
          report_id: data.report_id,
          character: data.character,
          status_character: data.status_character,
          capacity: data.capacity,
          status_capacity: data.status_capacity,
          condition: data.condition,
          status_condition: data.status_condition,
          capital: data.capital,
          status_capital: data.status_capital,
          status_review: statusReview,
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

      return evaluation;
    });
    return result;
  }

  async update(id, data, currentUser) {
    const result = await this.prisma.$transaction(async (tx) => {
      // Find the evaluation record by id
      const evaluation = await tx.evaluation.findUnique({
        where: { id: id },
        include: { report: true },
      });

      if (!evaluation) {
        throw BaseError.notFound("Evaluation not found");
      }

      // Check if the associated report exists
      const report = await tx.report.findFirst({
        where: { id: evaluation.report_id },
      });
      if (!report) throw BaseError.notFound("Report not found");

      // Prevent updates if the evaluation status is not "DRAFT"
      if (evaluation.status_review !== "DRAFT") {
        throw BaseError.forbidden("Only DRAFT evaluations can be updated");
      }

      // Check if the user is allowed to update this evaluation (SLO role check)
      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "SLO" },
      });
      if (!user) throw BaseError.forbidden("Only SLO can update evaluation");

      if (report.slo_id !== currentUser.id) {
        throw BaseError.forbidden("Cannot update this evaluation");
      }

      // Track changes for the fields
      const changes = [];

      // Compare each field to track changes
      if (data.character !== evaluation.character) {
        changes.push(
          `Character changed from ${evaluation.character} to ${data.character}`
        );
      }
      if (data.status_character !== evaluation.status_character) {
        changes.push(
          `Status Character changed from ${evaluation.status_character} to ${data.status_character}`
        );
      }
      if (data.capacity !== evaluation.capacity) {
        changes.push(
          `Capacity changed from ${evaluation.capacity} to ${data.capacity}`
        );
      }
      if (data.status_capacity !== evaluation.status_capacity) {
        changes.push(
          `Status Capacity changed from ${evaluation.status_capacity} to ${data.status_capacity}`
        );
      }
      if (data.condition !== evaluation.condition) {
        changes.push(
          `Condition changed from ${evaluation.condition} to ${data.condition}`
        );
      }
      if (data.status_condition !== evaluation.status_condition) {
        changes.push(
          `Status Condition changed from ${evaluation.status_condition} to ${data.status_condition}`
        );
      }
      if (data.capital !== evaluation.capital) {
        changes.push(
          `Capital changed from ${evaluation.capital} to ${data.capital}`
        );
      }
      if (data.status_capital !== evaluation.status_capital) {
        changes.push(
          `Status Capital changed from ${evaluation.status_capital} to ${data.status_capital}`
        );
      }

      // Check if the data is complete (all fields are filled)
      const isComplete =
        (data.character !== undefined || evaluation.character != null) &&
        (data.status_character !== undefined ||
          reviewCustomer.status_character != null) &&
        (data.capacity !== undefined || evaluation.capacity != null) &&
        (data.status_capacity !== undefined ||
          reviewCustomer.status_capacity != null) &&
        (data.condition !== undefined || evaluation.condition != null) &&
        (data.status_condition !== undefined ||
          reviewCustomer.status_condition != null) &&
        (data.capital !== undefined || evaluation.capital != null) &&
        (data.status_capital !== undefined ||
          reviewCustomer.status_capital != null);

      let statusReview, processReport, statusReport, dateReviewCustomer;

      if (!isComplete) {
        statusReview = "DRAFT";
        processReport = "EVALUATION_SLO";
        statusReport = "GOOD";
        dateReviewCustomer = null;
      } else {
        const allFieldsValid =
          data.character &&
          data.status_character &&
          data.capacity &&
          data.status_capacity &&
          data.condition &&
          data.status_condition &&
          data.capital &&
          data.status_capital;

        if (!allFieldsValid) {
          throw new Error(
            "All fields must be filled before updating the evaluation."
          );
        }

        // Check if all status fields are "GOOD"
        const allGood =
          data.status_character === "GOOD" &&
          data.status_capacity === "GOOD" &&
          data.status_condition === "GOOD" &&
          data.status_capital === "GOOD";

        // Determine statusReport, processReport, and statusReview based on the conditions
        if (allGood) {
          statusReport = "GOOD";
          processReport = "REVIEW_AM";
          statusReview = "COMPLETED";
          dateReviewCustomer = new Date(Date.now());
        } else {
          statusReport = "BAD";
          processReport = "DECLINE_EVALUATION_SLO";
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

      // // Update the evaluation record with new data
      const updatedEvaluation = await tx.evaluation.update({
        where: { id: evaluation.id },
        data: {
          character: data.character,
          status_character: data.status_character,
          capacity: data.capacity,
          status_capacity: data.status_capacity,
          condition: data.condition,
          status_condition: data.status_condition,
          capital: data.capital,
          status_capital: data.status_capital,
          status_review: statusReview,
        },
      });

      // Update the report status and process
      await tx.report.update({
        where: { id: evaluation.report_id },
        data: {
          status: statusReport,
          process: processReport,
          review_by_slo: dateReviewCustomer,
        },
      });

      // Log changes in the review update log table if there are changes
      if (changes.length > 0) {
        await tx.evaluationUpdateLog.create({
          data: {
            evaluation_id: updatedEvaluation.id,
            updated_by: currentUser.id,
            changes: changes.join(", "),
          },
        });
      }
      return updatedEvaluation;
    });

    return result;
  }

  async list() {
    const result = await this.prisma.evaluation.findMany();
    return result;
  }
}
export default new EvaluationService();
