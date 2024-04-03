import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import * as authServices from "../services/authServices.js"

import { cntrlWrapper } from "../decorators/cntrlWrapper.js";

import HttpError from "../helpers/HttpError.js"

const {JWT_SECRET} = process.env

const register = async (req, res) => {
    const { email, password } = req.body
    const user = await authServices.findUser({ email })
    if (user) {
        throw HttpError(409, "Email alredy in use")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = await authServices.register({...req.body, password: hashPassword})

     res.status(201).json({
         email: newUser.email,
         subscription: newUser.subscription
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const { _id: id } = user;

    const payload = {
        id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

    res.json({
        token,
    })
}

export default {
    register: cntrlWrapper(register),
    login: cntrlWrapper(login)
    }