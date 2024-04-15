import express from "express"

import authControllers from "../controllers/authControllers.js"

import { userRegisterSchema, userLoginSchema, updateSubSchema } from "../schemas/usersSchemas.js"

import validateBody from "../helpers/validateBody.js"

import authenticate from "../middlewares/authenticate.js"

import upload from "../middlewares/upload.js"

const authRouter = express.Router()

authRouter.post("/register", validateBody(userRegisterSchema),authControllers.register)

authRouter.post("/login", validateBody(userLoginSchema), authControllers.login)

authRouter.post("/logout", authenticate, authControllers.logout)

authRouter.get("/current", authenticate, authControllers.getCurrent)

authRouter.patch("/subscription", authenticate, validateBody(updateSubSchema), authControllers.updateSub)

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authControllers.updateAvatar)




export default authRouter