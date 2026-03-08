import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const attendanceSchema = {
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

    search: Joi.alternatives()
      .try(Joi.string().min(1).max(100), Joi.number().integer())
      .optional(),

    filter: Joi.object({
      isActive: Joi.boolean().optional(),

      status: Joi.string()
        .valid(
          "HADIR",
          "TERLAMBAT",
          "IZIN_CUTI",
          "ALPHA",
          "IZIN_SAKIT",
          "IZIN_SETENGAH_HARI",
        )
        .optional(),

      employeeId: Joi.string().uuid().optional(),
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

  checkIn: Joi.object({
    checkInLat: Joi.number().required().messages({
      "number.base": "latitude must be a number",
      "any.required": "latitude is required",
    }),
    checkInLng: Joi.number().required().messages({
      "number.base": "longitude must be a number",
      "any.required": "longitude is required",
    }),
  }),

  checkOut: Joi.object({
    checkOutLat: Joi.number().required().messages({
      "number.base": "latitude must be a number",
      "any.required": "latitude is required",
    }),
    checkOutLng: Joi.number().required().messages({
      "number.base": "longitude must be a number",
      "any.required": "longitude is required",
    }),
  }),
};

export { attendanceSchema };
