import JoiDate from "@joi/date";
import JoiBase from "joi";
import { update } from "lodash";

const Joi = JoiBase.extend(JoiDate);

export const reviewCustomerSchema = {
  create: Joi.object({
    report_id: Joi.string().uuid().required(),
    review_identity: Joi.boolean().required(),
    review_domicile: Joi.boolean().required(),
    review_work: Joi.boolean().required(),
  }),

  update: Joi.object({
    report_id: Joi.string().uuid().required(),
    review_identity: Joi.boolean().required(),
    review_domicile: Joi.boolean().required(),
    review_work: Joi.boolean().required(),
  }),
};
