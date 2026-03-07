// schemas/customerSchema.js
import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const adminSchema = {
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
      name: Joi.string().optional(),

      created_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
      updated_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),

      created_range: Joi.object({
        start: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
        end: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
      }).when("created_at", {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.optional(),
      }),

      updated_range: Joi.object({
        start: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
        end: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
      }).when("updated_at", {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.optional(),
      }),
    }),

    order_by: Joi.array()
      .items(
        Joi.object({
          field: Joi.string().valid("created_at", "updated_at").required(),
          direction: Joi.string().valid("asc", "desc").default("asc"),
        }),
      )
      .optional(),

    include_relation: Joi.array()
      .items(Joi.string().valid("role", "permissions"))
      .optional(),
  }),

  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    role: Joi.string().valid("SUPER_ADMIN", "ADMIN", "VIEWER").default("ADMIN"),
    status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).max(100).optional(),
    status: Joi.string().valid("ACTIVE", "INACTIVE").optional(),
    role: Joi.string().valid("SUPER_ADMIN", "ADMIN", "VIEWER").optional(),
  }),
};

export { adminSchema };
