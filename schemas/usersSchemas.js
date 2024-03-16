import Joi from "joi";

export const createUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const resendVerificationEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
