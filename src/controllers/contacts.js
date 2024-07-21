import createHttpError from 'http-errors';
import {
  addContact,
  deleteContact,
  getAllContacts,
  getContactById,
  patchContact,
} from '../services/contacts.js';
import { env } from '../utils/env.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
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

export const addContactController = async (req, res) => {
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const combinedPayload = {
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  };

  const contact = await addContact(combinedPayload);

  res.status(201).json({
    status: res.statusCode,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

// export const addContactController = async (req, res, next) => {
//   try {
//     const { error, value } = createContactSchema.validate(req.body);

//     if (error) {
//       throw createHttpError(400, error.details[0].message);
//     }

//     const userId = req.user._id;
//     const photo = req.file;

//     let photoUrl;

//     if (photo) {
//       photoUrl = await saveFileToCloudinary(photo);
//     }

//     const contact = await addContact({ payload: value, userId, photo: photoUrl });

//     res.status(201).json({
//       status: 201,
//       message: 'Successfully created a contact!',
//       data: contact,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    if (req.user._id.toString() !== contact.userId.toString()) {
      throw createHttpError(401, 'Unauthorized');
    }

    let photoUrl;

    if (req.file) {
      try {
        if (process.env.ENABLE_CLOUDINARY === 'true') {
          photoUrl = await saveFileToCloudinary(req.file);
        } else {
          photoUrl = await saveFileToUploadDir(req.file);
        }
      } catch (error) {
        console.log(error);
        return next(createHttpError(500, 'Error uploading file'));
      }
      
    }

    const updatedContact = await patchContact(contactId, {
      ...req.body,
      photo: photoUrl,
    });

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact.contact,
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