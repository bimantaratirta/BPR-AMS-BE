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

  create: Joi.object({
    nik: Joi.string().min(16).max(16).required().messages({
      "string.min": "NIK harus 16 digit",
      "string.max": "NIK harus 16 digit",
      "any.required": "NIK wajib diisi",
    }),
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    branchId: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^08[0-9]{8,11}$/)
      .optional()
      .allow("", null)
      .messages({
        "string.pattern.base":
          "Nomor HP harus diawali '08' dan terdiri dari 10-13 digit",
      }),
    role: Joi.string().optional().allow("", null),
    isActive: Joi.boolean().optional().default(true),
  }),

  update: Joi.object({
    nik: Joi.string().min(16).max(16).optional().messages({
      "string.min": "NIK harus 16 digit",
      "string.max": "NIK harus 16 digit",
    }),
    name: Joi.string().min(3).max(100).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    isActive: Joi.boolean().optional(),
    branchId: Joi.string().optional(),
    deviceId: Joi.string().optional().allow("", null),
    phone: Joi.string()
      .pattern(/^08[0-9]{8,11}$/)
      .optional()
      .allow("", null)
      .messages({
        "string.pattern.base":
          "Nomor HP harus diawali '08' dan terdiri dari 10-13 digit",
      }),
    role: Joi.string().optional().allow("", null),
    avatar: Joi.string().optional(),
    deviceModel: Joi.string().optional(),
    deviceOs: Joi.string().optional(),
  }),
};

export { employeeSchema };
