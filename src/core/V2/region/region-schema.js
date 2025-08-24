import Joi from 'joi';

export const createRegionSchema = Joi.object({
  region: Joi.string().min(2).required().messages({
    'string.empty': 'REQUIRED',
    'string.min': 'MIN_2',
  }),
});

export const updateRegionSchema = Joi.object({
  region: Joi.string().min(2).required().messages({
    'string.empty': 'REQUIRED',
    'string.min': 'MIN_2',
  }),
});
