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
      console.log(report);
      console.log(currentUser.id);
      console.log(report.am_id);
      if (report.am_id !== currentUser.id) {
        throw BaseError.forbidden("Cannot review this report");
      }
      if (!report) {
        throw BaseError.badRequest(
          "Report must be in REVIEW_AM process to create review"
        );
      }

      const statusEvaluation =
        data.review_character &&
        data.review_capacity &&
        data.review_condition &&
        data.review_capital
          ? "GOOD"
          : "BAD";
      const processReport =
        data.review_character &&
        data.review_capacity &&
        data.review_condition &&
        data.review_capital
          ? "APPROVE_AM"
          : "DECLINE_AM";

      const reviewEvaluation = await tx.reviewEvaluation.create({
        data: {
          evaluation_id: data.evaluation_id,
          review_character: data.review_character,
          review_capacity: data.review_capacity,
          review_condition: data.review_condition,
          review_capital: data.review_capital,
        },
      });

      await tx.report.update({
        where: { id: evaluation.report_id },
        data: { status: statusEvaluation, process: processReport },
      });

      return reviewEvaluation;
    });

    return result;
  }
}
export default new ReviewEvasluationService();
