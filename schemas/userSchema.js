import Joi from "joi";

import { emailRegexp, subscriptionList } from "../constants/userConstants.js";

const userSingupSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required().messages({ "any.required": "missing required email field" }),
	password: Joi.string().min(6).required().messages({ "any.required": "missing required password field" }),
	subscription: Joi.string().valid(...subscriptionList),
});

const userSinginSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required().messages({ "any.required": "missing required email field" }),
	password: Joi.string().min(6).required().messages({ "any.required": "missing required password field" }),
});

const userUpdateSubscriptionSchema = Joi.object({
	subscription: Joi.string()
		.valid(...subscriptionList)
		.required()
		.messages({ "any.required": "missing required subscription field" }),
});

export default {
	userSingupSchema,
	userSinginSchema,
	userUpdateSubscriptionSchema,
};
