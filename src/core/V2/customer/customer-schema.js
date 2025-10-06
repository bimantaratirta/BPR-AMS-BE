// schemas/customerSchema.js
import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const customerSchema = {
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
          field: Joi.string()
            .valid("id", "name", "created_at", "updated_at")
            .required(),
          direction: Joi.string().valid("asc", "desc").default("asc"),
        })
      )
      .optional(),

    include_relation: Joi.array()
      .items(Joi.string().valid("user", "employee", "non_employee", "business"))
      .optional(),
  }),

  create: Joi.object({
    // customer fields
    customer: Joi.object({
      name: Joi.string().required().messages({
        "string.empty": "Name is required",
      }),
      ktp_number: Joi.string()
        .length(16) // sama dengan min(16).max(16)
        .required()
        .messages({
          "string.base": "KTP must be a string",
          "string.empty": "KTP is required",
          "string.length": "KTP must be exactly 16 digits",
          "any.required": "KTP is required",
        }),
      date_of_birth: Joi.date().optional().messages({
        "date.base": "Date of birth must be a valid date",
      }),
      address: Joi.string().optional(),
      rt_rw: Joi.string().optional(),
      village: Joi.string().optional(),
      phone_number: Joi.string()
        .pattern(/^\+?[1-9]\d{7,14}$/) // format global E.164
        .optional()
        .messages({
          "string.pattern.base":
            "Phone number must be a valid international format (E.164)",
          "string.base": "Phone number must be a string",
        }),

      work_type: Joi.string()
        .valid("Pengusaha", "Karyawan Tetap", "Pekerja Lepas")
        .optional()
        .messages({
          "any.only":
            "Work type must be one of: pengusaha, karyawan tetap, pekerja lepas",
          "string.base": "Work type must be a string",
        }),
      employee_id: Joi.string().optional(),
      non_employee_id: Joi.string().optional(),
      business_id: Joi.string().optional(),
      created_by: Joi.string().optional(),
    }).required(),

    // employee fields (Optional)
    employee: Joi.object({
      company_name: Joi.string().optional(),
      company_address: Joi.string().optional(),
      company_phone: Joi.string()
        .pattern(/^\+?[1-9]\d{7,14}$/) // format global E.164
        .optional()
        .messages({
          "string.pattern.base":
            "Company number must be a valid international format (E.164)",
          "string.base": "Company number must be a string",
        }),
      position: Joi.string().optional(),
      work: Joi.string().optional(),
      salary: Joi.number().optional(),
    }).optional(),

    // non employee fields (Optional)
    non_employee: Joi.object({
      salary_frequency: Joi.string()
        .valid("bulan", "minggu", "hari")
        .optional(),
      work: Joi.string().optional(),
      salary: Joi.number().optional(),
    }).optional(),

    // business fields (Optional)
    business: Joi.object({
      business_type: Joi.string().optional(),
      employee_count: Joi.number().optional(),
      revenue: Joi.number().optional(),
    }).optional(),
  }),

  update: Joi.object({
    // customer fields
    customer: Joi.object({
      name: Joi.string().required().messages({
        "string.empty": "Name is required",
      }),
      ktp_number: Joi.string()
        .length(16) // sama dengan min(16).max(16)
        .required()
        .messages({
          "string.base": "KTP must be a string",
          "string.empty": "KTP is required",
          "string.length": "KTP must be exactly 16 digits",
          "any.required": "KTP is required",
        }),
      date_of_birth: Joi.date().optional().messages({
        "date.base": "Date of birth must be a valid date",
      }),
      address: Joi.string().optional(),
      rt_rw: Joi.string().optional(),
      village: Joi.string().optional(),
      phone_number: Joi.string()
        .pattern(/^\+?[1-9]\d{7,14}$/) // format global E.164
        .optional()
        .messages({
          "string.pattern.base":
            "Phone number must be a valid international format (E.164)",
          "string.base": "Phone number must be a string",
        }),

      work_type: Joi.string()
        .valid("Pengusaha", "Karyawan Tetap", "Pekerja Lepas")
        .optional()
        .messages({
          "any.only":
            "Work type must be one of: pengusaha, karyawan tetap, pekerja lepas",
          "string.base": "Work type must be a string",
        }),
      employee_id: Joi.string().optional(),
      non_employee_id: Joi.string().optional(),
      business_id: Joi.string().optional(),
    }).required(),

    // employee fields (Optional)
    employee: Joi.object({
      company_name: Joi.string().optional(),
      company_address: Joi.string().optional(),
      company_phone: Joi.string()
        .pattern(/^\+?[1-9]\d{7,14}$/) // format global E.164
        .optional()
        .messages({
          "string.pattern.base":
            "Company number must be a valid international format (E.164)",
          "string.base": "Company number must be a string",
        }),
      position: Joi.string().optional(),
      work: Joi.string().optional(),
      salary: Joi.number().optional(),
    }).optional(),

    // non employee fields (Optional)
    non_employee: Joi.object({
      salary_frequency: Joi.string().optional(),
      work: Joi.string().optional(),
      salary: Joi.number().optional(),
    }).optional(),

    // business fields (Optional)
    business: Joi.object({
      business_type: Joi.string().optional(),
      employee_count: Joi.number().optional(),
      revenue: Joi.number().optional(),
    }).optional(),
  }),
};
