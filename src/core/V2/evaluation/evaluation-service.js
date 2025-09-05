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

      const statusReport =
        data.status_character === "GOOD" &&
        data.status_capacity === "GOOD" &&
        data.status_condition === "GOOD" &&
        data.status_capital === "GOOD"
          ? "GOOD"
          : "BAD";
      const processReport =
        data.status_character === "GOOD" &&
        data.status_capacity === "GOOD" &&
        data.status_condition === "GOOD" &&
        data.status_capital === "GOOD"
          ? "REVIEW_AM"
          : "DECLINE_EVALUATION_SLO";

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
        },
      });

      await tx.report.update({
        where: { id: data.report_id },
        data: { status: statusReport, process: processReport },
      });
      return evaluation;
    });
    return result;
  }

  async list() {
    const result = await this.prisma.evaluation.findMany();
    return result;
  }
}
export default new EvaluationService();
