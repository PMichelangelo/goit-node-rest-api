import User from "../models/user.js";

export const findUser = filter => User.findOne(filter)

export const register = data => User.create(data)