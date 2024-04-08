import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import * as authServices from "../services/authServices.js"

import { cntrlWrapper } from "../decorators/cntrlWrapper.js";

import HttpError from "../helpers/HttpError.js"


const register = async (req, res) => {
    const { email, password } = req.body
    const user = await authServices.findUser({ email })
    if (user) {
        throw HttpError(409, "Email alredy in use")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = await authServices.register({...req.body, password: hashPassword})

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription
         }
    })
}

const login = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const { _id: id, subscription } = user;

    const payload = {
        id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "23h" });
    await authServices.updateUser({ _id: id }, { token });

    res.json({
        token,
        user: {
            email,
            subscription
        }
    })
}

const logout = async (req, res) => {
    const { _id } = req.user
    await authServices.updateUser({ _id }, { token: null })
    
    res.status(204).send()
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user
    
    res.json({email, subscription})
}

const updateSub = async (req, res) => {
    console.log(req.user)
    const { subscription } = req.body
    const { _id } = req.user;
    await authServices.updateUser({ _id } ,{subscription })
    
    res.json({
        subscription
    })
}

export default {
    register: cntrlWrapper(register),
    login: cntrlWrapper(login),
    getCurrent: cntrlWrapper(getCurrent),
    logout: cntrlWrapper(logout),
    updateSub: cntrlWrapper(updateSub)
    }