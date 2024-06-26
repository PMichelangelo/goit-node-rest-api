import Contact from "../models/Contacts.js"

export const listContacts = (filter, setting={} ) => Contact.find(filter, "-createdAt -updatedAt", setting).populate("owner","email")

export const countContacts = filter => Contact.countDocuments(filter)

export const addContact = data => Contact.create(data)

export const getContactByFilter = filter => Contact.findOne(filter)

export const updateContactByFilter = (filter, data) => Contact.findOneAndUpdate(filter, data)

export const removeContactByFilter = filter => Contact.findOneAndDelete(filter)

