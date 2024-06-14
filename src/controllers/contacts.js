import createHttpError from "http-errors";
import { getAllContacts, getContactById, addContact, patchContact } from "../services/contacts.js";

import createError from "http-errors";

export const getAllContactController = async (req, res) => {
        const contacts = await getAllContacts();

        res.status(200).json({
                status: 200,
                message: 'Successfully found contacts!',
        });
};

export const getContactByIdController = async (req,res,next) => {
        const { contactId } =  req.params;
        const contact = await getContactById(contactId);

        if (!contact) {
            next(createHttpError(404,`Contact notfound`)); 
            return;
        }

        res.status(200).json({
                status: 200,
                message: `Succsesfully found contact with id ${contactId}!`,
        });

};

export const addContactController =async (req,res) => {
        const contact = await addContact(req.body);

        res.status(201).json({
                status: 201,
                messege: 'Successfuly created a contact!',
                data: contact,
        });
};

export const patchContactController = async(req, res, next) => {
        const{ contactId } = req.params;

const result = await patchContact(contactId, req.body);

        if (!result) {
                next(createHttpError(404, 'Contact not foud'));
                return;
        }

        res.json({
                status: 200,
                message: 'Successfuly patced a contact!',
                data: result,
        });
};