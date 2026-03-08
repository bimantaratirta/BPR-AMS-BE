import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const leaveRequestSchema = {
  query: Joi.object({
    get_all: Joi.boolean().optional().default(false),

    pagination: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    })
      .default({
        page: 1,
        limit: 10,
      })
      .when("get_all", {
        is: false,
        then: Joi.optional(),
        otherwise: Joi.forbidden(),
      }),

    search: Joi.string().min(1).max(100).optional(),

    filter: Joi.object({
      status: Joi.string().valid("PENDING", "APPROVED", "REJECTED").optional(),
      type: Joi.string()
        .valid("IZIN_CUTI", "IZIN_SAKIT", "IZIN_SETENGAH_HARI")
        .optional(),
      employeeId: Joi.string().uuid().optional(),
      approvedById: Joi.string().uuid().optional(),
    }),

    order_by: Joi.array()
      .items(
        Joi.object({
          field: Joi.string().valid("created_at", "updated_at").required(),
          direction: Joi.string().valid("asc", "desc").default("asc"),
        }),
      )
      .optional(),
  }),

  create: Joi.object({
    startDate: Joi.date().iso().required().messages({
      "date.base": "startDate must be a valid date",
      "date.format": "startDate must be in ISO 8601 format",
      "any.required": "startDate is required",
    }),
    endDate: Joi.date().iso().required().messages({
      "date.base": "endDate must be a valid date",
      "date.format": "endDate must be in ISO 8601 format",
      "any.required": "endDate is required",
    }),
    reason: Joi.string().min(5).max(255).required(),
    type: Joi.string()
      .valid("IZIN_CUTI", "IZIN_SAKIT", "IZIN_SETENGAH_HARI")
      .required(),
  }),

  update: Joi.object({
    status: Joi.string().valid("APPROVED", "REJECTED").required(),
    rejectReason: Joi.string().min(5).max(255).optional(),
  }),
};

export { leaveRequestSchema };
