import { Schema, model } from "mongoose";

import { handleSaveError, setUpdateSettings } from "./hooks.js";

import { emailRegxp, subscriptionList } from "../constants/user-constants.js";

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    match:emailRegxp,
    required: [true, 'Email is required'],
    unique: true,
    
  },
  subscription: {
    type: String,
    enum: subscriptionList,
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
},{ versionKey: false, timestamps: true })

userSchema.post("save", handleSaveError)

userSchema.pre("findOneByUpdate", setUpdateSettings)

userSchema.post("findOneByUpdate", handleSaveError)

const User = model("user", userSchema)

export default User;
