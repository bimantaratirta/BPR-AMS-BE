import Joi from 'joi';

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required.',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
  }),
});

const registerSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required.',
  }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .messages({
      'string.empty': 'Passw2ord is required.',
      'string.min': 'Password must be at least 8 characters long.',
      'string.pattern.base':
        'Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 special character.',
    }),
  password_confirmation: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'string.empty': 'Password confirmation is required.',
      'any.only': 'Password confirmation does not match password.',
    }),
});

const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required().messages({
    'string.empty': 'Refresh token is required.',
  }),
});

export { loginSchema, registerSchema, refreshTokenSchema };
