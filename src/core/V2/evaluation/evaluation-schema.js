import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const evaluationSchema = {
  create: Joi.object({
    report_id: Joi.string().uuid().required(),
    character: Joi.string(),
    status_character: Joi.string().valid("GOOD", "BAD").messages({
      "any.only": "status character be one of: GOOD, BAD",
    }),
    capacity: Joi.string(),
    status_capacity: Joi.string().valid("GOOD", "BAD").messages({
      "any.only": "status capacity be one of: GOOD, BAD",
    }),
    condition: Joi.string(),
    status_condition: Joi.string().valid("GOOD", "BAD").messages({
      "any.only": "status condition be one of: GOOD, BAD",
    }),
    capital: Joi.string(),
    status_capital: Joi.string().valid("GOOD", "BAD").messages({
      "any.only": "status capital be one of: GOOD, BAD",
    }),
  }),

  update: Joi.object({
    report_id: Joi.string().uuid(),
    review_identity: Joi.boolean(),
    review_domicile: Joi.boolean(),
    review_work: Joi.boolean(),
  }),
};
