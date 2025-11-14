import Joi from "joi";

export const createBranchSchema = Joi.object({
  region_id: Joi.string().required().messages({
    "string.empty": "REQUIRED",
  }),
  branch: Joi.string().min(2).required().messages({
    "string.empty": "REQUIRED",
    "string.min": "MIN_2",
  }),
  address: Joi.string().allow("").optional(),
});

export const updateBranchSchema = Joi.object({
  region_id: Joi.string().required().messages({
    "string.empty": "REQUIRED",
  }),
  branch: Joi.string().min(2).required().messages({
    "string.empty": "REQUIRED",
    "string.min": "MIN_2",
  }),
  address: Joi.string().allow("").optional(),
});
