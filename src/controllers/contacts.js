import createHttpError from 'http-errors';
import {
  addContact,
  deleteContact,
  getAllContacts,
  getContactById,
  patchContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { createContactSchema } from '../validation/createContactSchema.js';

export const getAllContactsController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await getContactById({ contactId, userId });

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const addContactController = async (req, res, next) => {
  try {
    const { error, value } = createContactSchema.validate(req.body);

    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    const userId = req.user._id;
    const photo = req.file;

    let photoUrl;

    if (photo) {
      photoUrl = await saveFileToCloudinary(photo);
    }

    const contact = await addContact({ payload: value, userId, photo: photoUrl });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { error, value } = createContactSchema.validate(req.body, { allowUnknown: true });

    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    const { contactId } = req.params;
    const userId = req.user._id;
    const photo = req.file;

    let photoUrl;

    if (photo) {
      photoUrl = await saveFileToCloudinary(photo);
    }

    const result = await patchContact({
      contactId,
      contact: value,
      userId,
      photo: photoUrl,
    });

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await deleteContact({ contactId, userId });

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};