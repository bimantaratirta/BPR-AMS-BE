import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const branchSchema = {
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
    name: Joi.string().min(3).max(100).required(),
    address: Joi.string().min(5).max(255).required(),
    latitude: Joi.number().required().messages({
      "number.base": "latitude must be a number",
      "any.required": "latitude is required",
    }),
    longitude: Joi.number().required().messages({
      "number.base": "longitude must be a number",
      "any.required": "longitude is required",
    }),
    radius: Joi.number().integer().min(0).required().messages({
      "number.base": "radius must be a number",
      "number.integer": "radius must be an integer",
      "number.min": "radius must be at least 0",
      "any.required": "radius is required",
    }),
    isActive: Joi.boolean().default(true),
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    address: Joi.string().min(5).max(255).optional(),
    latitude: Joi.number().optional().messages({
      "number.base": "latitude must be a number",
    }),
    longitude: Joi.number().optional().messages({
      "number.base": "longitude must be a number",
    }),
    radius: Joi.number().integer().min(0).optional().messages({
      "number.base": "radius must be a number",
      "number.integer": "radius must be an integer",
      "number.min": "radius must be at least 0",
    }),
    isActive: Joi.boolean().optional(),
  }),
};

export { branchSchema };
