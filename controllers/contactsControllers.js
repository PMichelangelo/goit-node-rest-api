import * as contactsService from "../services/contactsServices.js";

import { cntrlWrapper } from "../decorators/cntrlWrapper.js";

import HttpError from "../helpers/HttpError.js"

 const getAllContacts = async (req, res) => {
        const results = await contactsService.listContacts()
        res.json(results)

};

 const getOneContact = async(req, res) => {
        const { id } = req.params
        const result = await contactsService.getContactById(id)
        if (!result) {
            throw HttpError(404,"Not found")
        }
        res.json(result)

};

const deleteContact = async (req, res) => {
        const { id } = req.params
        const result = await contactsService.removeContact(id)
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(result)

};

const createContact = async (req, res) => {
        const result = await contactsService.addContact(req.body)
        res.status(201).json(result)

};


const updateContact = async (req, res) => {
        const {id} = req.params;
        const result = await contactsService.updateContactById(id, req.body);
        if (!result) {
            throw HttpError(404, "Not found");
        }

        res.json(result);

}

export default {
  getAllContacts: cntrlWrapper(getAllContacts),
  getOneContact: cntrlWrapper(getOneContact),
  deleteContact: cntrlWrapper(deleteContact),
  createContact: cntrlWrapper(createContact),
  updateContact: cntrlWrapper(updateContact),
};