import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const evaluationSchema = {
  create: Joi.object({
    report_id: Joi.string().uuid().required(),
    character: Joi.string().required(),
    status_character: Joi.string().valid("GOOD", "BAD").required().messages({
      "any.only": "status character be one of: GOOD, BAD",
      "any.required": "status character is required",
    }),
    capacity: Joi.string().required(),
    status_capacity: Joi.string().valid("GOOD", "BAD").required().messages({
      "any.only": "status capacity be one of: GOOD, BAD",
      "any.required": "status capacity is required",
    }),
    condition: Joi.string().required(),
    status_condition: Joi.string().valid("GOOD", "BAD").required().messages({
      "any.only": "status condition be one of: GOOD, BAD",
      "any.required": "status condition is required",
    }),
    capital: Joi.string().required(),
    status_capital: Joi.string().valid("GOOD", "BAD").required().messages({
      "any.only": "status capital be one of: GOOD, BAD",
      "any.required": "status capital is required",
    }),
  }),

  update: Joi.object({
    report_id: Joi.string().uuid().required(),
    review_identity: Joi.boolean().required(),
    review_domicile: Joi.boolean().required(),
    review_work: Joi.boolean().required(),
  }),
};
