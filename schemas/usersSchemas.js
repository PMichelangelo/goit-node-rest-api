import Joi from "joi";

import { emailRegxp, subscriptionList } from "../constants/user-constants.js";

export const userRegisterSchema = Joi.object({
    email: Joi.string().pattern(emailRegxp).required(),
    password: Joi.string().min(6).required()
})

export const userLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegxp).required(),
    password: Joi.string().min(6).required()
})

export const updateSubSchema = Joi.object({
    subscription: Joi.string().valid(...subscriptionList).required()
})