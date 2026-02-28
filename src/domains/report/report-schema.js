// schemas/customerSchema.js
import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const reportSchema = {
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
      status: Joi.string().valid("GOOD", "BAD").optional(),
      process: Joi.string()
        .valid(
          "DECLINE_LO",
          "REVIEW_SLO",
          "DECLINE_REVIEW_SLO",
          "EVALUATION_SLO",
          "DECLINE_EVALUATION_SLO",
          "REVIEW_AM",
          "APPROVE_AM",
          "DECLINE_AM"
        )
        .optional(),
      lo_id: Joi.string().uuid().optional().messages({
        "string.guid": "lo_id must be a valid UUID",
      }),
      slo_id: Joi.string().uuid().optional().messages({
        "string.guid": "slo_id must be a valid UUID",
      }),
      am_id: Joi.string().uuid().optional().messages({
        "string.guid": "am_id must be a valid UUID",
      }),

      created_at: Joi.date().format("YYYY-MM-DD").optional(),
      updated_at: Joi.date().format("YYYY-MM-DD").optional(),

      created_range: Joi.object({
        start: Joi.date().format("YYYY-MM-DD").optional(),
        end: Joi.date().format("YYYY-MM-DD").optional(),
      }).when("created_at", {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.optional(),
      }),

      updated_range: Joi.object({
        start: Joi.date().format("YYYY-MM-DD").optional(),
        end: Joi.date().format("YYYY-MM-DD").optional(),
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
      .items(
        Joi.string().valid(
          "lo",
          "slo",
          "am",
          "customer",
          "report_photo",
          "review_customer",
          "evaluation"
        )
      )
      .optional(),
  }),

  create: Joi.object({
    customer_id: Joi.string().uuid().required().messages({
      "string.base": "customer_id must be a string",
      "string.guid": "customer_id must be a valid UUID",
      "any.required": "customer_id is required",
    }),

    lo_id: Joi.string().uuid().optional().messages({
      "string.guid": "lo_id must be a valid UUID",
    }),
    slo_id: Joi.string().uuid().optional().messages({
      "string.guid": "slo_id must be a valid UUID",
    }),
    am_id: Joi.string().uuid().optional().messages({
      "string.guid": "am_id must be a valid UUID",
    }),

    // status & process
    status: Joi.string().valid("GOOD", "BAD").required().messages({
      "any.only": "status must be one of: GOOD, BAD",
      "any.required": "status is required",
    }),

    process: Joi.string()
      .valid(
        "DECLINE_LO",
        "REVIEW_SLO",
        "DECLINE_REVIEW_SLO",
        "EVALUATION_SLO",
        "DECLINE_EVALUATION_SLO",
        "REVIEW_AM",
        "ACCEPTED_AM",
        "DECLINE_AM"
      )
      .allow(null)
      .optional()
      .messages({
        "any.only":
          "process must be one of: DECLINE_LO, REVIEW_SLO, DECLINE_REVIEW_SLO, EVALUATION_SLO, DECLINE_EVALUATION_SLO, REVIEW_AM, ACCEPTED_AM, DECLINE_AM, ",
      }),

    // snapshots
    customer_snapshot: Joi.object({
      id: Joi.string().uuid().optional(),
      name: Joi.string().optional(),
      ktp_number: Joi.string().length(16).optional(),
      date_of_birth: Joi.date().optional(),
      address: Joi.string().optional(),
      rt_rw: Joi.string().optional(),
      village: Joi.string().optional(),
      phone_number: Joi.string().optional(),
      employee_id: Joi.string().uuid().allow(null).optional(),
      non_employee_id: Joi.string().uuid().allow(null).optional(),
      business_id: Joi.string().uuid().allow(null).optional(),
      work_type: Joi.string().allow(null).optional(),
      created_by: Joi.string().uuid().allow(null).optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    })
      .unknown(true) // biar fleksibel kalau ada kolom tambahan
      // .required()
      .messages({
        "object.base": "customer_snapshot must be an object",
        // 'any.required': 'customer_snapshot is required',
      }),

    employee_snapshot: Joi.object({
      id: Joi.string().uuid().optional(),
      company_name: Joi.string().optional(),
      company_address: Joi.string().optional(),
      company_phone: Joi.string().optional(),
      position: Joi.string().optional(),
      occupation: Joi.string().optional(),
      salary: Joi.number().optional(),
      salaryFrequency: Joi.string().optional(), // jika kamu simpan
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    })
      .unknown(true)
      .optional(),

    non_employee_snapshot: Joi.object({
      id: Joi.string().uuid().optional(),
      salary_frequency: Joi.string().optional(),
      occupation: Joi.string().optional(),
      salary: Joi.number().optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    })
      .unknown(true)
      .optional(),

    business_snapshot: Joi.object({
      id: Joi.string().uuid().optional(),
      business_type: Joi.string().optional(),
      employee_count: Joi.string().optional(),
      revenue: Joi.number().optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    })
      .unknown(true)
      .optional(),
  })
    // Custom rule: maksimal satu dari tiga snapshot pekerjaan/usaha
    .custom((value, helpers) => {
      const keys = [
        "employee_snapshot",
        "non_employee_snapshot",
        "business_snapshot",
      ];
      const filled = keys.filter((k) => !!value[k]);
      if (filled.length > 1) {
        return helpers.error("any.invalid", {
          message:
            "Only one of employee_snapshot, non_employee_snapshot, or business_snapshot may be provided",
        });
      }
      return value;
    }, "at most one work snapshot")
    .messages({
      "any.invalid":
        "Only one of employee_snapshot, non_employee_snapshot, or business_snapshot may be provided",
    }),

  update: Joi.object({
    customer_id: Joi.string().uuid().required().messages({
      "string.base": "customer_id must be a string",
      "string.guid": "customer_id must be a valid UUID",
      "any.required": "customer_id is required",
    }),

    lo_id: Joi.string().uuid().optional().messages({
      "string.guid": "lo_id must be a valid UUID",
    }),
    slo_id: Joi.string().uuid().optional().messages({
      "string.guid": "slo_id must be a valid UUID",
    }),
    am_id: Joi.string().uuid().optional().messages({
      "string.guid": "am_id must be a valid UUID",
    }),

    // status & process
    status: Joi.string().valid("GOOD", "BAD").required().messages({
      "any.only": "status must be one of: GOOD, BAD",
      "any.required": "status is required",
    }),

    process: Joi.string()
      .valid(
        "DECLINE_LO",
        "REVIEW_SLO",
        "DECLINE_REVIEW_SLO",
        "EVALUATION_SLO",
        "DECLINE_EVALUATION_SLO",
        "REVIEW_AM",
        "ACCEPTED_AM",
        "DECLINE_AM"
      )
      .allow(null)
      .optional()
      .messages({
        "any.only":
          "process must be one of: DECLINE_LO, REVIEW_SLO, DECLINE_REVIEW_SLO, EVALUATION_SLO, DECLINE_EVALUATION_SLO, REVIEW_AM, ACCEPTED_AM, DECLINE_AM, ",
      }),
    // snapshots
    customer_snapshot: Joi.object({
      id: Joi.string().uuid().optional(),
      name: Joi.string().optional(),
      ktp_number: Joi.string().length(16).optional(),
      date_of_birth: Joi.date().optional(),
      address: Joi.string().optional(),
      rt_rw: Joi.string().optional(),
      village: Joi.string().optional(),
      phone_number: Joi.string().optional(),
      employee_id: Joi.string().uuid().allow(null).optional(),
      non_employee_id: Joi.string().uuid().allow(null).optional(),
      business_id: Joi.string().uuid().allow(null).optional(),
      created_by: Joi.string().uuid().allow(null).optional(),
      work_type: Joi.string().allow(null).optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    })
      .unknown(true) // biar fleksibel kalau ada kolom tambahan
      .required()
      .messages({
        "object.base": "customer_snapshot must be an object",
        "any.required": "customer_snapshot is required",
      }),

    employee_snapshot: Joi.object({
      id: Joi.string().uuid().optional(),
      company_name: Joi.string().optional(),
      company_address: Joi.string().optional(),
      company_phone: Joi.string().optional(),
      position: Joi.string().optional(),
      occupation: Joi.string().optional(),
      salary: Joi.number().optional(),
      salaryFrequency: Joi.string().optional(), // jika kamu simpan
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    })
      .unknown(true)
      .optional(),

    non_employee_snapshot: Joi.object({
      id: Joi.string().uuid().optional(),
      salary_frequency: Joi.string().optional(),
      occupation: Joi.string().optional(),
      salary: Joi.number().optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    })
      .unknown(true)
      .optional(),

    business_snapshot: Joi.object({
      id: Joi.string().uuid().optional(),
      business_type: Joi.string().optional(),
      employee_count: Joi.string().optional(),
      revenue: Joi.number().optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    })
      .unknown(true)
      .optional(),
  })
    // Custom rule: maksimal satu dari tiga snapshot pekerjaan/usaha
    .custom((value, helpers) => {
      const keys = [
        "employee_snapshot",
        "non_employee_snapshot",
        "business_snapshot",
      ];
      const filled = keys.filter((k) => !!value[k]);
      if (filled.length > 1) {
        return helpers.error("any.invalid", {
          message:
            "Only one of employee_snapshot, non_employee_snapshot, or business_snapshot may be provided",
        });
      }
      return value;
    }, "at most one work snapshot")
    .messages({
      "any.invalid":
        "Only one of employee_snapshot, non_employee_snapshot, or business_snapshot may be provided",
    }),
};
