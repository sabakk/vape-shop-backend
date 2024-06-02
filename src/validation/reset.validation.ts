import { Joi } from 'express-validation';

export const ForgotValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
export const ResetValidation = {
  body: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
    password_confirm: Joi.string().required(),
  }),
};
