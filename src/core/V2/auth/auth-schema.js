import Joi from 'joi';

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'REQUIRED',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'REQUIRED',
  }),
});

const registerSchema = Joi.object({
  name: Joi.string().required().min(3).messages({
    'string.empty': 'REQUIRED',
    'string.min': 'MIN_3',
  }),
  username: Joi.string().required().messages({
    'string.empty': 'REQUIRED',
  }),

  // Role harus valid
  role: Joi.string().valid('AM', 'SLO', 'LO').required().messages({
    'string.empty': 'REQUIRED',
    'any.only': 'INVALID_ROLE',
  }),

  // Kondisional validasi berdasarkan role
  region_id: Joi.when('role', {
    is: 'AM', // jika AM, region_id harus ada
    then: Joi.string().required().messages({
      'string.empty': 'REQUIRED',
    }),
    otherwise: Joi.string().optional().allow(null, ''), // selain AM, region_id bisa kosong
  }),

  branch_id: Joi.when('role', {
    is: Joi.valid('LO', 'SLO'), // jika LO atau SLO, branch_id harus ada
    then: Joi.string().required().messages({
      'string.empty': 'REQUIRED',
    }),
    otherwise: Joi.string().optional().allow(null, ''), // selain LO dan SLO, branch_id bisa kosong
  }),

  supervisor_id: Joi.string().optional().allow(null, ''),

  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .messages({
      'string.empty': 'REQUIRED',
      'string.min': 'MIN_8',
      'string.pattern.base': 'PATTERN_PW_MIN_8_UPPER_MIN_1_SPECIAL_MIN_1',
    }),

  password_confirmation: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'string.empty': 'REQUIRED',
      'any.only': 'CONFIRMATION_PW',
    }),
});

// const registerLOSchema = Joi.object({
//   name: Joi.string().required().min(3).messages({
//     'string.empty': 'REQUIRED',
//     'string.min': 'MIN_3',
//   }),
//   username: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
//   region_id: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
//   branch_id: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
//   supervisor_id: Joi.string().optional().allow(null, ''),
//   password: Joi.string()
//     .required()
//     .min(8)
//     .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
//     .messages({
//       'string.empty': 'REQUIRED',
//       'string.min': 'MIN_8',
//       'string.pattern.base': 'PATTERN_PW_MIN_8_UPPER_MIN_1_SPECIAL_MIN_1',
//     }),
//   password_confirmation: Joi.string()
//     .required()
//     .valid(Joi.ref('password'))
//     .messages({
//       'string.empty': 'REQUIRED',
//       'any.only': 'CONFIRMATION_PW',
//     }),
//   role: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
// });

// const registerSLOSchema = Joi.object({
//   name: Joi.string().required().min(3).messages({
//     'string.empty': 'REQUIRED',
//     'string.min': 'MIN_3',
//   }),
//   username: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
//   region_id: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
//   branch_id: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
//   supervisor_id: Joi.string().optional().allow(null, ''),
//   password: Joi.string()
//     .required()
//     .min(8)
//     .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
//     .messages({
//       'string.empty': 'REQUIRED',
//       'string.min': 'MIN_8',
//       'string.pattern.base': 'PATTERN_PW_MIN_8_UPPER_MIN_1_SPECIAL_MIN_1',
//     }),
//   password_confirmation: Joi.string()
//     .required()
//     .valid(Joi.ref('password'))
//     .messages({
//       'string.empty': 'REQUIRED',
//       'any.only': 'CONFIRMATION_PW',
//     }),
//   role: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
// });

// const registerAMSchema = Joi.object({
//   name: Joi.string().required().min(3).messages({
//     'string.empty': 'REQUIRED',
//     'string.min': 'MIN_3',
//   }),
//   username: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
//   region_id: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
//   password: Joi.string()
//     .required()
//     .min(8)
//     .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
//     .messages({
//       'string.empty': 'REQUIRED',
//       'string.min': 'MIN_8',
//       'string.pattern.base': 'PATTERN_PW_MIN_8_UPPER_MIN_1_SPECIAL_MIN_1',
//     }),
//   password_confirmation: Joi.string()
//     .required()
//     .valid(Joi.ref('password'))
//     .messages({
//       'string.empty': 'REQUIRED',
//       'any.only': 'CONFIRMATION_PW',
//     }),
//   role: Joi.string().required().messages({
//     'string.empty': 'REQUIRED',
//   }),
// });

const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required().messages({
    'string.empty': 'REQUIRED',
  }),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().optional().min(3).max(50).messages({
    'string.empty': 'Name cannot be empty.',
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name cannot be longer than 50 characters.',
  }),
  username: Joi.string().optional().min(3).max(30).messages({
    'string.empty': 'Username cannot be empty.',
    'string.min': 'Username must be at least 3 characters long.',
    'string.max': 'Username cannot be longer than 30 characters.',
  }),
});

export { loginSchema, registerSchema, refreshTokenSchema, updateProfileSchema };
