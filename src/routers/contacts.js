import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
        getAllContactsController,
        getContactByIdController,
        addContactController,
        patchContactController,
        deleteContactController,
} from '../controllers/contacts.js';
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema } from "../validation/createContactSchema.js";
import { updateContactSchema } from "../validation/updateConcactSchema.js";

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', validateBody(createContactSchema), ctrlWrapper(addContactController));

router.patch('/:contactId', validateBody(updateContactSchema), ctrlWrapper(patchContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;