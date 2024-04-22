import fs from "fs/promises"
import path from "path"

import bcrypt from "bcrypt"
import gravatar from "gravatar"

import jwt from "jsonwebtoken"
import { nanoid } from "nanoid"
import Jimp from "jimp"

import * as authServices from "../services/authServices.js"

import { cntrlWrapper } from "../decorators/cntrlWrapper.js";

import HttpError from "../helpers/HttpError.js"
import sendEmail from "../helpers/sendEmail.js"

const { BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars")

const register = async (req, res) => {
    const { email, password } = req.body
    const user = await authServices.findUser({ email })
    if (user) {
        throw HttpError(409, "Email alredy in use")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const verificationToken = nanoid()

    const avatarURL = gravatar.url(email, {s: "250", d: "retro"})

    const newUser = await authServices.register({
        ...req.body,
        password: hashPassword,
        avatarURL: avatarURL,
        verificationToken
    })

    const verifyEmail = {
        to: email,
        subject: "Verify Email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail)

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription
         }
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params
    const user = await authServices.findUser({ verificationToken })
    if (!user) {
        throw HttpError(404, "User not found")
    }

    await authServices.updateUser({ _id: user._id }, { verify: true, verificationToken: "" })
    
    res.json({
        message: "Verification successful"
    })
}

const resendVerify = async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw HttpError(400, "Missing required field email")
    }
    const user = await authServices.findUser({ email })
    if (!user) {
        throw HttpError(404,"Email not found")
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed")
    }

    const verifyEmail = {
        to: email,
        subject: "Verify Email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail)

    res.json({
        message:"Verification email sent"
    })
}

const login = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verify")
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

const updateAvatar = async (req, res) => {
    if (!req.file) {
        throw HttpError(400, "No file uploaded")
    }

    const { path: oldPatch, filename } = req.file
    const { _id } = req.user
    
    const image = await Jimp.read(oldPatch)
    await image.cover(250, 250).writeAsync(oldPatch)

    const newFileName = `${_id}_${filename}`

    const newPath = path.join(avatarPath, newFileName)
    await fs.rename(oldPatch, newPath)

    const avatarURL = path.join("avatars", newFileName)

    await authServices.updateUser({ _id }, { avatarURL })
    res.status(200).json({avatarURL})

}

export default {
    register: cntrlWrapper(register),
    verify: cntrlWrapper(verify),
    resendVerify: cntrlWrapper(resendVerify),
    login: cntrlWrapper(login),
    getCurrent: cntrlWrapper(getCurrent),
    logout: cntrlWrapper(logout),
    updateSub: cntrlWrapper(updateSub),
    updateAvatar: cntrlWrapper(updateAvatar)
    }