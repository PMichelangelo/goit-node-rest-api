// import fs from "fs/promises"
// import path from "path"
// import { nanoid } from "nanoid"

// const contactsPath = path.resolve("db", "contacts.json")
// console.log(contactsPath)

// const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

import Contact from "../models/Contacts.js"

export const listContacts = () => Contact.find()

// export async function getContactById(id) {
//     const contacts = await listContacts()
//     const result = contacts.find(item => item.id === id)
//     return result || null
// }

// export async function removeContact(id) {
//     const contacts = await listContacts()
//     const index = contacts.findIndex(item => item.id === id)
//     if (index === -1) {
//         return null
//     }
//     const [result] = contacts.splice(index, 1)
//     await updateContacts(contacts)
//     return result
// }

// export async function addContact(data) {
//     const contacts = await listContacts()
//     const newPerson = {
//         id: nanoid(),
//         ...data
//     }
//     contacts.push(newPerson)
//     await updateContacts(contacts)
//     return newPerson
// }

// export async function updateContactById(id, data) {
//   const contacts = await listContacts();
//   const index = contacts.findIndex((item) => item.id === id);
//   if (index === -1) {
//     return null;
//   }
//   contacts[index] = { ...contacts[index], ...data };
//   await updateContacts(contacts);

//   return contacts[index];
// }

