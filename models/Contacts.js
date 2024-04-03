import { Schema, model } from "mongoose";

import { handleSaveError, setUpdateSetting } from './hooks.js'

const contactsSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
}, {versionKey: false, timestamps: true})

contactsSchema.post("save", handleSaveError)

contactsSchema.pre("findOneAndUpdate", setUpdateSetting)

contactsSchema.post("findOneAndUpdate", handleSaveError)

const Contact = model("contact", contactsSchema)

export default Contact