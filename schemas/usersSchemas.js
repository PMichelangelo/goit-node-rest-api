import Joi from "joi";

import { emailRegxp } from "../constants/user-constants.js";

export const userRegisterSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().pattern(emailRegxp).required(),
    password: Joi.string().min(6).required()
})

export const userLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegxp).required(),
    password: Joi.string().min(6).required()
})