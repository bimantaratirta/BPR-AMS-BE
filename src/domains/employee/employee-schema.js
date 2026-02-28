import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const employeeSchema = {
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
      isActive: Joi.boolean().optional(),

      branchId: Joi.string().optional(),
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

  update: Joi.object({
    password: Joi.string().min(6).optional(),
    email: Joi.string().email().optional(),
    name: Joi.string().min(3).max(100).optional(),
    isActive: Joi.boolean().optional(),
    branchId: Joi.string().uuid().optional(),
    nik: Joi.string().min(16).max(16).optional(),
    deviceId: Joi.string().optional(),
    phone: Joi.string()
      .pattern(/^08[0-9]{8,11}$/)
      .optional()
      .messages({
        "string.pattern.base":
          "phone number must start with '08' and be 10 to 13 digits long",
      }),
    role: Joi.string().optional(),
    avatar: Joi.string().optional(),
    deviceModel: Joi.string().optional(),
    deviceOs: Joi.string().optional(),
  }),
};

export { employeeSchema };
