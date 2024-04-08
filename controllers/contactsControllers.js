import * as contactsService from "../services/contactsServices.js";

import { cntrlWrapper } from "../decorators/cntrlWrapper.js";

import HttpError from "../helpers/HttpError.js"
import { query } from "express";

const getAllContacts = async (req, res) => {
    const { owner } = req.locals;
    const { page = 1, limit = 20, favorite } = req.query;
    const queryOptions = { owner };

    if (favorite && favorite.toLowerCase() === 'true') {
        queryOptions.favorite = true;
    }

    const skip = (page - 1) * limit;
    const results = await contactsService.listContacts(queryOptions, { skip, limit });
    const total = await contactsService.countContacts({ owner, ...queryOptions });

    res.json({ results, total });
};

const getOneContact = async (req, res) => {
        const {owner} = req.locals
        const { id } = req.params
        const result = await contactsService.getContactByFilter({owner, _id: id})
        if (!result) {
            throw HttpError(404,"Not found")
        }
        res.json(result)

};

const deleteContact = async (req, res) => {
        const {owner} = req.locals
        const { id } = req.params
        const result = await contactsService.removeContactByFilter({owner, _id: id})
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(result)

};

const createContact = async (req, res) => {
        const {owner} = req.locals
        const result = await contactsService.addContact({ ...req.body, owner})
        res.status(201).json(result)

};


const updateContact = async (req, res) => {
        const {owner} = req.locals
        const {id} = req.params;
        const result = await contactsService.updateContactByFilter({owner,_id: id}, req.body);
        if (!result) {
            throw HttpError(404, "Not found");
        }

        res.json(result);

}

const getFavoriteContacts = async (req, res) => {
        const favoriteContacts = await contactsService.findFavoriteByQuery({ favorite: true })

        res.json({ favoriteContacts })
}

export default {
        getAllContacts: cntrlWrapper(getAllContacts),
        getOneContact: cntrlWrapper(getOneContact),
        deleteContact: cntrlWrapper(deleteContact),
        createContact: cntrlWrapper(createContact),
        updateContact: cntrlWrapper(updateContact),
        getFavoriteContacts:cntrlWrapper(getFavoriteContacts)
};