import * as authServices from "../services/authServices.js"

import { cntrlWrapper } from "../decorators/cntrlWrapper.js";

import HttpError from "../helpers/HttpError.js"

const register = async (req, res) => {
    const { email } = req.body
    const user = await authServices.findUser({ email })
    if (user) {
        throw HttpError(409, "Email alredy in use")
    }
    const newUser = await authServices.register(req.body)
    console.log(req.body)

     res.status(201).json({
        username: newUser.username,
        email: newUser.email,
    })
}

export default {
    register: cntrlWrapper(register)
    }