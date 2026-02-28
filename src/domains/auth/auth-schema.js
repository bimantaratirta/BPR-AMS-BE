import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const authSchema = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  registerAdmin: Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    password_confirmation: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "password confirmation does not match",
      }),
    role: Joi.string().valid("SUPER_ADMIN", "ADMIN", "VIEWER").required(),
    status: Joi.string().valid("ACTIVE", "INACTIVE").required(),
  }),

  registerEmployee: Joi.object({
    nik: Joi.string().min(16).max(16).required(),
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    password_confirmation: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "password confirmation does not match",
      }),
    role: Joi.string().required(),
    branchId: Joi.string().required(),
    isActive: Joi.boolean().required(),
  }),
};

export { authSchema };
