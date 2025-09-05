import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

export const evaluationSchema = {
  create: Joi.object({
    evaluation_id: Joi.string().uuid().required(),
    review_character: Joi.string().boolean().required().messages({
      "any.required": "review character is required",
    }),
    review_capacity: Joi.string().boolean().required().messages({
      "any.required": "review capacity is required",
    }),
    review_condition: Joi.string().boolean().required().messages({
      "any.required": "review condition is required",
    }),
    review_capital: Joi.string().boolean().required().messages({
      "any.required": "review capital is required",
    }),
  }),
};
