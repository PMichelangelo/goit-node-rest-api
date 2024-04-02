import express from "express"

import authControllers from "../controllers/authControllers.js"

import { userRegisterSchema, userLoginSchema } from "../schemas/usersSchemas.js"

import validateBody from "../helpers/validateBody.js"

const authRouter = express.Router()

authRouter.post("/register", validateBody(userRegisterSchema),authControllers.register)



export default authRouter