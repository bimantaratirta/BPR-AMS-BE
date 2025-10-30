import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const evaluationSchema = {
  create: Joi.object({
    evaluation_id: Joi.string().uuid().required(),
    review_character: Joi.string().boolean().messages(),
    review_capacity: Joi.string().boolean().messages(),
    review_condition: Joi.string().boolean().messages(),
    review_capital: Joi.string().boolean().messages(),
  }),
};
